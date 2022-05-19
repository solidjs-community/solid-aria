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

import { Direction } from "@solid-aria/types";

// https://en.wikipedia.org/wiki/Right-to-left
const RTL_SCRIPTS = new Set([
  "Avst",
  "Arab",
  "Armi",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr"
]);

export const RTL_LANGS = new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi"
]);

/**
 * Determines if a locale is read right to left using [Intl.Locale]
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale}.
 */
export function isRTL(locale: string) {
  // If the Intl.Locale API is available, use it to get the script for the locale.
  // This is more accurate than guessing by language, since languages can be written in multiple scripts.
  if (Intl.Locale) {
    const script = new Intl.Locale(locale).maximize().script ?? "";

    return RTL_SCRIPTS.has(script);
  }

  // If not, just guess by the language (first part of the locale)
  const lang = locale.split("-")[0];
  return RTL_LANGS.has(lang);
}

export function getReadingDirection(locale: string): Direction {
  return isRTL(locale) ? "rtl" : "ltr";
}
