import { Key } from "@solid-aria/types";

export type SelectionMode = "none" | "single" | "multiple";
export type SelectionBehavior = "toggle" | "replace";
export type SelectionKeys = "all" | Set<Key>;

export type FocusStrategy = "first" | "last";

export interface FocusState {
  /**
   * Whether the collection is currently focused.
   */
  readonly isFocused: boolean;

  /**
   * Sets whether the collection is focused.
   */
  setFocused(isFocused: boolean): void;

  /**
   * The current focused key in the collection.
   */
  readonly focusedKey: Key;

  /**
   * Whether the first or last child of the focused key should receive focus.
   */
  readonly childFocusStrategy: FocusStrategy;

  /**
   * Sets the focused key, and optionally, whether the first or last child of that key should receive focus.
   */
  setFocusedKey(key: Key, child?: FocusStrategy): void;
}

export interface SingleSelectionState extends FocusState {
  /**
   * Whether the collection allows empty selection.
   */
  readonly disallowEmptySelection?: boolean;

  /**
   * The currently selected key in the collection.
   */
  readonly selectedKey: Key;

  /**
   * Sets the selected key in the collection.
   */
  setSelectedKey(key: Key): void;
}

export interface MultipleSelectionState extends FocusState {
  /**
   * The type of selection that is allowed in the collection.
   */
  readonly selectionMode: SelectionMode;

  /**
   * The selection behavior for the collection.
   */
  readonly selectionBehavior: SelectionBehavior;

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;

  /**
   * Whether the collection allows empty selection.
   */
  readonly disallowEmptySelection: boolean;

  /**
   * The currently selected keys in the collection.
   */
  readonly selectedKeys: SelectionKeys;

  /**
   * Sets the selected keys in the collection.
   */
  setSelectedKeys(keys: SelectionKeys): void;

  /**
   * The currently disabled keys in the collection.
   */
  readonly disabledKeys: Set<Key>;
}

export interface MultipleSelectionManager extends FocusState {
  /**
   * The type of selection that is allowed in the collection.
   */
  readonly selectionMode: SelectionMode;

  /**
   * The selection behavior for the collection.
   */
  readonly selectionBehavior: SelectionBehavior;

  /**
   * Whether the collection allows empty selection.
   */
  readonly disallowEmptySelection?: boolean;

  /**
   * The currently selected keys in the collection.
   */
  readonly selectedKeys: Set<Key>;

  /**
   * Whether the selection is empty.
   */
  readonly isEmpty: boolean;

  /**
   * Whether all items in the collection are selected.
   */
  readonly isSelectAll: boolean;

  /**
   * The first selected key in the collection.
   */
  readonly firstSelectedKey: Key | null;

  /**
   * The last selected key in the collection.
   */
  readonly lastSelectedKey: Key | null;

  /**
   * Returns whether a key is selected.
   */
  isSelected(key: Key): boolean;

  /**
   * Returns whether the current selection is equal to the given selection.
   */
  isSelectionEqual(selection: Set<Key>): boolean;

  /**
   * Extends the selection to the given key.
   */
  extendSelection(toKey: Key): void;

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection(key: Key): void;

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection(key: Key): void;

  /**
   * Replaces the selection with the given keys.
   */
  setSelectedKeys(keys: Iterable<Key>): void;

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
  select(key: Key, e?: MouseEvent | PointerEvent): void;
  //select(key: Key, e?: PressEvent | LongPressEvent | PointerEvent): void; // wait for real `createPress` primitive.

  /**
   * Returns whether the given key can be selected.
   */
  canSelectItem(key: Key): boolean;

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;
}
