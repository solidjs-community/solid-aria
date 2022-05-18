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

import { Collection, createCollection } from "@solid-aria/collection";
import {
  createListFocusManager,
  CreateListFocusManagerProps,
  createSelectionManager,
  CreateSelectionManagerProps,
  ListFocusManager,
  SelectionManager,
  SelectionMode
} from "@solid-aria/selection";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, on } from "solid-js";

type CreateListBoxStateOptions = Partial<
  Pick<
    CreateListFocusManagerProps & CreateSelectionManagerProps,
    | "selectedKeys"
    | "defaultSelectedKeys"
    | "allowEmptySelection"
    | "shouldFocusWrap"
    | "onSelectionChange"
  >
>;

export interface CreateListBoxStateProps extends CreateListBoxStateOptions {
  /**
   * The type of selection that is allowed in the listbox.
   * @default "single"
   */
  selectionMode?: MaybeAccessor<SelectionMode | undefined>;

  /**
   * Whether options should be focused when the user hovers over them.
   * @default false
   */
  shouldFocusOnHover?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection should occur automatically on focus.
   * @default false
   */
  selectOnFocus?: MaybeAccessor<boolean | undefined>;
}

export interface ListBoxState {
  /**
   * An interface for managing the listbox selection state.
   */
  selectionManager: SelectionManager;

  /**
   * An interface for managing item's focus in the listbox.
   */
  focusManager: ListFocusManager;

  /**
   * Whether options should be focused when the user hovers over them.
   */
  shouldFocusOnHover: Accessor<boolean>;

  /**
   * Whether selection should occur automatically on focus.
   */
  selectOnFocus: Accessor<boolean>;

  /**
   * The collection of items (options) in the listbox.
   */
  collection: Collection;
}

/**
 * Provides state management for a listbox component.
 * @param props - Props for the ListBoxState.
 * @param scrollRef - The ref attached to the scrollable body. Can be the element representing the collection or a descendant.
 */
export function createListBoxState(
  props: CreateListBoxStateProps,
  scrollRef: Accessor<HTMLElement | undefined>
): ListBoxState {
  const collection = createCollection();

  const selectionManager = createSelectionManager({
    collection,
    selectionMode: () => access(props.selectionMode) ?? "single",
    allowEmptySelection: () => access(props.allowEmptySelection) ?? true,
    selectedKeys: () => access(props.selectedKeys),
    defaultSelectedKeys: () => access(props.defaultSelectedKeys),
    onSelectionChange: keys => props.onSelectionChange?.(keys)
  });

  const focusManager = createListFocusManager({
    collection,
    selectionManager,
    scrollRef,
    shouldFocusWrap: () => access(props.shouldFocusWrap) ?? false
  });

  const shouldFocusOnHover = () => access(props.shouldFocusOnHover) ?? false;

  const selectOnFocus = () => access(props.selectOnFocus) ?? false;

  createEffect(
    on(
      () => focusManager.focusedKey(),
      newValue => {
        if (newValue != null && selectOnFocus()) {
          selectionManager.replaceSelection(newValue);
        }
      }
    )
  );

  return {
    selectionManager,
    focusManager,
    shouldFocusOnHover,
    selectOnFocus,
    collection
  };
}
