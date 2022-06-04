import { Key } from "@solid-primitives/keyed";
import { Accessor, JSX } from "solid-js";

import { Collection, Node } from "./types";

interface ForItemsProps<T extends JSX.Element> {
  /** The collection to loop on. */
  in: Collection<Node>;

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
      {(item, index) => props.children(item, index)}
    </Key>
  );
}
