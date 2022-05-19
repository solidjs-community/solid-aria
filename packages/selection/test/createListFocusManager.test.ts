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

import { createCollection, Item } from "@solid-aria/collection";
import { createRoot } from "solid-js";

import { createListFocusManager, createSelectionManager } from "../src";

describe("createListFocusManager", () => {
  it("should focus the item with the given key", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item1Focus = jest.spyOn(item1.ref, "focus");

      focusManager.focusItemForKey(item1.key);

      expect(focusManager.focusedKey()).toBe(item1.key);
      expect(item1Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should focus the item with textValue that start with the given search term", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item3Focus = jest.spyOn(item3.ref, "focus");

      focusManager.focusItemForSearch("th");

      expect(focusManager.focusedKey()).toBe(item3.key);
      expect(item3Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should return true when the given key is the focused one", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      focusManager.focusItemForKey(item1.key);

      expect(focusManager.isFocusedKey(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should focus the first item", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item1Focus = jest.spyOn(item1.ref, "focus");

      focusManager.focusFirstItem();

      expect(focusManager.focusedKey()).toBe(item1.key);
      expect(item1Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should focus the last item", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item3Focus = jest.spyOn(item3.ref, "focus");

      focusManager.focusLastItem();

      expect(focusManager.focusedKey()).toBe(item3.key);
      expect(item3Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should focus the item above (previous) the currently focused one", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item1Focus = jest.spyOn(item1.ref, "focus");
      const item2Focus = jest.spyOn(item2.ref, "focus");

      focusManager.focusItemForKey(item2.key);

      expect(focusManager.focusedKey()).toBe(item2.key);
      expect(item2Focus).toHaveBeenCalledTimes(1);

      focusManager.focusItemAbove();

      expect(focusManager.focusedKey()).toBe(item1.key);
      expect(item1Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should focus the item below (next) the currently focused one", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item2Focus = jest.spyOn(item2.ref, "focus");
      const item3Focus = jest.spyOn(item3.ref, "focus");

      focusManager.focusItemForKey(item2.key);

      expect(focusManager.focusedKey()).toBe(item2.key);
      expect(item2Focus).toHaveBeenCalledTimes(1);

      focusManager.focusItemBelow();

      expect(focusManager.focusedKey()).toBe(item3.key);
      expect(item3Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });

  it("should focus the first item that is selected in the collection", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      const item2: Item = {
        key: "2",
        ref: document.createElement("div"),
        textValue: "Two",
        isDisabled: () => false
      };

      const item3: Item = {
        key: "3",
        ref: document.createElement("div"),
        textValue: "Three",
        isDisabled: () => false
      };

      collection.addItem(item1);
      collection.addItem(item2);
      collection.addItem(item3);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single",
        defaultSelectedKeys: new Set([item2.key])
      });

      const scrollRef = document.createElement("ul");

      const focusManager = createListFocusManager({
        collection,
        selectionManager,
        scrollRef: () => scrollRef,
        shouldFocusWrap: false
      });

      const item2Focus = jest.spyOn(item2.ref, "focus");

      focusManager.focusFirstSelectedItem();

      expect(focusManager.focusedKey()).toBe(item2.key);
      expect(item2Focus).toHaveBeenCalledTimes(1);

      dispose();
    });
  });
});
