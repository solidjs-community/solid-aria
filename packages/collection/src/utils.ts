/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

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
