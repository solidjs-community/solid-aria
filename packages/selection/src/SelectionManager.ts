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

import { Collection, Node } from "@solid-aria/collection";
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

import { Selection } from "./Selection";
import { MultipleSelectionManager, MultipleSelectionState } from "./types";

interface SelectionManagerOptions {
  allowsCellSelection?: boolean;
}

/**
 * An interface for reading and updating multiple selection state.
 */
export class SelectionManager implements MultipleSelectionManager {
  private collection: Collection<Node>;
  private state: MultipleSelectionState;
  private allowsCellSelection: boolean;
  private _isSelectAll: boolean;

  constructor(
    collection: Collection<Node>,
    state: MultipleSelectionState,
    options?: SelectionManagerOptions
  ) {
    this.collection = collection;
    this.state = state;
    this.allowsCellSelection = options?.allowsCellSelection ?? false;
    this._isSelectAll = false;
  }

  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode(): SelectionMode {
    return this.state.selectionMode();
  }

  /**
   * Whether the collection allows empty selection.
   */
  disallowEmptySelection(): boolean {
    return this.state.disallowEmptySelection();
  }

  /**
   * The selection behavior for the collection.
   */
  selectionBehavior(): SelectionBehavior {
    return this.state.selectionBehavior();
  }

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior) {
    this.state.setSelectionBehavior(selectionBehavior);
  }

  /**
   * Whether the collection is currently focused.
   */
  isFocused(): boolean {
    return this.state.isFocused();
  }

  /**
   * Sets whether the collection is focused.
   */
  setFocused(isFocused: boolean) {
    this.state.setFocused(isFocused);
  }

  /**
   * The current focused key in the collection.
   */
  focusedKey(): ItemKey | undefined {
    return this.state.focusedKey();
  }

  /** Whether the first or last child of the focused key should receive focus. */
  childFocusStrategy(): FocusStrategy {
    return this.state.childFocusStrategy();
  }

  /**
   * Sets the focused key.
   */
  setFocusedKey(key?: ItemKey, childFocusStrategy?: FocusStrategy) {
    this.state.setFocusedKey(key, childFocusStrategy);
  }

  /**
   * The currently selected keys in the collection.
   */
  selectedKeys(): Set<ItemKey> {
    const selectedKeys = this.state.selectedKeys();

    return selectedKeys === "all" ? new Set(this.getSelectAllKeys()) : selectedKeys;
  }

  /**
   * The raw selection value for the collection.
   * Either 'all' for select all, or a set of keys.
   */
  rawSelection(): SelectionType {
    return this.state.selectedKeys();
  }

  /**
   * Returns whether a key is selected.
   */
  isSelected(key: ItemKey) {
    if (this.state.selectionMode() === "none") {
      return false;
    }

    const retrivedKey = this.getKey(key);

    if (retrivedKey == null) {
      return false;
    }

    const selectedKeys = this.state.selectedKeys();

    return selectedKeys === "all" ? this.canSelectItem(retrivedKey) : selectedKeys.has(retrivedKey);
  }

  /**
   * Whether the selection is empty.
   */
  isEmpty(): boolean {
    const selectedKeys = this.state.selectedKeys();

    return selectedKeys !== "all" && selectedKeys.size === 0;
  }

  /**
   * Whether all items in the collection are selected.
   */
  isSelectAll(): boolean {
    if (this.isEmpty()) {
      return false;
    }

    const selectedKeys = this.state.selectedKeys();

    if (selectedKeys === "all") {
      return true;
    }

    if (this._isSelectAll != null) {
      return this._isSelectAll;
    }

    const allKeys = this.getSelectAllKeys();
    this._isSelectAll = allKeys.every(k => selectedKeys.has(k));
    return this._isSelectAll;
  }

  firstSelectedKey(): ItemKey | undefined {
    let first: Node | undefined;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection.getItem(key);
      if (!first || (item && item.index < first.index)) {
        first = item;
      }
    }

    return first?.key;
  }

  lastSelectedKey(): ItemKey | undefined {
    let last: Node | undefined;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection.getItem(key);
      if (!last || (item && item.index > last.index)) {
        last = item;
      }
    }

    return last?.key;
  }

  disabledKeys(): Set<ItemKey> {
    return this.state.disabledKeys();
  }

  disabledBehavior(): DisabledBehavior {
    return this.state.disabledBehavior();
  }

  /**
   * Extends the selection to the given key.
   */
  extendSelection(toKey: ItemKey) {
    if (this.selectionMode() === "none") {
      return;
    }

    if (this.selectionMode() === "single") {
      this.replaceSelection(toKey);
      return;
    }

    const retrivedToKey = this.getKey(toKey);

    if (retrivedToKey == null) {
      return;
    }

    let selection: Selection;

    // Only select the one key if coming from a select all.
    if (this.state.selectedKeys() === "all") {
      selection = new Selection([retrivedToKey], retrivedToKey, retrivedToKey);
    } else {
      const selectedKeys = this.state.selectedKeys() as Selection;
      const anchorKey = selectedKeys.anchorKey || retrivedToKey;
      selection = new Selection(selectedKeys, anchorKey, retrivedToKey);
      for (const key of this.getKeyRange(anchorKey, selectedKeys.currentKey || retrivedToKey)) {
        selection.delete(key);
      }

      for (const key of this.getKeyRange(retrivedToKey, anchorKey)) {
        if (this.canSelectItem(key)) {
          selection.add(key);
        }
      }
    }

    this.state.setSelectedKeys(selection);
  }

  private getKeyRange(from: ItemKey, to: ItemKey) {
    const fromItem = this.collection.getItem(from);
    const toItem = this.collection.getItem(to);
    if (fromItem && toItem) {
      if (fromItem.index <= toItem.index) {
        return this.getKeyRangeInternal(from, to);
      }

      return this.getKeyRangeInternal(to, from);
    }

    return [];
  }

  private getKeyRangeInternal(from: ItemKey, to: ItemKey) {
    const keys: ItemKey[] = [];
    let key: ItemKey | undefined = from;
    while (key) {
      const item = this.collection.getItem(key);
      if (item && (item.type === "item" || (item.type === "cell" && this.allowsCellSelection))) {
        keys.push(key);
      }

      if (key === to) {
        return keys;
      }

      key = this.collection.getKeyAfter(key);
    }

    return [];
  }

  private getKey(key: ItemKey) {
    let item = this.collection.getItem(key);
    if (!item) {
      // ¯\_(ツ)_/¯
      return key;
    }

    // If cell selection is allowed, just return the key.
    if (item.type === "cell" && this.allowsCellSelection) {
      return key;
    }

    // Find a parent item to select
    while (item && item.type !== "item" && item.parentKey != null) {
      item = this.collection.getItem(item.parentKey);
    }

    if (!item || item.type !== "item") {
      return null;
    }

    return item.key;
  }

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection(key: ItemKey) {
    if (this.selectionMode() === "none") {
      return;
    }

    if (this.selectionMode() === "single" && !this.isSelected(key)) {
      this.replaceSelection(key);
      return;
    }

    const retrivedKey = this.getKey(key);

    if (retrivedKey == null) {
      return;
    }

    const selectedKeys = this.state.selectedKeys();

    const keys = new Selection(selectedKeys === "all" ? this.getSelectAllKeys() : selectedKeys);
    if (keys.has(retrivedKey)) {
      keys.delete(retrivedKey);
      // TODO: move anchor to last selected key...
      // Does `current` need to move here too?
    } else if (this.canSelectItem(retrivedKey)) {
      keys.add(retrivedKey);
      keys.anchorKey = retrivedKey;
      keys.currentKey = retrivedKey;
    }

    if (this.disallowEmptySelection() && keys.size === 0) {
      return;
    }

    this.state.setSelectedKeys(keys);
  }

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection(key: ItemKey) {
    if (this.selectionMode() === "none") {
      return;
    }

    const retrivedKey = this.getKey(key);

    if (retrivedKey == null) {
      return;
    }

    const selection = this.canSelectItem(retrivedKey)
      ? new Selection([retrivedKey], retrivedKey, retrivedKey)
      : new Selection();

    this.state.setSelectedKeys(selection);
  }

  /**
   * Replaces the selection with the given keys.
   */
  setSelectedKeys(keys: Iterable<ItemKey>) {
    if (this.selectionMode() === "none") {
      return;
    }

    const selection = new Selection();

    for (const key of keys) {
      const retrivedKey = this.getKey(key);

      if (retrivedKey != null) {
        selection.add(retrivedKey);
        if (this.selectionMode() === "single") {
          break;
        }
      }
    }

    this.state.setSelectedKeys(selection);
  }

  private getSelectAllKeys() {
    const keys: ItemKey[] = [];
    const addKeys = (key: ItemKey | undefined) => {
      while (key) {
        if (this.canSelectItem(key)) {
          const item = this.collection.getItem(key);
          if (item) {
            if (item.type === "item") {
              keys.push(key);
            }

            // Add child keys. If cell selection is allowed, then include item children too.
            if (item.hasChildNodes && (this.allowsCellSelection || item.type !== "item")) {
              addKeys([...item.childNodes][0].key);
            }
          }
        }

        key = this.collection.getKeyAfter(key);
      }
    };

    addKeys(this.collection.getFirstKey());
    return keys;
  }

  /**
   * Selects all items in the collection.
   */
  selectAll() {
    if (this.selectionMode() === "multiple") {
      this.state.setSelectedKeys("all");
    }
  }

  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    const selectedKeys = this.state.selectedKeys();
    if (!this.disallowEmptySelection && (selectedKeys === "all" || selectedKeys.size > 0)) {
      this.state.setSelectedKeys(new Selection());
    }
  }

  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll() {
    if (this.isSelectAll()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  select(key: ItemKey, e?: PressEvent | LongPressEvent | PointerEvent) {
    if (this.selectionMode() === "none") {
      return;
    }

    if (this.selectionMode() === "single") {
      if (this.isSelected(key) && !this.disallowEmptySelection) {
        this.toggleSelection(key);
      } else {
        this.replaceSelection(key);
      }
    } else if (
      this.selectionBehavior() === "toggle" ||
      (e && (e.pointerType === "touch" || e.pointerType === "virtual"))
    ) {
      // if touch or virtual (VO) then we just want to toggle, otherwise it's impossible to multi select because they don't have modifier keys
      this.toggleSelection(key);
    } else {
      this.replaceSelection(key);
    }
  }

  /**
   * Returns whether the current selection is equal to the given selection.
   */
  isSelectionEqual(selection: Set<ItemKey>) {
    if (selection === this.state.selectedKeys()) {
      return true;
    }

    // Check if the set of keys match.
    const selectedKeys = this.selectedKeys();
    if (selection.size !== selectedKeys.size) {
      return false;
    }

    for (const key of selection) {
      if (!selectedKeys.has(key)) {
        return false;
      }
    }

    for (const key of selectedKeys) {
      if (!selection.has(key)) {
        return false;
      }
    }

    return true;
  }

  canSelectItem(key: ItemKey) {
    if (this.state.selectionMode() === "none" || this.state.disabledKeys().has(key)) {
      return false;
    }

    const item = this.collection.getItem(key);
    if (!item || (item.type === "cell" && !this.allowsCellSelection)) {
      return false;
    }

    return true;
  }

  isDisabled(key: ItemKey) {
    return this.state.disabledKeys().has(key) && this.state.disabledBehavior() === "all";
  }
}
