/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createFocusable } from "@solid-aria/focus";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import { createTypeSelect, isCtrlKeyPressed, SelectionMode } from "@solid-aria/selection";
import { AriaLabelingProps, DOMElements, DOMProps, LabelableProps } from "@solid-aria/types";
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
  useContext
} from "solid-js";

import { createListBoxState, ListBoxState } from "./createListBoxState";

const ListBoxContext = createContext<ListBoxState>();

export interface AriaListBoxProps extends LabelableProps, DOMProps, AriaLabelingProps {
  /**
   * The currently selected keys in the listbox (controlled).
   */
  selectedKeys?: Set<string>;

  /**
   * The initial selected keys in the listbox (uncontrolled).
   */
  defaultSelectedKeys?: Set<string>;

  /**
   * The type of selection that is allowed in the listbox.
   */
  selectionMode?: SelectionMode;

  /**
   * Whether the listbox allows empty selection.
   */
  allowEmptySelection?: boolean;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether options should be focused when the user hovers over them.
   */
  shouldFocusOnHover?: boolean;

  /**
   * Whether selection should occur automatically on focus.
   */
  selectOnFocus?: boolean;

  /**
   * Whether the listbox should be automatically focused upon render.
   */
  autoFocus?: boolean;

  /**
   * Whether the listbox is disabled.
   */
  isDisabled?: boolean;

  /**
   * The rendered contents of the listbox.
   */
  children?: JSX.Element;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<string>) => void;
}

export interface ListBoxAria<
  ListBoxElementType extends DOMElements,
  LabelElementType extends DOMElements
> {
  /**
   * Provide the listbox state to descendant elements.
   */
  ListBoxProvider: FlowComponent;

  /**
   * State for the listbox, as returned by `createListBoxState`.
   */
  state: ListBoxState;

  /**
   * Props for the listbox element.
   */
  listBoxProps: Accessor<JSX.IntrinsicElements[ListBoxElementType]>;

  /**
   * Props for the listbox's visual label element (if any).
   */
  labelProps: Accessor<JSX.IntrinsicElements[LabelElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 * @param props - Props for the listbox.
 * @param ref - A ref for the HTML listbox element.
 * @param scrollRef - The ref attached to the scrollable body, if not provided the listbox ref will be used.
 */
export function createListBox<
  ListBoxElementType extends DOMElements = "ul",
  LabelElementType extends DOMElements = "div",
  RefElement extends HTMLElement = HTMLUListElement
>(
  props: AriaListBoxProps,
  ref: Accessor<RefElement | undefined>,
  scrollRef?: Accessor<HTMLElement | undefined>
): ListBoxAria<ListBoxElementType, LabelElementType> {
  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  };

  const state = createListBoxState(props, scrollRef ?? ref);

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel<LabelElementType>(createLabelProps);

  const isMultipleSelectionMode = () => state.selectionManager.selectionMode() === "multiple";

  const { focusableProps } = createFocusable(
    {
      isDisabled: () => props.isDisabled,
      autoFocus: () => props.autoFocus,
      onFocus: () => state.focusManager.focusFirstSelectedItem(),
      onKeyDown: event => {
        const { key } = event;

        switch (key) {
          case "Home":
            event.preventDefault();
            state.focusManager.focusFirstItem();
            break;
          case "End":
            event.preventDefault();
            state.focusManager.focusLastItem();
            break;
          case "ArrowUp":
            event.preventDefault();
            state.focusManager.focusItemAbove();
            break;
          case "ArrowDown":
            event.preventDefault();
            state.focusManager.focusItemBelow();
            break;
          case "PageUp":
            event.preventDefault();
            state.focusManager.focusItemPageAbove();
            break;
          case "PageDown":
            event.preventDefault();
            state.focusManager.focusItemPageBelow();
            break;
          case "a":
            if (isCtrlKeyPressed(event) && isMultipleSelectionMode()) {
              event.preventDefault();
              state.selectionManager.selectAll();
            }
            break;
        }
      }
    },
    ref
  );

  const { typeSelectProps } = createTypeSelect<ListBoxElementType>({
    focusManager: () => state.focusManager
  });

  const domProps = createMemo(() => filterDOMProps(props, { labelable: true }));

  const listBoxProps = createMemo(() => {
    return combineProps(domProps(), focusableProps(), typeSelectProps(), fieldProps(), {
      role: "listbox",
      "aria-multiselectable": isMultipleSelectionMode() ? true : undefined,
      tabIndex: state.focusManager.focusedKey() == null ? 0 : -1
    }) as JSX.IntrinsicElements[ListBoxElementType];
  });

  const ListBoxProvider: FlowComponent = props => {
    return createComponent(ListBoxContext.Provider, {
      value: state,
      get children() {
        return props.children;
      }
    });
  };

  return { ListBoxProvider, state, listBoxProps, labelProps };
}

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxProvider.");
  }

  return context;
}
