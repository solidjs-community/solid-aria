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

import { Node } from "./types";

const cache = new WeakMap<Iterable<unknown>, number>();

export function getItemCount(collection: Iterable<Node>): number {
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
