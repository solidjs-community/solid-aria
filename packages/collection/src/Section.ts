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

import { JSX } from "solid-js";

import { ItemMetaData, ItemRenderer, PartialNode, SectionProps } from "./types";

export function Section<T>(props: SectionProps<T>) {
  const metadata: ItemMetaData<T> = {
    key: () => props.key,
    getCollectionNode: () => getCollectionNodeForSection<T>(props)
  };

  return metadata as unknown as JSX.Element;
}

function* getCollectionNodeForSection<T>(props: SectionProps<T>): Generator<PartialNode<T>> {
  const rendered = () => props.title;
  const ariaLabel = () => props["aria-label"];

  yield {
    type: "section",
    hasChildNodes: true,
    rendered,
    "aria-label": ariaLabel,
    *childNodes() {
      if (props.items) {
        if (typeof props.children !== "function") {
          throw new Error(
            "[solid-aria]: props.items was present but props.children is not a function"
          );
        }

        for (const item of props.items) {
          yield {
            type: "item",
            value: item,
            renderer: props.children as ItemRenderer<T>
          };
        }
      } else {
        const items: PartialNode<T>[] = [];

        if (props.children != null) {
          const childs = Array.isArray(props.children) ? props.children : [props.children];

          childs.forEach(child => {
            items.push({
              type: "item",
              metadata: child as unknown as ItemMetaData<T>
            });
          });
        }

        yield* items;
      }
    }
  };
}
