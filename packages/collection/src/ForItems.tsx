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

import { Key } from "@solid-primitives/keyed";
import { Accessor, JSX } from "solid-js";

import { Node } from "./types";

interface ForItemsProps<T extends JSX.Element> {
  /** The collection to loop on. */
  in: Iterable<Node>;

  /** Render prop that receives an item and index signals and returns a JSX-Element. */
  children: (item: Accessor<Node>, index: Accessor<number>) => T;

  /** Fallback content to display when the collection is empty. */
  fallback?: T;
}

/**
 * Creates a list of elements from the input `in` collection.
 * It takes a map function as its children that receives an item and index signals and returns a JSX-Element.
 * If the collection is empty, an optional fallback is returned.
 */
export function ForItems<T extends JSX.Element>(props: ForItemsProps<T>) {
  return (
    <Key each={[...props.in]} by="key" fallback={props.fallback}>
      {props.children}
    </Key>
  );
}
