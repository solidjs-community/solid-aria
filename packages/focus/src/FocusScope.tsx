/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  Accessor,
  children,
  createContext,
  createEffect,
  createMemo,
  createReaction,
  createSignal,
  JSX,
  onCleanup,
  Setter,
  useContext
} from "solid-js";

import { focusSafely } from "./focusSafely";
import { isElementVisible } from "./isElementVisible";

interface FocusScopeProps {
  /**
   * The contents of the focus scope.
   */
  children?: JSX.Element;

  /**
   * Whether to contain focus inside the scope, so users cannot
   * move focus outside, for example in a modal dialog.
   */
  contain?: boolean;

  /**
   * Whether to restore focus back to the element that was focused
   * when the focus scope mounted, after the focus scope unmounts.
   */
  restoreFocus?: boolean;

  /**
   * Whether to auto focus the first focusable element in the focus scope on mount.
   */
  autoFocus?: boolean;
}

interface FocusManagerOptions {
  /**
   * The element to start searching from.
   * The currently focused element by default.
   */
  from?: HTMLElement;

  /**
   * Whether to only include tabbable elements, or all focusable elements.
   */
  tabbable?: boolean;

  /**
   *  Whether focus should wrap around when it reaches the end of the scope.
   */
  wrap?: boolean;
}

export interface FocusManager {
  /**
   * Moves focus to the next focusable or tabbable element in the focus scope.
   */
  focusNext(opts?: FocusManagerOptions): HTMLElement;

  /**
   * Moves focus to the previous focusable or tabbable element in the focus scope.
   */
  focusPrevious(opts?: FocusManagerOptions): HTMLElement;

  /**
   * Moves focus to the first focusable or tabbable element in the focus scope.
   */
  focusFirst(opts?: FocusManagerOptions): HTMLElement;

  /**
   * Moves focus to the last focusable or tabbable element in the focus scope.
   */
  focusLast(opts?: FocusManagerOptions): HTMLElement;
}

type ScopeRef = HTMLElement[];

interface FocusContextValue {
  scopeRef: Accessor<ScopeRef>;
  setScopeRef: Setter<ScopeRef>;
  parentScope: Accessor<ScopeRef | null>;
  focusManager: FocusManager;
}

const FocusContext = createContext<FocusContextValue>();

let activeScope: ScopeRef | null = null;
const scopes: Map<ScopeRef, ScopeRef | null> = new Map();

function FocusScopeContainer(props: FocusScopeProps) {
  let startRef: HTMLSpanElement | undefined;
  let endRef: HTMLSpanElement | undefined;

  // The context always exists because `FocusScopeContainer` is only used in `FocusScope`.
  // eslint-disable-next-line
  const ctx = useContext(FocusContext)!;

  const resolvedChildren = children(() => props.children);

  createEffect(() => {
    // hacks to trigger the effect when this dependencies changes.
    resolvedChildren();
    ctx.parentScope();

    // Find all rendered nodes between the sentinels and add them to the scope.
    let node = startRef?.nextSibling;
    const nodes = [];

    while (node && node !== endRef) {
      nodes.push(node);
      node = node.nextSibling;
    }

    ctx.setScopeRef(nodes as HTMLElement[]);
  });

  createEffect(() => {
    const scopeRef = ctx.scopeRef();
    const parentScope = ctx.parentScope();

    scopes.set(scopeRef, parentScope);

    onCleanup(() => {
      // Restore the active scope on unmount if this scope or a descendant scope is active.
      // Parent effect cleanups run before children, so we need to check if the
      // parent scope actually still exists before restoring the active scope to it.
      if (
        (scopeRef === activeScope || isAncestorScope(scopeRef, activeScope)) &&
        (!parentScope || scopes.has(parentScope))
      ) {
        activeScope = parentScope;
      }

      scopes.delete(scopeRef);
    });
  });

  createFocusContainment(ctx.scopeRef, () => !!props.contain);

  createRestoreFocus(
    ctx.scopeRef,
    () => !!props.restoreFocus,
    () => !!props.contain
  );

  const autoFocusReaction = createReaction(() => {
    if (!props.autoFocus) {
      return;
    }

    activeScope = ctx.scopeRef();

    // Use `queueMicrotask` to ensure DOM elements has been rendered
    // and things like browser `autofocus` has run first.
    queueMicrotask(() => {
      if (activeScope && !isElementInScope(document.activeElement, activeScope)) {
        focusFirstInScope(ctx.scopeRef());
      }
    });
  });

  // Auto focus logic is done via a reaction and run only once when scopeRef changes.
  // This ensure scopeRef is not empty when trying to focus an element in the `FocusScope`.
  autoFocusReaction(ctx.scopeRef);

  return (
    <>
      <span data-focus-scope-start hidden ref={startRef} />
      {resolvedChildren()}
      <span data-focus-scope-end hidden ref={endRef} />
    </>
  );
}

