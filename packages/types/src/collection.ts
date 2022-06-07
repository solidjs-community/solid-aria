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

export type ItemKey = string | number;

export interface KeyboardDelegate {
  /** Returns the key visually below the given one, or `undefined` for none. */
  getKeyBelow?(key: ItemKey): ItemKey | undefined;

  /** Returns the key visually above the given one, or `undefined` for none. */
  getKeyAbove?(key: ItemKey): ItemKey | undefined;

  /** Returns the key visually to the left of the given one, or `undefined` for none. */
  getKeyLeftOf?(key: ItemKey): ItemKey | undefined;

  /** Returns the key visually to the right of the given one, or `undefined` for none. */
  getKeyRightOf?(key: ItemKey): ItemKey | undefined;

  /** Returns the key visually one page below the given one, or `undefined` for none. */
  getKeyPageBelow?(key: ItemKey): ItemKey | undefined;

  /** Returns the key visually one page above the given one, or `undefined` for none. */
  getKeyPageAbove?(key: ItemKey): ItemKey | undefined;

  /** Returns the first key, or `undefined` for none. */
  getFirstKey?(key?: ItemKey, global?: boolean): ItemKey | undefined;

  /** Returns the last key, or `undefined` for none. */
  getLastKey?(key?: ItemKey, global?: boolean): ItemKey | undefined;

  /** Returns the next key after `fromKey` that matches the given search string, or `undefined` for none. */
  getKeyForSearch?(search: string, fromKey?: ItemKey): ItemKey | undefined;
}