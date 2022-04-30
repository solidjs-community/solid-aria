import { Accessor } from "solid-js";

export interface Item {
  /**
   * A unique key for the item.
   */
  key: string;

  /**
   * A string representation of the item's contents, used for features like typeahead.
   */
  textValue: string;

  /**
   * A ref to the root HTML element of the item.
   */
  ref: HTMLElement;

  /**
   * Whether the item is disabled.
   */
  isDisabled: Accessor<boolean>;
}

/**
 * An interface for dealing with collection.
 */
export interface Collection {
  /**
   * Get all items in the collection.
   */
  getItems: () => Array<Item>;

  /**
   * Get all keys in the collection.
   */
  getKeys(): Array<string>;

  /**
   * Add an item to the collection.
   */
  addItem: (item: Item) => void;

  /**
   * Remove a item from the collection.
   */
  removeItem: (key: string) => void;

  /**
   * Find a item by its index.
   */
  findByIndex: (index: number) => Item | null;

  /**
   * Find a item by its key.
   */
  findByKey: (key: string) => Item | null;

  /**
   * Find an index by the item  key.
   */
  findIndexByKey: (key?: string) => number;

  /**
   * Find an index based on a filter string, returns -1 if not found.
   * If the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches.
   *
   * @param filter - The filter string to search.
   * @param collator - The collator to use for string comparison.
   * @param startIndex - The index in the collection to start search from.
   */
  findIndexBySearch: (filter: string, collator: Intl.Collator, startIndex: number) => number;

  /**
   * Get the first index in the collection, or -1 if empty.
   */
  getFirstIndex: () => number;

  /**
   * Get the last index in the collection, or -1 if empty.
   */
  getLastIndex: () => number;

  /**
   * Return whether the given index is the first one.
   */
  isFirstIndex: (index: number) => boolean;

  /**
   * Return whether the given index is the last one.
   */
  isLastIndex: (index: number) => boolean;
}