/**
 * A FocusScope manages focus for its descendants. It supports containing focus inside
 * the scope, restoring focus to the previously focused element on unmount, and auto
 * focusing children on mount. It also acts as a container for a programmatic focus
 * management interface that can be used to move focus forward and back in response
 * to user events.
 */
export function FocusScope(props: FocusScopeProps) {
  const [scopeRef, setScopeRef] = createSignal<ScopeRef>([]);

  const parentContext = useContext(FocusContext);
  const parentScope = () => parentContext?.scopeRef() ?? null;

  const focusManager = createFocusManagerForScope(scopeRef);

  const context: FocusContextValue = {
    scopeRef,
    setScopeRef,
    parentScope,
    focusManager
  };

  return (
    <FocusContext.Provider value={context}>
      <FocusScopeContainer {...props} />
    </FocusContext.Provider>
  );
}

/**
 * Returns a FocusManager interface for the parent FocusScope.
 * A FocusManager can be used to programmatically move focus within a FocusScope,
 * e.g. in response to user events like keyboard navigation.
 */
export function useFocusManager(): FocusManager {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error("[solid-aria]: useFocusManager should be used in a <FocusScope>");
  }

  return context.focusManager;
}

function createFocusManagerForScope(scopeRef: Accessor<HTMLElement[]>): FocusManager {
  return {
    focusNext(opts: FocusManagerOptions = {}) {
      const scope = scopeRef();
      const { from, tabbable, wrap } = opts;
      const node = from || document.activeElement;
      const sentinel = scope[0].previousElementSibling;
      const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable }, scope);

      walker.currentNode = (isElementInScope(node!, scope) ? node : sentinel) as Node;
      let nextNode = walker.nextNode() as HTMLElement;

      if (!nextNode && wrap) {
        walker.currentNode = sentinel as Node;
        nextNode = walker.nextNode() as HTMLElement;
      }

      if (nextNode) {
        focusElement(nextNode, true);
      }

      return nextNode;
    },
    focusPrevious(opts: FocusManagerOptions = {}) {
      const scope = scopeRef();
      const { from, tabbable, wrap } = opts;
      const node = from || document.activeElement;
      const sentinel = scope[scope.length - 1].nextElementSibling;
      const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable }, scope);
      walker.currentNode = (isElementInScope(node!, scope) ? node : sentinel) as Node;
      let previousNode = walker.previousNode() as HTMLElement;

      if (!previousNode && wrap) {
        walker.currentNode = sentinel as Node;
        previousNode = walker.previousNode() as HTMLElement;
      }

      if (previousNode) {
        focusElement(previousNode, true);
      }

      return previousNode;
    },
    focusFirst(opts = {}) {
      const scope = scopeRef();
      const { tabbable } = opts;
      const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable }, scope);
      walker.currentNode = scope[0].previousElementSibling as Node;
      const nextNode = walker.nextNode() as HTMLElement;

      if (nextNode) {
        focusElement(nextNode, true);
      }

      return nextNode;
    },
    focusLast(opts = {}) {
      const scope = scopeRef();
      const { tabbable } = opts;
      const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable }, scope);
      walker.currentNode = scope[scope.length - 1].nextElementSibling as Node;
      const previousNode = walker.previousNode() as HTMLElement;

      if (previousNode) {
        focusElement(previousNode, true);
      }

      return previousNode;
    }
  };
}

