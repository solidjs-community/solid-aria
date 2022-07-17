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

import { Collection, Node } from "@solid-aria/collection";
import { Direction, ItemKey, KeyboardDelegate, Orientation } from "@solid-aria/types";

export class TabsKeyboardDelegate implements KeyboardDelegate {
  private collection: Collection<Node>;
  private disabledKeys: Set<ItemKey>;
  private readonly flipDirection: boolean;
  private readonly orientation: Orientation;

  constructor(
    collection: Collection<Node>,
    direction: Direction,
    orientation: Orientation,
    disabledKeys: Set<ItemKey> = new Set()
  ) {
    this.collection = collection;
    this.flipDirection = direction === "rtl" && orientation === "horizontal";
    this.orientation = orientation;
    this.disabledKeys = disabledKeys;
  }

  getKeyLeftOf(key: ItemKey) {
    if (this.flipDirection) {
      return this.getNextKey(key);
    } else {
      if (this.orientation === "horizontal") {
        return this.getPreviousKey(key);
      }

      return undefined;
    }
  }

  getKeyRightOf(key: ItemKey) {
    if (this.flipDirection) {
      return this.getPreviousKey(key);
    } else {
      if (this.orientation === "horizontal") {
        return this.getNextKey(key);
      }

      return undefined;
    }
  }

  getKeyAbove(key: ItemKey) {
    if (this.orientation === "vertical") {
      return this.getPreviousKey(key);
    }

    return undefined;
  }

  getKeyBelow(key: ItemKey) {
    if (this.orientation === "vertical") {
      return this.getNextKey(key);
    }

    return undefined;
  }

  getFirstKey() {
    let key = this.collection.getFirstKey();

    if (key == null) {
      return;
    }

    if (this.disabledKeys.has(key)) {
      key = this.getNextKey(key);
    }

    return key;
  }

  getLastKey() {
    let key = this.collection.getLastKey();

    if (key == null) {
      return;
    }

    if (this.disabledKeys.has(key)) {
      key = this.getPreviousKey(key);
    }

    return key;
  }

  getNextKey(key: ItemKey) {
    let nextKey: ItemKey | undefined = key;

    do {
      nextKey = this.collection.getKeyAfter(nextKey) ?? this.collection.getFirstKey();

      if (nextKey == null) {
        return;
      }
    } while (this.disabledKeys.has(nextKey));

    return nextKey;
  }

  getPreviousKey(key: ItemKey) {
    let previousKey: ItemKey | undefined = key;

    do {
      previousKey = this.collection.getKeyBefore(previousKey) ?? this.collection.getLastKey();

      if (previousKey == null) {
        return;
      }
    } while (this.disabledKeys.has(previousKey));

    return previousKey;
  }
}
