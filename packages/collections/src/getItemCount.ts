import { Node } from "./types";

const cache = new WeakMap<Iterable<unknown>, number>();

export function getItemCount<T>(collection: Iterable<Node<T>>): number {
  let count = cache.get(collection);

  if (count != null) {
    return count;
  }

  count = 0;

  for (const item of collection) {
    if (item.type === "section") {
      count += getItemCount(item.childNodes);
    } else {
      count++;
    }
  }

  cache.set(collection, count);

  return count;
}