const focusableElements = [
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "summary",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]"
];

const FOCUSABLE_ELEMENT_SELECTOR =
  focusableElements.join(":not([hidden]),") + ",[tabindex]:not([disabled]):not([hidden])";

const tabbableElements = [...focusableElements, '[tabindex]:not([tabindex="-1"]):not([disabled])'];

const TABBABLE_ELEMENT_SELECTOR = tabbableElements.join(':not([hidden]):not([tabindex="-1"]),');

function getScopeRoot(scope: HTMLElement[]) {
  return scope[0].parentElement;
}

function createFocusContainment(scopeRef: Accessor<HTMLElement[]>, contain: Accessor<boolean>) {
  let focusedNode: HTMLElement;
  let raf: number;

  // Handle the Tab key to contain focus within the scope
  const onKeyDown = (e: KeyboardEvent) => {
    const scope = scopeRef();

    if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey || scope !== activeScope) {
      return;
    }

    const focusedElement = document.activeElement as HTMLElement;

    if (!isElementInScope(focusedElement, scope)) {
      return;
    }

    const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable: true }, scope);
    walker.currentNode = focusedElement;

    let nextElement = (
      e.shiftKey ? walker.previousNode() : walker.nextNode()
    ) as HTMLElement | null;

    if (!nextElement) {
      if (e.shiftKey) {
        walker.currentNode = scope[scope.length - 1].nextElementSibling as Node;
      } else {
        walker.currentNode = scope[0].previousElementSibling as Node;
      }

      nextElement = (e.shiftKey ? walker.previousNode() : walker.nextNode()) as HTMLElement;
    }

    e.preventDefault();

    if (nextElement) {
      focusElement(nextElement, true);
    }
  };

  const onFocus = (e: FocusEvent) => {
    const scope = scopeRef();

    // If focusing an element in a child scope of the currently active scope, the child becomes active.
    // Moving out of the active scope to an ancestor is not allowed.
    if (!activeScope || isAncestorScope(activeScope, scope)) {
      activeScope = scope;
      focusedNode = e.target as HTMLElement;
    } else if (scope === activeScope && !isElementInChildScope(e.target as HTMLElement, scope)) {
      // If a focus event occurs outside the active scope (e.g. user tabs from browser location bar),
      // restore focus to the previously focused node or the first tabbable element in the active scope.
      if (focusedNode) {
        focusedNode.focus();
      } else if (activeScope) {
        focusFirstInScope(activeScope);
      }
    } else if (scope === activeScope) {
      focusedNode = e.target as HTMLElement;
    }
  };

  const onBlur = (e: FocusEvent) => {
    const scope = scopeRef();

    // Firefox doesn't shift focus back to the Dialog properly without this
    raf = requestAnimationFrame(() => {
      // Use document.activeElement instead of e.relatedTarget so we can tell if user clicked into iframe
      if (scope === activeScope && !isElementInChildScope(document.activeElement, scope)) {
        activeScope = scope;
        focusedNode = e.target as HTMLElement;
        focusedNode.focus();
      }
    });
  };

  createEffect(() => {
    const scope = scopeRef();

    if (!contain()) {
      return;
    }

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("focusin", onFocus, false);

    scope.forEach(element => element.addEventListener("focusin", onFocus, false));
    scope.forEach(element => element.addEventListener("focusout", onBlur, false));

    onCleanup(() => {
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("focusin", onFocus, false);

      scope.forEach(element => element.removeEventListener("focusin", onFocus, false));
      scope.forEach(element => element.removeEventListener("focusout", onBlur, false));
    });
  });

  onCleanup(() => cancelAnimationFrame(raf));
}

