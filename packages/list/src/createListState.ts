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

import { Collection, CollectionBase, createCollection, Node } from "@solid-aria/collection";
import { Accessor } from "solid-js";

import { ListCollection } from "./ListCollection";

export interface ListProps<T> extends CollectionBase<T> {
  /** Filter function to generate a filtered list of nodes. */
  filter?: (nodes: Iterable<Node<T>>) => Iterable<Node<T>>;
}

export interface ListState<T> {
  /** A collection of items in the list. */
  collection: Accessor<Collection<Node<T>>>;
}

/**
 * Provides state management for list-like components. Handles building a collection
 * of items from props, and manages multiple selection state.
 */
export function createListState<T extends object>(props: ListProps<T>): ListState<T> {
  const factory = (nodes: Iterable<Node<T>>) => {
    return props.filter ? new ListCollection(props.filter(nodes)) : new ListCollection(nodes);
  };

  const collection = createCollection(props, factory, [() => props.filter]);

  return { collection };
}
