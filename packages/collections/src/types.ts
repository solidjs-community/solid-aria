import { Component, JSX } from "solid-js";

export type Key = string | number;

export interface ItemProps<T> {
  /**
   * Rendered contents of the item or child items.
   */
  children?: JSX.Element;

  /**
   * Rendered contents of the item if `children` contains child items.
   */
  title?: JSX.Element; // label?? contents?

  /**
   * A string representation of the item's contents, used for features like typeahead.
   */
  textValue?: string;

  /**
   * An accessibility label for this item.
   */
  "aria-label"?: string;

  /**
   * A list of child item objects. Used for dynamic collections.
   */
  childItems?: Iterable<T>;

  /**
   * Whether this item has children, even if not loaded yet.
   */
  hasChildItems?: boolean;
}

export type ItemElement<T> = Component<ItemProps<T>>;

export type ItemRenderer<T> = (item: T) => ItemElement<T>;

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
   * @private
   */
  shouldInvalidate?: (context: unknown) => boolean;
}

// Undocumented in react-aria
export interface PartialNode<T> {
  type?: string;
  key?: Key;
  value?: T;
  element?: JSX.Element;
  wrapper?: (element: JSX.Element) => JSX.Element;
  rendered?: JSX.Element;
  textValue?: string;
  "aria-label"?: string;
  index?: number;
  renderer?: ItemRenderer<T>;
  hasChildNodes?: boolean;
  childNodes?: () => IterableIterator<PartialNode<T>>;
  props?: any;
  shouldInvalidate?: (context: unknown) => boolean;
}
