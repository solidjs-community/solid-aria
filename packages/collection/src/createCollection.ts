import { createSignal } from "solid-js";

import { Collection, Item } from "./types";

/**
 * Create a reactive collection of items.
 */
export function createCollection(): Collection {
  const [items, setItems] = createSignal<Array<Item>>([]);

  const isCollectionEmpty = () => {
    return !items() || items().length <= 0;
  };

  const getKeys = () => {
    return items().map(item => item.key);
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
    if (key == null || isCollectionEmpty()) {
      return null;
    }

    const index = items().findIndex(item => item.key === key);

    return index === -1 ? null : index;
  };

  const getFirstIndex = () => {
    if (isCollectionEmpty()) {
      return null;
    }

    return 0;
  };

  const getLastIndex = () => {
    if (isCollectionEmpty()) {
      return null;
    }

    return items().length - 1;
  };

  const isFirstIndex = (index: number) => {
    return index === getFirstIndex();
  };

  const isLastIndex = (index: number) => {
    return index === getLastIndex();
  };

  return {
    getItems: items,
    getKeys,
    addItem,
    removeItem,
    findByIndex,
    findByKey,
    findIndexByKey,
    getFirstIndex,
    getLastIndex,
    isFirstIndex,
    isLastIndex
  };
}
