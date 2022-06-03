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

import { CollectionBuilder } from "./CollectionBuilder";
import { Collection, CollectionBase, Node } from "./types";

type CollectionFactory<C extends Collection<Node>> = (node: Iterable<Node>) => C;

export function createCollection<C extends Collection<Node> = Collection<Node>>(
  props: CollectionBase,
  factory: CollectionFactory<C>,
  deps: Accessor<any>[] = []
): Accessor<C> {
  const builder = new CollectionBuilder();

  const nodes = builder.build(props);
  const [collection, setCollection] = createSignal(factory(nodes));

  const resolvedChildren = children(() => props.children);

  createEffect(
    on(
      [resolvedChildren, ...deps],
      () => {
        const nodes = builder.build(props);
        setCollection(() => factory(nodes));
      },
      {
        defer: true
      }
    )
  );

  return collection;
}
