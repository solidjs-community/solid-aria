import { Accessor } from "solid-js";

export interface Item<T> {
  /**
   * A unique key for the item.
   */
  key: string;

  /**
   * The value of the item.
   */
  value: T;

  /**
   * A string value for this item, used for features like typeahead.
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
export interface Collection<T> {
  /**
   * Get all items in the collection.
   */
  getItems: () => Array<T>;

  /**
   * Get all keys in the collection.
   */
  getKeys(): Array<string>;

  /**
   * Add an item to the collection.
   */
  addItem: (item: T) => void;

  /**
   * Remove a item from the collection.
   */
  removeItem: (key: string) => void;

  /**
   * Find a item by its index.
   */
  findByIndex: (index: number) => T | null;

  /**
   * Find an index by the item  key.
   */
  findIndexByKey: (key?: string) => number | null;

  /**
   * Get the first index in the collection.
   */
  getFirstIndex: () => number | null;

  /**
   * Get the last index in the collection.
   */
  getLastIndex: () => number | null;

  /**
   * Return whether the given index is the first one.
   */
  isFirstIndex: (index: number) => boolean;

  /**
   * Return whether the given index is the last one.
   */
  isLastIndex: (index: number) => boolean;
}
