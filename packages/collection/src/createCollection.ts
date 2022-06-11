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

import { Accessor, children, createEffect, createSignal, on } from "solid-js";
import { ResolvedChildren } from "solid-js/types/reactive/signal";

import { CollectionBuilder } from "./CollectionBuilder";
import { Collection, CollectionBase, ItemMetaData, Node } from "./types";

type CollectionFactory<C extends Collection<Node>> = (node: Iterable<Node>) => C;

export function createCollection<C extends Collection<Node> = Collection<Node>>(
  props: CollectionBase,
  factory: CollectionFactory<C>,
  deps: Accessor<any>[] = []
): Accessor<C> {
  const resolvedChildren = children(() => props.children);

  const builder = new CollectionBuilder();

  const nodes = createNodes(builder, resolvedChildren);
  const [collection, setCollection] = createSignal<C>(factory(nodes));

  createEffect(
    on(
      [resolvedChildren, ...deps],
      () => {
        const nodes = createNodes(builder, resolvedChildren);
        setCollection(() => factory(nodes));
      },
      {
        defer: true
      }
    )
  );

  return collection;
}

/**
 * Create an Iterable of `Nodes` with the given builder and resolved children.
 */
function createNodes(builder: CollectionBuilder, resolvedChildren: Accessor<ResolvedChildren>) {
  let items = resolvedChildren() ?? [];

  if (!Array.isArray(items)) {
    items = [items];
  }

  return builder.build(items as unknown as ItemMetaData[]);
}
