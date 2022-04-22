import { isElementVisible } from "./isElementVisible";

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

function isElementInScope(element: Element, scope: HTMLElement[]) {
  return scope.some(node => node.contains(element));
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
