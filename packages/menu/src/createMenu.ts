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

import { createSelectableList, CreateSelectableListProps } from "@solid-aria/selection";
import { createTreeState, CreateTreeStateProps, TreeState } from "@solid-aria/tree";
import {
  AriaLabelingProps,
  DOMProps,
  FocusStrategy,
  ItemKey,
  KeyboardDelegate
} from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import {
  Accessor,
  createComponent,
  createContext,
  createMemo,
  FlowComponent,
  JSX,
  mergeProps,
  onMount,
  useContext
} from "solid-js";

export interface AriaMenuProps extends CreateTreeStateProps, DOMProps, AriaLabelingProps {
  /**
   * Where the focus should be set.
   */
  autoFocus?: boolean | FocusStrategy;

  /**
   * Whether keyboard navigation is circular.
   * @default true
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether the menu uses virtual scrolling.
   */
  isVirtualized?: boolean;

  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate;

  /**
   * Whether items should be focused when the user hovers over them.
   */
  shouldFocusOnHover?: boolean;

  /**
   * Whether the Menu closes when a selection is made.
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Handler that is called when an item is selected.
   */
  onAction?: (key: ItemKey) => void;
}

export interface MenuAria {
  /**
   * Provide the menu state to descendant elements.
   */
  MenuProvider: FlowComponent;

  /**
   * State for the menu, as returned by `createTreeState`.
   */
  state: TreeState;

  /**
   * Props for the menu element.
   */
  menuProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a menu component.
 * A menu displays a list of actions or options that a user can choose.
 * @param props - Props for the menu.
 * @param ref - A ref to the menu element.
 */
export function createMenu<T extends HTMLElement>(
  props: AriaMenuProps,

  ref: Accessor<T | undefined>
): MenuAria {
  const defaultProps: Partial<AriaMenuProps> = {
    shouldFocusWrap: true,
    closeOnSelect: true,
    selectionMode: "none"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const state = createTreeState(props);

  const domProps = mergeProps(createMemo(() => filterDOMProps(props, { labelable: true })));

  const createSelectableListProps = mergeProps(props, {
    selectionManager: state.selectionManager,
    collection: state.collection,
    disabledKeys: state.disabledKeys
  } as CreateSelectableListProps);

  const { listProps } = createSelectableList(createSelectableListProps, ref);

  const baseMenuProps: JSX.HTMLAttributes<any> = {
    role: "menu"
  };

  const menuProps = combineProps(domProps, listProps, baseMenuProps);

  const context: MenuContextValue = {
    state: () => state,
    closeOnSelect: () => props.closeOnSelect ?? true,
    shouldFocusOnHover: () => props.shouldFocusOnHover ?? false,
    isVirtualized: () => props.isVirtualized ?? false
  };

  const MenuProvider: FlowComponent = props => {
    return createComponent(MenuContext.Provider, {
      value: context,
      get children() {
        return props.children;
      }
    });
  };

  onMount(() => {
    if (!props["aria-label"] && !props["aria-labelledby"]) {
      console.warn("An aria-label or aria-labelledby prop is required for accessibility.");
    }
  });

  return { MenuProvider, state, menuProps };
}

interface MenuContextValue {
  state: Accessor<TreeState>;
  closeOnSelect: Accessor<boolean>;
  shouldFocusOnHover: Accessor<boolean>;
  isVirtualized: Accessor<boolean>;
}

const MenuContext = createContext<MenuContextValue>();

export function useMenuContext() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("[solid-aria]: useMenuContext should be used in a MenuProvider.");
  }

  return context;
}
