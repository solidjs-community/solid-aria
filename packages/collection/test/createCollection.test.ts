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

import { createRoot } from "solid-js";

import { createCollection } from "../src";

describe("createCollection", () => {
  it("should add item to the collection", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.items().length).toBe(0);

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.items().length).toBe(1);

      dispose();
    });
  });

  it("should remove item to the collection", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.items().length).toBe(0);

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.items().length).toBe(1);

      collection.removeItem(item1.key);

      expect(collection.items().length).toBe(0);

      dispose();
    });
  });

  it("should returns all item's keys in the collection", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.keys().length).toBe(1);
      expect(collection.keys()[0]).toBe("1");

      dispose();
    });
  });

  it("should retrieve an item by its index", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findByIndex(0)).toBe(item1);

      dispose();
    });
  });

  it("should returns null when no item was found for a given index", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findByIndex(42)).toBe(null);

      dispose();
    });
  });

  it("should retrieve an item by its key", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findByKey("1")).toBe(item1);

      dispose();
    });
  });

  it("should returns null when no item was found for a given key", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findByKey("not exist")).toBe(null);

      dispose();
    });
  });

  it("should retrieve an item index by its key", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findIndexByKey("1")).toBe(0);

      dispose();
    });
  });

  it("should returns -1 when no item index was found for a given key", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findIndexByKey("not exists")).toBe(-1);

      dispose();
    });
  });

  it("should retrieve an item index by searching in its textValue", () => {
    createRoot(dispose => {
      const collator = new Intl.Collator("en", { usage: "search", sensitivity: "base" });

      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findIndexBySearch("O", collator, 0)).toBe(0);

      dispose();
    });
  });

  it("should returns -1 when no item was found for a given textValue search", () => {
    createRoot(dispose => {
      const collator = new Intl.Collator("en", { usage: "search", sensitivity: "base" });

      const collection = createCollection();

      const item1 = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      expect(collection.findIndexBySearch("T", collator, 0)).toBe(-1);

      dispose();
    });
  });

  it("should retrieve first index", () => {
    createRoot(dispose => {
      const collection = createCollection();

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

      collection.addItem(item1);
      collection.addItem(item2);

      expect(collection.getFirstIndex()).toBe(0);

      dispose();
    });
  });

  it("should returns -1 for first index when collection is empty", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.getFirstIndex()).toBe(-1);

      dispose();
    });
  });

  it("should retrieve last index", () => {
    createRoot(dispose => {
      const collection = createCollection();

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

      collection.addItem(item1);
      collection.addItem(item2);

      expect(collection.getLastIndex()).toBe(1);

      dispose();
    });
  });

  it("should returns -1 for last index when collection is empty", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.getLastIndex()).toBe(-1);

      dispose();
    });
  });

  it("should returns whether given index is the first one", () => {
    createRoot(dispose => {
      const collection = createCollection();

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

      collection.addItem(item1);
      collection.addItem(item2);

      expect(collection.isFirstIndex(0)).toBeTruthy();

      dispose();
    });
  });

  it("should returns false when checking first index match and collection is empty", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.isFirstIndex(0)).toBe(false);

      dispose();
    });
  });

  it("should returns whether given index is the last one", () => {
    createRoot(dispose => {
      const collection = createCollection();

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

      collection.addItem(item1);
      collection.addItem(item2);

      expect(collection.isLastIndex(1)).toBeTruthy();

      dispose();
    });
  });

  it("should returns false when checking last index match and collection is empty", () => {
    createRoot(dispose => {
      const collection = createCollection();

      expect(collection.isLastIndex(0)).toBe(false);

      dispose();
    });
  });
});
