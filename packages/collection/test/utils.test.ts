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
