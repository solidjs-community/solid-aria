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

type CollectionFactory<T, C extends Collection<Node<T>>> = (node: Iterable<Node<T>>) => C;

export function createCollection<
  T extends object,
  C extends Collection<Node<T>> = Collection<Node<T>>
>(
  props: CollectionBase<T>,
  factory: CollectionFactory<T, C>,
  deps: Accessor<any>[] = []
): Accessor<C> {
  const builder = new CollectionBuilder<T>();

  const nodes = builder.build(props);
  const [collection, setCollection] = createSignal<C>(factory(nodes));

  const resolvedChildren = children(() => props.children as any);

  createEffect(
    on(
      [() => props.items, resolvedChildren, ...deps],
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