function isElementInAnyScope(element: Element | null) {
  for (const scope of scopes.keys()) {
    if (isElementInScope(element, scope)) {
      return true;
    }
  }

  return false;
}

function isElementInScope(element: Element | null, scope: HTMLElement[]) {
  return scope.some(node => node.contains(element));
}

function isElementInChildScope(element: Element | null, scope: ScopeRef) {
  // node.contains in isElementInScope covers child scopes that are also DOM children,
  // but does not cover child scopes in portals.
  for (const s of scopes.keys()) {
    if ((s === scope || isAncestorScope(scope, s)) && isElementInScope(element, s)) {
      return true;
    }
  }

  return false;
}

function isAncestorScope(ancestor: ScopeRef, scope: ScopeRef | null): boolean {
  if (!scope) {
    return false;
  }

  const parent = scopes.get(scope);

  if (!parent) {
    return false;
  }

  if (parent === ancestor) {
    return true;
  }

  return isAncestorScope(ancestor, parent);
}

function focusElement(element: HTMLElement | null, scroll = false) {
  if (element != null && !scroll) {
    try {
      focusSafely(element);
    } catch (err) {
      // ignore
    }
  } else if (element != null) {
    try {
      element.focus();
    } catch (err) {
      // ignore
    }
  }
}

function focusFirstInScope(scope: HTMLElement[]) {
  const sentinel = scope[0].previousElementSibling;

  const walker = getFocusableTreeWalker(getScopeRoot(scope)!, { tabbable: true }, scope);

  walker.currentNode = sentinel as Node;

  focusElement(walker.nextNode() as HTMLElement);
}

function createRestoreFocus(
  scopeRef: Accessor<HTMLElement[]>,
  restoreFocus: Accessor<boolean>,
  contain: Accessor<boolean>
) {
  // create a memo to save the active element before a child with autoFocus=true mounts.
  const nodeToRestoreMemo = createMemo(() => {
    return typeof document !== "undefined" ? (document.activeElement as HTMLElement) : null;
  });

  // Handle the Tab key so that tabbing out of the scope goes to the next element
  // after the node that had focus when the scope mounted. This is important when
  // using portals for overlays, so that focus goes to the expected element when
  // tabbing out of the overlay.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    const focusedElement = document.activeElement as HTMLElement;
    if (!isElementInScope(focusedElement, scopeRef())) {
      return;
    }

    let nodeToRestore = nodeToRestoreMemo();

    // Create a DOM tree walker that matches all tabbable elements
    const walker = getFocusableTreeWalker(document.body, { tabbable: true });

    // Find the next tabbable element after the currently focused element
    walker.currentNode = focusedElement;
    let nextElement = (e.shiftKey ? walker.previousNode() : walker.nextNode()) as HTMLElement;

    if (!document.body.contains(nodeToRestore) || nodeToRestore === document.body) {
      nodeToRestore = null;
    }

    // If there is no next element, or it is outside the current scope, move focus to the
    // next element after the node to restore to instead.
    if ((!nextElement || !isElementInScope(nextElement, scopeRef())) && nodeToRestore) {
      walker.currentNode = nodeToRestore as Node;

      // Skip over elements within the scope, in case the scope immediately follows the node to restore.
      do {
        nextElement = (e.shiftKey ? walker.previousNode() : walker.nextNode()) as HTMLElement;
      } while (isElementInScope(nextElement, scopeRef()));

      e.preventDefault();
      e.stopPropagation();
      if (nextElement) {
        focusElement(nextElement, true);
      } else {
        // If there is no next element and the nodeToRestore isn't within a FocusScope (i.e. we are leaving the top level focus scope)
        // then move focus to the body.
        // Otherwise restore focus to the nodeToRestore (e.g menu within a popover -> tabbing to close the menu should move focus to menu trigger)
        if (!isElementInAnyScope(nodeToRestore)) {
          focusedElement.blur();
        } else {
          focusElement(nodeToRestore, true);
        }
      }
    }
  };

  createEffect(() => {
    const nodeToRestore = nodeToRestoreMemo();

    if (!restoreFocus()) {
      return;
    }

    if (!contain()) {
      document.addEventListener("keydown", onKeyDown, true);
    }

    onCleanup(() => {
      if (!contain()) {
        document.removeEventListener("keydown", onKeyDown, true);
      }

      if (restoreFocus() && nodeToRestore && isElementInScope(document.activeElement, scopeRef())) {
        requestAnimationFrame(() => {
          if (document.body.contains(nodeToRestore)) {
            focusElement(nodeToRestore);
          }
        });
      }
    });
  });
}

