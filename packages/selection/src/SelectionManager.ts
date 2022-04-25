import { Collection, Key, Node } from "@solid-aria/types";

import { Selection } from "./Selection";
import {
  FocusStrategy,
  MultipleSelectionManager,
  MultipleSelectionState,
  SelectionBehavior,
  SelectionKeys,
  SelectionMode
} from "./types";

interface SelectionManagerOptions {
  allowsCellSelection?: boolean;
}

/**
 * An interface for reading and updating multiple selection state.
 */
export class SelectionManager implements MultipleSelectionManager {
  private collection: Collection<Node<unknown>>;
  private state: MultipleSelectionState;
  private allowsCellSelection: boolean;
  private _isSelectAll: boolean | null;

  constructor(
    collection: Collection<Node<unknown>>,
    state: MultipleSelectionState,
    options?: SelectionManagerOptions
  ) {
    this.collection = collection;
    this.state = state;
    this.allowsCellSelection = options?.allowsCellSelection ?? false;
    this._isSelectAll = null;
  }

  /**
   * The type of selection that is allowed in the collection.
   */
  get selectionMode(): SelectionMode {
    return this.state.selectionMode;
  }

  /**
   * Whether the collection allows empty selection.
   */
  get disallowEmptySelection(): boolean {
    return this.state.disallowEmptySelection;
  }

