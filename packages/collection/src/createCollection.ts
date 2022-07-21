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

import { Many } from "@solid-primitives/utils";
import { Accessor, children, createMemo } from "solid-js";

import { CollectionBuilder } from "./CollectionBuilder";
import { Collection, CollectionBase, ItemMetaData, Node } from "./types";

type CollectionFactory<C extends Collection<Node>> = (node: Iterable<Node>) => C;

export function createCollection<C extends Collection<Node> = Collection<Node>>(
  props: CollectionBase,
  factory: CollectionFactory<C>,
  deps: Accessor<any>[] = []
): Accessor<C> {
  const resolvedChildren = children(() => props.children) as unknown as Accessor<
    Many<ItemMetaData>
  >;

  const builder = new CollectionBuilder();

  const collection = createMemo(() => {
    // execute deps to track them
    deps.forEach(f => f());
    const nodes = createNodes(builder, resolvedChildren());
    return factory(nodes);
  });

  return collection;
}

/**
 * Create an Iterable of `Nodes` with the given builder and resolved children.
 */
function createNodes(builder: CollectionBuilder, resolvedChildren: Many<ItemMetaData>) {
  let items = resolvedChildren ?? [];

  if (!Array.isArray(items)) {
    items = [items];
  }

  return builder.build(items);
}
