import { createMemo, createSignal } from "solid-js";

import { Collection, Item } from "./types";
import { filterItems } from "./utils";

/**
 * Create a reactive collection of items.
 */
export function createCollection(): Collection {
  const [items, setItems] = createSignal<Array<Item>>([]);
  const keys = createMemo(() => items().map(item => item.key));

  const isCollectionEmpty = () => {
    return !items() || items().length <= 0;
  };

  const addItem = (item: Item) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (key: string) => {
    setItems(prev => prev.filter(item => item.key !== key));
  };

  const findByIndex = (index: number) => {
    return items()[index] ?? null;
  };

  const findByKey = (key: string) => {
    return items().find(item => item.key === key) ?? null;
  };

  const findIndexByKey = (key?: string) => {
    return items().findIndex(item => item.key === key);
  };

  const findIndexBySearch = (filter: string, collator: Intl.Collator, startIndex: number) => {
    // Access the reactive items once during the function execution.
    const resolvedItems = items();

    // Order the items to prioritize items after the given start index.
    const orderedItems = [
      ...resolvedItems.slice(startIndex),
      ...resolvedItems.slice(0, startIndex)
    ];

    // first check if there is an exact match for the typed string.
    const firstMatch = filterItems(orderedItems, filter, collator)[0];

    if (firstMatch) {
      return resolvedItems.indexOf(firstMatch);
    }

    // If the same letter is being repeated, cycle through first-letter matches.
    const allSameLetter = (array: string[]) => array.every(letter => letter === array[0]);

    if (allSameLetter(filter.split(""))) {
      const matches = filterItems(orderedItems, filter[0], collator);
      return resolvedItems.indexOf(matches[0]);
    }

    // No matches
    return -1;
  };

  const getFirstIndex = () => {
    if (isCollectionEmpty()) {
      return -1;
    }

    return 0;
  };

  const getLastIndex = () => {
    if (isCollectionEmpty()) {
      return -1;
    }

    return items().length - 1;
  };

  const isFirstIndex = (index: number) => {
    if (isCollectionEmpty()) {
      return false;
    }

    return index === getFirstIndex();
  };

  const isLastIndex = (index: number) => {
    if (isCollectionEmpty()) {
      return false;
    }

    return index === getLastIndex();
  };

  return {
    items,
    keys,
    addItem,
    removeItem,
    findByIndex,
    findByKey,
    findIndexByKey,
    findIndexBySearch,
    getFirstIndex,
    getLastIndex,
    isFirstIndex,
    isLastIndex
  };
}
