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
import { ItemKey, KeyboardDelegate } from "@solid-aria/types";
import { Accessor } from "solid-js";

export class ListKeyboardDelegate implements KeyboardDelegate {
  private collection: Collection<Node>;
  private disabledKeys: Set<ItemKey>;
  private ref: Accessor<HTMLElement | undefined>;
  private collator?: Intl.Collator;

  constructor(
    collection: Collection<Node>,
    disabledKeys: Set<ItemKey>,
    ref: Accessor<HTMLElement | undefined>,
    collator?: Intl.Collator
  ) {
    this.collection = collection;
    this.disabledKeys = disabledKeys;
    this.ref = ref;
    this.collator = collator;
  }

  getKeyBelow(key: ItemKey) {
    let keyAfter = this.collection.getKeyAfter(key);

    while (keyAfter != null) {
      const item = this.collection.getItem(keyAfter);
      if (item && item.type === "item" && !this.disabledKeys.has(keyAfter)) {
        return keyAfter;
      }

      keyAfter = this.collection.getKeyAfter(keyAfter);
    }
  }

  getKeyAbove(key: ItemKey) {
    let keyBefore = this.collection.getKeyBefore(key);

    while (keyBefore != null) {
      const item = this.collection.getItem(keyBefore);
      if (item && item.type === "item" && !this.disabledKeys.has(keyBefore)) {
        return keyBefore;
      }

      keyBefore = this.collection.getKeyBefore(keyBefore);
    }
  }

  getFirstKey() {
    let key = this.collection.getFirstKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item && item.type === "item" && !this.disabledKeys.has(key)) {
        return key;
      }

      key = this.collection.getKeyAfter(key);
    }
  }

  getLastKey() {
    let key = this.collection.getLastKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item && item.type === "item" && !this.disabledKeys.has(key)) {
        return key;
      }

      key = this.collection.getKeyBefore(key);
    }
  }

  private getItem(key: ItemKey): HTMLElement | null {
    return this.ref()?.querySelector(`[data-key="${key}"]`) ?? null;
  }

  getKeyPageAbove(key: ItemKey) {
    const menu = this.ref();
    let item = this.getItem(key);

    if (!menu || !item) {
      return;
    }

    const pageY = Math.max(0, item.offsetTop + item.offsetHeight - menu.offsetHeight);

    let keyAbove: ItemKey | undefined = key;

    while (keyAbove && item && item.offsetTop > pageY) {
      keyAbove = this.getKeyAbove(keyAbove);
      item = keyAbove != null ? this.getItem(keyAbove) : null;
    }

    return keyAbove;
  }

  getKeyPageBelow(key: ItemKey) {
    const menu = this.ref();
    let item = this.getItem(key);

    if (!menu || !item) {
      return;
    }

    const pageY = Math.min(
      menu.scrollHeight,
      item.offsetTop - item.offsetHeight + menu.offsetHeight
    );

    let keyBelow: ItemKey | undefined = key;

    while (keyBelow && item && item.offsetTop < pageY) {
      keyBelow = this.getKeyBelow(keyBelow);
      item = keyBelow != null ? this.getItem(keyBelow) : null;
    }

    return keyBelow;
  }

  getKeyForSearch(search: string, fromKey?: ItemKey) {
    if (!this.collator) {
      return;
    }

    let key = fromKey || this.getFirstKey();

    while (key != null) {
      const item = this.collection.getItem(key);

      if (item) {
        const substring = item.textValue().slice(0, search.length);

        if (item.textValue() && this.collator.compare(substring, search) === 0) {
          return key;
        }
      }

      key = this.getKeyBelow(key);
    }
  }
}
