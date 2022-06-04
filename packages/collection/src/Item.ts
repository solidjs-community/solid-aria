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

import { children, createMemo, JSX } from "solid-js";

import { ItemMetaData, ItemProps, PartialNode } from "./types";

export function Item<T>(props: ItemProps<T>) {
  const metadata: ItemMetaData<T> = {
    key: () => props.key,
    getCollectionNode: () => getCollectionNodeForItem<T>(props)
  };

  return metadata as unknown as JSX.Element;
}

function* getCollectionNodeForItem<T>(props: ItemProps<T>): Generator<PartialNode<T>> {
  const title = createMemo(() => props.title);

  const resolvedChildren = children(() => props.children);

  const rendered = createMemo(() => title() || resolvedChildren());

  const ariaLabel = () => props["aria-label"];

  const textValue = createMemo(() => {
    if (props.textValue != null) {
      return props.textValue;
    }

    const renderedContent = rendered();

    if (typeof renderedContent === "string") {
      return renderedContent;
    }

    return ariaLabel() || "";
  });

  const hasChildItems = createMemo(() => {
    if (props.hasChildItems != null) {
      return props.hasChildItems;
    }

    if (props.childItems) {
      return true;
    }

    if (title() != null && resolvedChildren() != null) {
      return true;
    }

    return false;
  });

  yield {
    type: "item",
    props: props,
    rendered,
    textValue,
    "aria-label": ariaLabel,
    hasChildNodes: hasChildItems(),
    *childNodes() {
      if (props.childItems) {
        for (const item of props.childItems) {
          yield {
            type: "item",
            value: item
          };
        }
      } else if (title()) {
        let childs = resolvedChildren() ?? [];

        if (!Array.isArray(childs)) {
          childs = [childs];
        }

        const items: PartialNode<T>[] = childs.map(child => {
          return {
            type: "item",
            metadata: child as unknown as ItemMetaData<T>
          } as PartialNode<T>;
        });

        yield* items;
      }
    }
  };
}
