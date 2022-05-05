import { createCollection, Item } from "@solid-aria/collection";
import { createRoot } from "solid-js";

import { createSelectionManager } from "../src";

describe("createSelectionManager", () => {
  it("can have default selected keys (uncontrolled)", () => {
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
        defaultSelectedKeys: new Set([item1.key])
      });

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
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

      const controlledSelectedKeys = new Set([item1.key]);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "multiple",
        selectedKeys: controlledSelectedKeys
      });

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      controlledSelectedKeys.add(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(2);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      dispose();
    });
  });

  it("should call onSelectionChange callback", () => {
    createRoot(dispose => {
      const onSelectionChangeSpy = jest.fn();

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
        onSelectionChange: onSelectionChangeSpy
      });

      selectionManager.select(item1.key);

      expect(onSelectionChangeSpy).toHaveBeenCalledTimes(1);
      expect(onSelectionChangeSpy).toHaveBeenCalledWith(new Set([item1.key]));

      dispose();
    });
  });

  it("should returns true when checking if the selection is empty and no item is selected", () => {
    createRoot(dispose => {
      const collection = createCollection();
      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      expect(selectionManager.isEmpty()).toBeTruthy();

      dispose();
    });
  });

  it("should returns true when checking if an item is selected and it is in the selection", () => {
    createRoot(dispose => {
      const collection = createCollection();

      const item1: Item = {
        key: "1",
        ref: document.createElement("div"),
        textValue: "One",
        isDisabled: () => false
      };

      collection.addItem(item1);

      const selectionManager = createSelectionManager({
        collection,
        selectionMode: "single"
      });

      selectionManager.select(item1.key);

      expect(selectionManager.isSelected(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should returns the index of the first item that is selected in the collection", () => {
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

      selectionManager.select(item3.key);

      expect(selectionManager.getFirstSelectedIndex()).toBe(2);

      dispose();
    });
  });

  it("should replace the current selection", () => {
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

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.replaceSelection(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeFalsy();
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should replace the current selection when toggling selection and selection mode is single and the item is not selected", () => {
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

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.toggleSelection(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeFalsy();
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should remove from selection when toggling selection and allowEmptySelection is true and the item is selected", () => {
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
        allowEmptySelection: true
      });

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.toggleSelection(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(0);

      dispose();
    });
  });

  it("should not remove from selection when toggling selection and allowEmptySelection is false and the item is selected", () => {
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
        allowEmptySelection: false
      });

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.toggleSelection(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);

      dispose();
    });
  });

  it("should add to selection when toggling selection and selectionMode is multiple and the item is not selected", () => {
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
        selectionMode: "multiple"
      });

      selectionManager.toggleSelection(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.toggleSelection(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(2);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should toggle selection when selecting and selectionMode is single and item is selected and allowEmptySelection is true", () => {
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
        allowEmptySelection: true
      });

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(0);

      dispose();
    });
  });

  it("should replace selection when selecting and selectionMode is single and item is not selected", () => {
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

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeFalsy();
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });

  it("should replace selection when selecting and selectionMode is single and allowEmptySelection is false", () => {
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

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      dispose();
    });
  });

  it("should toggle selection when selecting and selectionMode is multiple and allowEmptySelection is true", () => {
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
        selectionMode: "multiple",
        allowEmptySelection: true
      });

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(2);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeFalsy();

      dispose();
    });
  });

  it("should not remove from selection when selecting and selectionMode is multiple and allowEmptySelection is false and there is only one selected item", () => {
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
        selectionMode: "multiple",
        allowEmptySelection: false
      });

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.select(item3.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      dispose();
    });
  });

  it("should select all", () => {
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
        selectionMode: "multiple"
      });

      selectionManager.selectAll();

      expect(selectionManager.selectedKeys()?.size).toBe(3);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item2.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      dispose();
    });
  });

  it("should clear selection when allowEmptySelection is true", () => {
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
        selectionMode: "multiple",
        allowEmptySelection: true
      });

      selectionManager.selectAll();

      expect(selectionManager.selectedKeys()?.size).toBe(3);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item2.key)).toBeTruthy();
      expect(selectionManager.selectedKeys()?.has(item3.key)).toBeTruthy();

      selectionManager.clearSelection();

      expect(selectionManager.selectedKeys()?.size).toBe(0);

      dispose();
    });
  });

  it("should not clear selection when allowEmptySelection is false", () => {
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
        allowEmptySelection: false
      });

      selectionManager.select(item1.key);

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      selectionManager.clearSelection();

      expect(selectionManager.selectedKeys()?.size).toBe(1);
      expect(selectionManager.selectedKeys()?.has(item1.key)).toBeTruthy();

      dispose();
    });
  });
});
