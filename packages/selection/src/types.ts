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
  DisabledBehavior,
  FocusStrategy,
  ItemKey,
  LongPressEvent,
  PressEvent,
  SelectionBehavior,
  SelectionMode,
  SelectionType
} from "@solid-aria/types";
import { Accessor } from "solid-js";

export interface FocusState {
  /**
   * Whether the collection is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * The current focused key in the collection.
   */
  focusedKey: Accessor<ItemKey | undefined>;

  /**
   * Whether the first or last child of the focused key should receive focus.
   */
  childFocusStrategy: Accessor<FocusStrategy>;

  /**
   * Sets whether the collection is focused.
   */
  setFocused(isFocused: boolean): void;

  /**
   * Sets the focused key, and optionally, whether the first or last child of that key should receive focus.
   */
  setFocusedKey(key: ItemKey, child?: FocusStrategy): void;
}

export interface SingleSelectionState extends FocusState {
  /**
   * Whether the collection allows empty selection.
   */
  disallowEmptySelection: Accessor<boolean | undefined>;

  /**
   * The currently selected key in the collection.
   */
  selectedKey: Accessor<ItemKey>;

  /**
   * Sets the selected key in the collection.
   */
  setSelectedKey(key: ItemKey): void;
}

export interface MultipleSelectionState extends FocusState {
  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode: Accessor<SelectionMode>;

  /**
   * The selection behavior for the collection.
   */
  selectionBehavior: Accessor<SelectionBehavior>;

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;

  /**
   * Whether the collection allows empty selection.
   */
  disallowEmptySelection: Accessor<boolean>;

  /**
   * The currently selected keys in the collection.
   */
  selectedKeys: Accessor<SelectionType>;

  /**
   * Sets the selected keys in the collection.
   */
  setSelectedKeys(keys: SelectionType): void;

  /**
   * The currently disabled keys in the collection.
   */
  disabledKeys: Accessor<Set<ItemKey>>;

  /**
   * Whether `disabledKeys` applies to selection, actions, or both.
   */
  disabledBehavior: Accessor<DisabledBehavior>;
}

export interface MultipleSelectionManager extends FocusState {
  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode: Accessor<SelectionMode>;

  /**
   * The selection behavior for the collection.
   */
  selectionBehavior: Accessor<SelectionBehavior>;

  /**
   * Whether the collection allows empty selection.
   */
  disallowEmptySelection: Accessor<boolean | undefined>;

  /**
   * The currently selected keys in the collection.
   */
  selectedKeys: Accessor<Set<ItemKey>>;

  /**
   * Whether the selection is empty.
   */
  isEmpty: Accessor<boolean>;

  /**
   * Whether all items in the collection are selected.
   */
  isSelectAll: Accessor<boolean>;

  /**
   * The first selected key in the collection.
   */
  firstSelectedKey: Accessor<ItemKey | undefined>;

  /**
   * The last selected key in the collection.
   */
  lastSelectedKey: Accessor<ItemKey | undefined>;

  /**
   * The currently disabled keys in the collection.
   */
  disabledKeys: Accessor<Set<ItemKey>>;

  /**
   * Whether `disabledKeys` applies to selection, actions, or both.
   */
  disabledBehavior: Accessor<DisabledBehavior>;

  /**
   * Returns whether a key is selected.
   */
  isSelected(key: ItemKey): boolean;

  /**
   * Returns whether the current selection is equal to the given selection.
   */
  isSelectionEqual(selection: Set<ItemKey>): boolean;

  /**
   * Extends the selection to the given key.
   */
  extendSelection(toKey: ItemKey): void;

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection(key: ItemKey): void;

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection(key: ItemKey): void;

  /**
   * Replaces the selection with the given keys.
   */
  setSelectedKeys(keys: Iterable<ItemKey>): void;

  /**
   * Selects all items in the collection.
   */
  selectAll(): void;

  /**
   * Removes all keys from the selection.
   */
  clearSelection(): void;

  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll(): void;

  /**
   * Toggles, replaces, or extends selection to the given key depending
   * on the pointer event and collection's selection mode.
   */
  select(key: ItemKey, e?: PressEvent | LongPressEvent | PointerEvent): void;

  /**
   * Returns whether the given key can be selected.
   */
  canSelectItem(key: ItemKey): boolean;

  /**
   * Returns whether the given key is non-interactive, i.e. both selection and actions are disabled.
   */
  isDisabled(key: ItemKey): boolean;

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;
}
