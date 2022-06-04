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

import { ElementWrapper, ItemMetaData, Node, PartialNode } from "./types";

export class CollectionBuilder {
  build(items: ItemMetaData[]) {
    return iterable(() => this.iterateCollection(items));
  }

  private *iterateCollection(items: ItemMetaData[]) {
    let index = 0;

    for (const item of items) {
      const nodes = this.getFullNode({
        metadata: item as unknown as ItemMetaData,
        index: index
      });

      for (const node of nodes) {
        index++;
        yield node;
      }
    }
  }

  private *getFullNode(partialNode: PartialNode, parentNode?: Node): Generator<Node> {
    const metadata = partialNode.metadata;

    // If there's a metadata with a getCollectionNode function, then it's a supported component.
    // Call this function to get a partial node, and recursively build a full node from there.
    if (metadata?.getCollectionNode) {
      const childNodes = metadata.getCollectionNode() as Generator<PartialNode, void, Node[]>;
      let index = partialNode.index ?? 0;
      let result = childNodes.next();
      while (!result.done && result.value) {
        const childNode = result.value;

        partialNode.index = index;

        let nodeKey = childNode.key;

        if (!nodeKey) {
          nodeKey = childNode.metadata ? undefined : metadata.key();
        }

        const nodes = this.getFullNode(
          {
            ...childNode,
            key: nodeKey,
            index,
            wrapper: compose(partialNode.wrapper, childNode.wrapper)
          },
          parentNode
        );

        const children = [...nodes];
        for (const node of children) {
          // The partial node may have specified a type for the child in order to specify a constraint.
          // Verify that the full node that was built recursively matches this type.
          if (partialNode.type && node.type !== partialNode.type) {
            throw new Error(
              `Unsupported type <${capitalize(node.type)}> in <${capitalize(
                parentNode?.type ?? ""
              )}>. Only <${capitalize(partialNode.type)}> is supported.`
            );
          }

          index++;
          yield node;
        }

        result = childNodes.next(children);
      }

      return;
    }

    // Ignore invalid elements
    if (partialNode.key == null) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const builder = this;

    // Create full node
    const node: Node = {
      type: partialNode.type ?? "item",
      props: partialNode.props,
      key: partialNode.key,
      parentKey: parentNode?.key,
      level: parentNode ? parentNode.level + 1 : 0,
      index: partialNode.index,
      rendered: () => partialNode.rendered?.(),
      textValue: () => partialNode.textValue?.() ?? "",
      "aria-label": partialNode["aria-label"],
      wrapper: partialNode.wrapper,
      shouldInvalidate: partialNode.shouldInvalidate,
      hasChildNodes: partialNode.hasChildNodes ?? false,
      childNodes: iterable(function* () {
        if (!partialNode.hasChildNodes || partialNode.childNodes == null) {
          return;
        }

        let index = 0;
        for (const child of partialNode.childNodes()) {
          child.index = index;

          const nodes = builder.getFullNode(child, node);

          for (const node of nodes) {
            index++;
            yield node;
          }
        }
      })
    };

    yield node;
  }
}

// Wraps an iterator function as an iterable object, and caches the results.
function iterable(iterator: () => IterableIterator<Node>): Iterable<Node> {
  const cache: Node[] = [];
  let iterable: IterableIterator<Node> | null = null;
  return {
    *[Symbol.iterator]() {
      for (const item of cache) {
        yield item;
      }

      if (!iterable) {
        iterable = iterator();
      }

      for (const item of iterable) {
        cache.push(item);
        yield item;
      }
    }
  };
}

function compose(
  outer?: ElementWrapper,
  inner?: ElementWrapper | void
): ElementWrapper | undefined {
  if (outer && inner) {
    return element => outer(inner(element));
  }

  if (outer) {
    return outer;
  }

  if (inner) {
    return inner;
  }
}

function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
