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

import { ItemKey } from "@solid-aria/types";
import { MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, JSX } from "solid-js";

export type ItemType = "item" | "section" | "cell";

export type ElementWrapper = (element: JSX.Element) => JSX.Element;

export interface ItemProps {
  /** A unique key for the item. */
  key: ItemKey;

  /** Rendered contents of the item or child items. */
  children: JSX.Element;

  /** Rendered contents of the item if `children` contains child items. */
  title?: JSX.Element;

  /** A string representation of the item's contents, used for features like typeahead. */
  textValue?: string;

  /** An accessibility label for this item. */
  "aria-label"?: string;

  /** Whether this item has children, even if not loaded yet. */
  hasChildItems?: boolean;
}

export interface ItemMetaData {
  /** A unique key for the item. */
  key: Accessor<ItemKey>;

  /** A generator for getting a `PartialNode` from the item metadata used to build a collection `Node`. */
  getCollectionNode: Accessor<Generator<PartialNode>>;
}

export interface SectionProps {
  /** A unique key for the section. */
  key: ItemKey;

  /** Rendered contents of the section, e.g. a header. */
  title?: JSX.Element;

  /** An accessibility label for the section. */
  "aria-label"?: string;

  /** Child items. */
  children: JSX.Element;
}

export interface CollectionBase {
  /** The contents of the collection. */
  children: JSX.Element;

  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: MaybeAccessor<Iterable<ItemKey> | undefined>;
}

/**
 * A generic interface to access a readonly sequential
 * collection of unique keyed items.
 */
export interface Collection<T> extends Iterable<T> {
  /** The number of items in the collection. */
  readonly size: number;

  /** Iterate over all keys in the collection. */
  getKeys(): Iterable<ItemKey>;

  /** Get an item by its key. */
  getItem(key: ItemKey): T | undefined;

  /** Get an item by the index of its key. */
  at(idx: number): T | undefined;

  /** Get the key that comes before the given key in the collection. */
  getKeyBefore(key: ItemKey): ItemKey | undefined;

  /** Get the key that comes after the given key in the collection. */
  getKeyAfter(key: ItemKey): ItemKey | undefined;

  /** Get the first key in the collection. */
  getFirstKey(): ItemKey | undefined;

  /** Get the last key in the collection. */
  getLastKey(): ItemKey | undefined;
}

export interface Node {
  /** The type of item this node represents. */
  type: ItemType;

  /** A unique key for the node. */
  key: ItemKey;

  /** The level of depth this node is at in the heirarchy. */
  level: number;

  /** The index of this node within its parent. */
  index: number;

  /** Whether this item has children, even if not loaded yet. */
  hasChildNodes: boolean;

  /** The loaded children of this node. */
  childNodes: Iterable<Node>;

  /** The rendered contents of this node (e.g. JSX). */
  rendered: Accessor<JSX.Element>;

  /** A string value for this node, used for features like typeahead. */
  textValue: Accessor<string>;

  /** An accessibility label for this node. */
  "aria-label": Accessor<string | undefined>;

  /** A function that should be called to wrap the rendered node. */
  wrapper?: ElementWrapper;

  /** The key of the parent node. */
  parentKey?: ItemKey;

  /** The key of the node before this node. */
  prevKey?: ItemKey;

  /** The key of the node after this node. */
  nextKey?: ItemKey;

  /** Additional properties specific to a particular node type. */
  props?: any;

  /** @private */
  shouldInvalidate?: (context: unknown) => boolean;
}

export interface PartialNode {
  /** The type of item this node represents. */
  type?: ItemType;

  /** A unique key for the node. */
  key?: ItemKey;

  /** Meta data about the item used to create this node. */
  metadata?: ItemMetaData;

  /** A function that should be called to wrap the rendered node. */
  wrapper?: ElementWrapper;

  /** The rendered contents of this node (e.g. JSX). */
  rendered?: Accessor<JSX.Element>;

  /** A string value for this node, used for features like typeahead. */
  textValue?: Accessor<string>;

  /** An accessibility label for this node. */
  "aria-label"?: Accessor<string | undefined>;

  /** The index of this node within its parent. */
  index?: number;

  /** Whether this item has children, even if not loaded yet. */
  hasChildNodes?: boolean;

  /** The loaded children of this node. */
  childNodes?: () => IterableIterator<PartialNode>;

  /** Additional properties specific to a particular node type. */
  props?: any;

  /** @private */
  shouldInvalidate?: (context: unknown) => boolean;
}
