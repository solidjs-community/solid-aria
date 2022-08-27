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

import {
  LocalizedString,
  LocalizedStringDictionary,
  LocalizedStringFormatter,
  LocalizedStrings
} from "@internationalized/string";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo } from "solid-js";

import { useLocale } from "./context";

const cache = new WeakMap();

function getCachedDictionary<K extends string, T extends LocalizedString>(
  strings: LocalizedStrings<K, T>
): LocalizedStringDictionary<K, T> {
  let dictionary = cache.get(strings);
  if (!dictionary) {
    dictionary = new LocalizedStringDictionary(strings);
    cache.set(strings, dictionary);
  }

  return dictionary;
}

/**
 * Provides localized string formatting for the current locale. Supports interpolating variables,
 * selecting the correct pluralization, and formatting numbers. Automatically updates when the locale changes.
 * @param strings - A mapping of languages to localized strings by key.
 */
export function createStringFormatter<
  K extends string = string,
  T extends LocalizedString = string
>(strings: MaybeAccessor<LocalizedStrings<K, T>>): Accessor<LocalizedStringFormatter<K, T>> {
  const locale = useLocale();
  const dictionary = () => getCachedDictionary(access(strings));

  const formatter = createMemo(() => new LocalizedStringFormatter(locale().locale, dictionary()));

  return formatter;
}
