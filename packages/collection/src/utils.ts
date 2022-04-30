import { Item } from "./types";

/**
 * Returns an array of non disabled items that begin with the filter string, case-independent.
 *
 * @param items - The collection of items to search into.
 * @param filter - The filter string to search.
 * @param collator - The collator to use for string comparison.
 */
export function filterItems(items: Item[], filter: string, collator: Intl.Collator) {
  return items.filter(item => {
    if (item.isDisabled()) {
      return false;
    }

    // Compare with a part of textValue with same length as the filter.
    const substring = item.textValue.slice(0, filter.length);

    return collator.compare(substring, filter) === 0;
  });
}
