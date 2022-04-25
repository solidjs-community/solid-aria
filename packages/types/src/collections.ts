import { JSX } from "solid-js";

export type Key = string | number;

/**
 * A generic interface to access a readonly sequential
 * collection of unique keyed items.
 */
export interface Collection<T> extends Iterable<T> {
  /**
   * The number of items in the collection.
   */
  readonly size: number;

  /**
   * Iterate over all keys in the collection.
   */
  getKeys(): Iterable<Key>;

  /**
   * Get an item by its key.
   */
  getItem(key: Key): T;

  /**
   * Get an item by the index of its key.
   */
  at(idx: number): T;

  /**
   * Get the key that comes before the given key in the collection.
   */
  getKeyBefore(key: Key): Key | null;

  /**
   * Get the key that comes after the given key in the collection.
   */
  getKeyAfter(key: Key): Key | null;

  /**
   * Get the first key in the collection.
   */
  getFirstKey(): Key | null;

  /**
   * Get the last key in the collection.
   */
  getLastKey(): Key | null;
}

export interface Node<T> {
  /**
   * The type of item this node represents.
   */
  type: string;

  /**
   * A unique key for the node.
   */
  key: Key;

  /**
   * The object value the node was created from.
   */
  value: T;

  /**
   * The level of depth this node is at in the heirarchy.
   */
  level: number;

  /**
   * Whether this item has children, even if not loaded yet.
   */
  hasChildNodes: boolean;

  /**
   * The loaded children of this node.
   */
  childNodes: Iterable<Node<T>>;

  /**
   * The rendered contents of this node (e.g. JSX).
   */
  rendered: JSX.Element;

  /**
   * A string value for this node, used for features like typeahead.
   */
  textValue: string;

  /**
   * An accessibility label for this node.
   */
  "aria-label"?: string;

  /**
   * The index of this node within its parent.
   */
  index?: number;

  /**
   * A function that should be called to wrap the rendered node.
   */
  wrapper?: (element: JSX.Element) => JSX.Element;

  /**
   * The key of the parent node.
   */
  parentKey?: Key;

  /**
   * The key of the node before this node.
   */
  prevKey?: Key;

  /**
   * The key of the node after this node.
   */
  nextKey?: Key;

  /**
   * Additional properties specific to a particular node type.
   */
  props?: any;

  /**
   *  @private
   */
  shouldInvalidate?: (context: unknown) => boolean;
}
