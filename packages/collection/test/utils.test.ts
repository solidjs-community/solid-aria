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

import { createRoot } from "solid-js";

import { filterItems } from "../src/utils";

describe("filterItems", () => {
  it("should returns items matching the given filter", () => {
    createRoot(dispose => {
      const collator = new Intl.Collator("en", { usage: "search", sensitivity: "base" });

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2 = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3 = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      const items = [item1, item2, item3];

      const filteredItems = filterItems(items, "T", collator);

      expect(filteredItems.length).toBe(2);
      expect(filteredItems[0]).toBe(item2);
      expect(filteredItems[1]).toBe(item3);

      dispose();
    });
  });

  it("should ignore disabled items", () => {
    createRoot(dispose => {
      const collator = new Intl.Collator("en", { usage: "search", sensitivity: "base" });

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2 = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => true
      };

      const item3 = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      const items = [item1, item2, item3];

      const filteredItems = filterItems(items, "T", collator);

      expect(filteredItems.length).toBe(1);
      expect(filteredItems[0]).toBe(item3);

      dispose();
    });
  });
});
