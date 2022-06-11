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

import { CollectionBase } from "@solid-aria/collection";
import { createFocusWithin } from "@solid-aria/interactions";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import { createListState, ListState } from "@solid-aria/list";
import { createSelectableList, CreateSelectableListProps } from "@solid-aria/selection";
import {
  AriaLabelingProps,
  DOMProps,
  FocusStrategy,
  FocusWithinEvents,
  KeyboardDelegate,
  MultipleSelection
} from "@solid-aria/types";
import { createId, filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import {
  Accessor,
  createComponent,
  createContext,
  FlowComponent,
  JSX,
  mergeProps,
  useContext
} from "solid-js";

export interface AriaListBoxProps
  extends CollectionBase,
    MultipleSelection,
    FocusWithinEvents,
    DOMProps,
    AriaLabelingProps {
  /**
   * Whether to auto focus the listbox or an option.
   */
  autoFocus?: boolean | FocusStrategy;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap?: boolean;

  /**
   * Whether the listbox uses virtual scrolling.
   */
  isVirtualized?: boolean;

  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate;

  /**
   * Whether the listbox items should use virtual focus instead of being focused directly.
   */
  shouldUseVirtualFocus?: boolean;

  /**
   * Whether selection should occur on press up instead of press down.
   */
  shouldSelectOnPressUp?: boolean;

  /**
   * Whether options should be focused when the user hovers over them.
   */
  shouldFocusOnHover?: boolean;

  /**
   * An optional visual label for the listbox.
   */
  label?: JSX.Element;
}

interface ListBoxAria {
  /**
   * Provide the listbox state to descendant elements.
   */
  ListBoxProvider: FlowComponent;

  /**
   * State for the listbox, as returned by `createListState`.
   */
  state: ListState;

  /**
   * Props for the listbox element.
   */
  listBoxProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the listbox's visual label element (if any).
   */
  labelProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a listbox component.
 * A listbox displays a list of options and allows a user to select one or more of them.
 * @param props - Props for the listbox.
 * @param ref - A ref to the listbox element.
 */
export function createListBox<T extends HTMLElement>(
  props: AriaListBoxProps,
  ref: Accessor<T | undefined>
): ListBoxAria {
  const defaultListboxId = createId();

  const state = createListState(props);

  const domProps = filterDOMProps(props, { labelable: true });

  const createSelectableListProps = mergeProps(props, {
    selectionManager: state.selectionManager,
    collection: state.collection,
    disabledKeys: state.disabledKeys
  } as CreateSelectableListProps);

  const { listProps } = createSelectableList(createSelectableListProps, ref);

  const { focusWithinProps } = createFocusWithin({
    onFocusIn: props.onFocusIn,
    onFocusOut: props.onFocusOut,
    onFocusWithinChange: props.onFocusWithinChange
  });

  const defaultCreateLabelProps: AriaLabelProps = {
    // listbox is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false,
    id: defaultListboxId
  };

  const createLabelProps = mergeProps(defaultCreateLabelProps, props);

  const { labelProps, fieldProps } = createLabel(createLabelProps);

  const listBoxProps = combineProps(domProps, focusWithinProps, fieldProps, listProps, {
    role: "listbox",
    get "aria-multiselectable"() {
      return state.selectionManager().selectionMode() === "multiple" ? true : undefined;
    }
  } as JSX.HTMLAttributes<any>);

  const context: ListBoxContextValue = {
    state: () => state,
    listboxId: () => props.id ?? defaultListboxId,
    shouldUseVirtualFocus: () => props.shouldUseVirtualFocus ?? false,
    shouldSelectOnPressUp: () => props.shouldSelectOnPressUp ?? false,
    shouldFocusOnHover: () => props.shouldFocusOnHover ?? false,
    isVirtualized: () => props.isVirtualized ?? false
  };

  const ListBoxProvider: FlowComponent = props => {
    return createComponent(ListBoxContext.Provider, {
      value: context,
      get children() {
        return props.children;
      }
    });
  };

  return { ListBoxProvider, state, listBoxProps, labelProps };
}

interface ListBoxContextValue {
  state: Accessor<ListState>;
  listboxId: Accessor<string>;
  shouldUseVirtualFocus: Accessor<boolean>;
  shouldSelectOnPressUp: Accessor<boolean>;
  shouldFocusOnHover: Accessor<boolean>;
  isVirtualized: Accessor<boolean>;
}

const ListBoxContext = createContext<ListBoxContextValue>();

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxProvider.");
  }

  return context;
}