  /**
   * The selection behavior for the collection.
   */
  get selectionBehavior(): SelectionBehavior {
    return this.state.selectionBehavior;
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
  get isFocused(): boolean {
    return this.state.isFocused;
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
  get focusedKey(): Key {
    return this.state.focusedKey;
  }

  /** Whether the first or last child of the focused key should receive focus. */
  get childFocusStrategy(): FocusStrategy {
    return this.state.childFocusStrategy;
  }

  /**
   * Sets the focused key.
   */
  setFocusedKey(key: Key, childFocusStrategy?: FocusStrategy) {
    this.state.setFocusedKey(key, childFocusStrategy);
  }

  /**
   * The currently selected keys in the collection.
   */
  get selectedKeys(): Set<Key> {
    return this.state.selectedKeys === "all"
      ? new Set(this.getSelectAllKeys())
      : this.state.selectedKeys;
  }

  /**
   * The raw selection value for the collection.
   * Either 'all' for select all, or a set of keys.
   */
  get rawSelection(): SelectionKeys {
    return this.state.selectedKeys;
  }

  /**
   * Returns whether a key is selected.
   */
  isSelected(key: Key) {
    if (this.state.selectionMode === "none") {
      return false;
    }

    const retrievedKey = this.getKey(key);

    if (retrievedKey == null) {
      return false;
    }

    return this.state.selectedKeys === "all"
      ? !this.state.disabledKeys.has(retrievedKey)
      : this.state.selectedKeys.has(retrievedKey);
  }

  /**
   * Whether the selection is empty.
   */
  get isEmpty(): boolean {
    return this.state.selectedKeys !== "all" && this.state.selectedKeys.size === 0;
  }

  /**
   * Whether all items in the collection are selected.
   */
  get isSelectAll(): boolean {
    if (this.isEmpty) {
      return false;
    }

    if (this.state.selectedKeys === "all") {
      return true;
    }

    if (this._isSelectAll != null) {
      return this._isSelectAll;
    }

    const allKeys = this.getSelectAllKeys();
    const selectedKeys = this.state.selectedKeys;

    this._isSelectAll = allKeys.every(k => selectedKeys.has(k));

    return this._isSelectAll;
  }

  get firstSelectedKey(): Key | null {
    let first: Node<unknown> | null = null;

    for (const key of this.state.selectedKeys) {
      const item = this.collection.getItem(key);

      if (!first || (item.index != null && first.index != null && item?.index < first.index)) {
        first = item;
      }
    }

    return first?.key ?? null;
  }

  get lastSelectedKey(): Key | null {
    let last: Node<unknown> | null = null;

    for (const key of this.state.selectedKeys) {
      const item = this.collection.getItem(key);

      if (!last || (item.index != null && last.index != null && item?.index > last.index)) {
        last = item;
      }
    }

    return last?.key ?? null;
  }

  /**
   * Extends the selection to the given key.
   */
  extendSelection(toKey: Key) {
    if (this.selectionMode === "none") {
      return;
    }

    if (this.selectionMode === "single") {
      this.replaceSelection(toKey);
      return;
    }

    const retrievedToKey = this.getKey(toKey);

    if (retrievedToKey == null) {
      return;
    }

    let selection: Selection;

    // Only select the one key if coming from a select all.
    if (this.state.selectedKeys === "all") {
      selection = new Selection([retrievedToKey], retrievedToKey, retrievedToKey);
    } else {
      const selectedKeys = this.state.selectedKeys as Selection;
      const anchorKey = selectedKeys.anchorKey || retrievedToKey;
      selection = new Selection(selectedKeys, anchorKey, retrievedToKey);
      for (const key of this.getKeyRange(anchorKey, selectedKeys.currentKey || retrievedToKey)) {
        selection.delete(key);
      }

      for (const key of this.getKeyRange(retrievedToKey, anchorKey)) {
        if (!this.state.disabledKeys.has(key)) {
          selection.add(key);
        }
      }
    }

    this.state.setSelectedKeys(selection);
  }

  private getKeyRange(from: Key, to: Key) {
    const fromItem = this.collection.getItem(from);
    const toItem = this.collection.getItem(to);

    if (fromItem && toItem) {
      if (fromItem.index != null && toItem.index != null && fromItem.index <= toItem.index) {
        return this.getKeyRangeInternal(from, to);
      }

      return this.getKeyRangeInternal(to, from);
    }

    return [];
  }

  private getKeyRangeInternal(from: Key, to: Key) {
    const keys: Key[] = [];
    let key: Key | null = from;

    while (key) {
      const item = this.collection.getItem(key);
      if ((item && item.type === "item") || (item.type === "cell" && this.allowsCellSelection)) {
        keys.push(key);
      }

      if (key === to) {
        return keys;
      }

      key = this.collection.getKeyAfter(key);
    }

    return [];
  }

  private getKey(key: Key) {
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
    while (item.type !== "item" && item.parentKey != null) {
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
  toggleSelection(key: Key) {
    if (this.selectionMode === "none") {
      return;
    }

    if (this.selectionMode === "single" && !this.isSelected(key)) {
      this.replaceSelection(key);
      return;
    }

    const retrievedKey = this.getKey(key);

    if (retrievedKey == null) {
      return;
    }

    const keys = new Selection(
      this.state.selectedKeys === "all" ? this.getSelectAllKeys() : this.state.selectedKeys
    );
    if (keys.has(retrievedKey)) {
      keys.delete(retrievedKey);
      // TODO: move anchor to last selected key...
      // Does `current` need to move here too?
    } else {
      keys.add(retrievedKey);
      keys.anchorKey = retrievedKey;
      keys.currentKey = retrievedKey;
    }

    if (this.disallowEmptySelection && keys.size === 0) {
      return;
    }

    this.state.setSelectedKeys(keys);
  }

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection(key: Key) {
    if (this.selectionMode === "none") {
      return;
    }

    const retrievedKey = this.getKey(key);

    if (retrievedKey == null) {
      return;
    }

    this.state.setSelectedKeys(new Selection([retrievedKey], retrievedKey, retrievedKey));
  }

  /**
   * Replaces the selection with the given keys.
   */
  setSelectedKeys(keys: Iterable<Key>) {
    if (this.selectionMode === "none") {
      return;
    }

    const selection = new Selection();

    for (const key of keys) {
      const retrievedKey = this.getKey(key);

      if (retrievedKey != null) {
        selection.add(retrievedKey);

        if (this.selectionMode === "single") {
          break;
        }
      }
    }

    this.state.setSelectedKeys(selection);
  }

  private getSelectAllKeys() {
    const keys: Key[] = [];

    const addKeys = (key: Key | null) => {
      while (key) {
        if (!this.state.disabledKeys.has(key)) {
          const item = this.collection.getItem(key);

          if (item.type === "item") {
            keys.push(key);
          }

          // Add child keys. If cell selection is allowed, then include item children too.
          if (item.hasChildNodes && (this.allowsCellSelection || item.type !== "item")) {
            addKeys([...item.childNodes][0].key);
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
    if (this.selectionMode === "multiple") {
      this.state.setSelectedKeys("all");
    }
  }

  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    if (
      !this.disallowEmptySelection &&
      (this.state.selectedKeys === "all" || this.state.selectedKeys.size > 0)
    ) {
      this.state.setSelectedKeys(new Selection());
    }
  }

  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll() {
    if (this.isSelectAll) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  // select(key: Key, e?: PressEvent | LongPressEvent | PointerEvent) {
  select(key: Key, e?: MouseEvent | PointerEvent) {
    if (this.selectionMode === "none") {
      return;
    }

    if (this.selectionMode === "single") {
      if (this.isSelected(key) && !this.disallowEmptySelection) {
        this.toggleSelection(key);
      } else {
        this.replaceSelection(key);
      }
    } else if (
      this.selectionBehavior === "toggle" // || (e && (e.pointerType === "touch" || e.pointerType === "virtual"))
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
  isSelectionEqual(selection: Set<Key>) {
    if (selection === this.state.selectedKeys) {
      return true;
    }

    // Check if the set of keys match.
    const selectedKeys = this.selectedKeys;
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

  canSelectItem(key: Key) {
    if (this.state.selectionMode === "none" || this.state.disabledKeys.has(key)) {
      return false;
    }

    const item = this.collection.getItem(key);
    if (!item || (item.type === "cell" && !this.allowsCellSelection)) {
      return false;
    }

    return true;
  }
}
