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

import { ItemMetaData, ItemRenderer, PartialNode, SectionProps } from "./types";

export function Section<T>(props: SectionProps<T>) {
  const metadata: ItemMetaData<T> = {
    key: () => props.key,
    getCollectionNode: () => getCollectionNodeForSection<T>(props)
  };

  return metadata as unknown as JSX.Element;
}

function* getCollectionNodeForSection<T>(props: SectionProps<T>): Generator<PartialNode<T>> {
  const title = createMemo(() => props.title);

  const resolvedChildren = children(() => props.children as any);

  const ariaLabel = () => props["aria-label"];

  yield {
    type: "section",
    hasChildNodes: true,
    rendered: title,
    "aria-label": ariaLabel,
    *childNodes() {
      if (props.items) {
        if (typeof resolvedChildren() !== "function") {
          throw new Error(
            "[solid-aria]: props.items was present but props.children is not a function"
          );
        }

        for (const item of props.items) {
          yield {
            type: "item",
            value: item,
            renderer: resolvedChildren() as unknown as ItemRenderer<T>
          };
        }
      } else {
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
