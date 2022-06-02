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

import { createMemo, JSX } from "solid-js";

import { ItemMetaData, ItemProps, PartialNode } from "./types";

export function Item<T>(props: ItemProps<T>) {
  const metadata: ItemMetaData<T> = {
    key: () => props.key,
    getCollectionNode: () => getCollectionNodeForItem<T>(props)
  };

  return metadata as unknown as JSX.Element;
}

function* getCollectionNodeForItem<T>(props: ItemProps<T>): Generator<PartialNode<T>> {
  const rendered = () => props.title || props.children;

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

  yield {
    type: "item",
    props: props,
    rendered,
    textValue,
    "aria-label": ariaLabel,
    hasChildNodes: hasChildItems(props),
    *childNodes() {
      if (props.childItems) {
        for (const item of props.childItems) {
          yield {
            type: "item",
            value: item
          };
        }
      } else if (props.title) {
        const items: PartialNode<T>[] = [];

        if (props.children == null) {
          yield* items;
        }

        const childs = Array.isArray(props.children) ? props.children : [props.children];

        childs.forEach(child => {
          items.push({
            type: "item",
            metadata: child as unknown as ItemMetaData<T>
          });
        });

        yield* items;
      }
    }
  };
}

function hasChildItems<T>(props: ItemProps<T>) {
  if (props.hasChildItems != null) {
    return props.hasChildItems;
  }

  if (props.childItems) {
    return true;
  }

  if (props.title != null && props.children != null) {
    return true;
  }

  return false;
}