/**
 * Create a [TreeWalker]{@link https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker}
 * that matches all focusable/tabbable elements.
 */
export function getFocusableTreeWalker(
  root: HTMLElement,
  opts?: FocusManagerOptions,
  scope?: HTMLElement[]
) {
  const selector = opts?.tabbable ? TABBABLE_ELEMENT_SELECTOR : FOCUSABLE_ELEMENT_SELECTOR;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      // Skip nodes inside the starting node.
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        (node as HTMLElement).matches(selector) &&
        isElementVisible(node as HTMLElement) &&
        (!scope || isElementInScope(node as HTMLElement, scope))
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_SKIP;
    }
  });

  if (opts?.from) {
    walker.currentNode = opts.from;
  }

  return walker;
}

/**
 * Creates a FocusManager object that can be used to move focus within an element.
 */
export function createFocusManager(ref: HTMLElement): FocusManager {
  return {
    focusNext(opts: FocusManagerOptions = {}) {
      const root = ref;
      const { from, tabbable, wrap } = opts;
      const node = from || document.activeElement;
      const walker = getFocusableTreeWalker(root, { tabbable });

      if (node && root.contains(node)) {
        walker.currentNode = node;
      }

      let nextNode = walker.nextNode() as HTMLElement;

      if (!nextNode && wrap) {
        walker.currentNode = root;
        nextNode = walker.nextNode() as HTMLElement;
      }

      if (nextNode) {
        focusElement(nextNode, true);
      }

      return nextNode;
    },
    focusPrevious(opts: FocusManagerOptions = {}) {
      const root = ref;
      const { from, tabbable, wrap } = opts;
      const node = from || document.activeElement;
      const walker = getFocusableTreeWalker(root, { tabbable });

      if (node && root.contains(node)) {
        walker.currentNode = node;
      } else {
        const next = last(walker);
        if (next) {
          focusElement(next, true);
        }
        return next;
      }

      let previousNode = walker.previousNode() as HTMLElement;

      if (!previousNode && wrap) {
        walker.currentNode = root;
        previousNode = last(walker);
      }

      if (previousNode) {
        focusElement(previousNode, true);
      }

      return previousNode;
    },
    focusFirst(opts = {}) {
      const root = ref;
      const { tabbable } = opts;
      const walker = getFocusableTreeWalker(root, { tabbable });
      const nextNode = walker.nextNode() as HTMLElement;

      if (nextNode) {
        focusElement(nextNode, true);
      }

      return nextNode;
    },
    focusLast(opts = {}) {
      const root = ref;
      const { tabbable } = opts;
      const walker = getFocusableTreeWalker(root, { tabbable });
      const next = last(walker);

      if (next) {
        focusElement(next, true);
      }

      return next;
    }
  };
}

function last(walker: TreeWalker) {
  let next!: HTMLElement;
  let last: HTMLElement;

  do {
    last = walker.lastChild() as HTMLElement;

    if (last) {
      next = last;
    }
  } while (last);

  return next;
}
