import { Item } from "@solid-aria/collection";
import { Accessor } from "solid-js";

/**
 * An interface that implements behavior for keyboard focus movement in a list.
 */
export interface ListFocusManager {
  /**
   * Returns the currently focused key.
   */
  focusedKey: Accessor<string | undefined>;

  /**
   * Returns whether an item with the given key is focused.
   */
  isFocusedKey: (key: string) => boolean;

  /**
   * Set the currently focused key.
   */
  setFocusedKey: (key: string) => void;

  /**
   * Focus the first item.
   */
  focusFirstItem: () => void;

  /**
   * Focus the last item.
   */
  focusLastItem: () => void;

  /**
   * Focus the item visually above the currenlty focused one.
   */
  focusItemAbove: () => void;

  /**
   * Focus the item visually below the currenlty focused one.
   */
  focusItemBelow: () => void;

  /**
   * Focus the item visually one page above the currenlty focused one.
   */
  focusItemPageAbove: () => void;

  /**
   * Focus the item visually one page below the currenlty focused one.
   */
  focusItemPageBelow: () => void;

  /**
   * Focus the first item in the collection that is selected.
   */
  focusFirstSelectedItem: () => void;

  /**
   * Focus the next item after the currenlty focused one that matches the given search string,
   * falling back to searching the whole list.
   *
   * @returns - the newly focused item.
   */
  focusItemForSearch: (search: string) => Item | undefined;
}

/**
 * The type of selection that is allowed in a collection.
 */
export type SelectionMode = "none" | "single" | "multiple";

/**
 * An interface for reading and updating multiple selection state.
 */
export interface SelectionManager {
  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode: Accessor<SelectionMode>;

  /**
   * Returns a set of selected keys.
   */
  selectedKeys: Accessor<Set<string> | undefined>;

  /**
   * Returns whether the selection is empty.
   */
  isEmpty: () => boolean;

  /**
   * Returns whether a key is selected.
   */
  isSelected: (key: string) => boolean;

  /**
   * Returns the index of the first selected item in the collection.
   */
  getFirstSelectedIndex: () => number;

  /**
   * Replaces the selection with only the given key.
   */
  replaceSelection: (key: string) => void;

  /**
   * Toggles whether the given key is selected.
   */
  toggleSelection: (key: string) => void;

  /**
   * Toggles or replaces selection with the given key depending on the collection's selection mode.
   */
  select: (key: string) => void;

  /**
   * Selects all items in the collection.
   */
  selectAll: () => void;

  /**
   * Removes all keys from the selection.
   */
  clearSelection: () => void;
}
