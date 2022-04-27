import { Key, SelectionBehavior, SelectionMode } from "@solid-aria/types";

export interface ListBoxOptionMetaData {
  /**
   * A unique key representing the option.
   */
  key: Key;

  /**
   * The value of the option.
   */
  value: string;

  /**
   * A string value for this node, used for features like typeahead.
   */
  textValue: string;

  /**
   * Whether the option is disabled.
   */
  isDisabled: boolean;
}

export interface MultipleSelectionManager {
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
   *  Returns whether the current selection is equal to the given selection.
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
   *  Replaces the selection with only the given key.
   */
  replaceSelection(key: Key): void;

  /**
   *  Replaces the selection with the given keys.
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
   * on the collection's selection mode.
   */
  select(key: Key): void;

  /**
   * Returns whether the given key can be selected.
   */
  canSelectItem(key: Key): boolean;

  /**
   * Sets the selection behavior for the collection.
   */
  setSelectionBehavior(selectionBehavior: SelectionBehavior): void;
}
