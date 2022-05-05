import { Collection, Item } from "@solid-aria/collection";
import { createCollator } from "@solid-aria/i18n";
import { focusWithoutScrolling, scrollIntoView } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createSignal } from "solid-js";

import { ListFocusManager, SelectionManager } from "./types";

export interface CreateListFocusManagerProps {
  /**
   * The managed collection.
   */
  collection: Collection;

  /**
   * An interface for managing selection state in collection.
   */
  selectionManager: SelectionManager;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap: MaybeAccessor<boolean>;

  /**
   * The ref attached to the scrollable body.
   * Used to provide automatic scrolling on item focus.
   * Can be the element representing the collection or a descendant.
   */
  scrollRef: Accessor<HTMLElement | undefined>;
}

/**
 * Manage keyboard focus movement behavior in a list.
 * @param props - Props for the ListFocusManager.
 */
export function createListFocusManager(props: CreateListFocusManagerProps): ListFocusManager {
  const collator = createCollator({ usage: "search", sensitivity: "base" });

  const [focusedKey, setFocusedKey] = createSignal<string | undefined>();

  const isFocusedKey = (key: string) => {
    return key === focusedKey();
  };

  const focusItem = (item: Item) => {
    setFocusedKey(item.key);

    const scrollParent = props.scrollRef();
    const itemElement = item.ref;

    if (scrollParent) {
      focusWithoutScrolling(itemElement);
      scrollIntoView(scrollParent, itemElement);
    } else {
      itemElement.focus();
    }
  };

  const focusAtIndex = (index: number, move: "forward" | "backward") => {
    const item = props.collection.findByIndex(index);

    if (!item) {
      return;
    }

    if (item.isDisabled()) {
      // All items after the focused one was disabled.
      if (move === "forward" && props.collection.isLastIndex(index)) {
        // try focus the first enabled item if focus wrap is allowed.
        access(props.shouldFocusWrap) && focusFirstItem();
        return;
      }

      // All items before the focused one was disabled.
      if (move === "backward" && props.collection.isFirstIndex(index)) {
        // try focus the last enabled item if focus wrap is allowed.
        access(props.shouldFocusWrap) && focusLastItem();
        return;
      }

      // Move forward or backward until we find an enabled item to focus.
      const nextIndex = move === "forward" ? index + 1 : index - 1;

      focusAtIndex(nextIndex, move);

      return;
    }

    focusItem(item);

    return item;
  };

  const focusFirstItem = () => {
    focusAtIndex(props.collection.getFirstIndex(), "forward");
  };

  const focusLastItem = () => {
    focusAtIndex(props.collection.getLastIndex(), "backward");
  };

  const focusItemAbove = () => {
    const index = props.collection.findIndexByKey(focusedKey());

    if (props.collection.isFirstIndex(index)) {
      access(props.shouldFocusWrap) && focusLastItem();
      return;
    }

    focusAtIndex(index - 1, "backward");
  };

  const focusItemBelow = () => {
    const index = props.collection.findIndexByKey(focusedKey());

    if (props.collection.isLastIndex(index)) {
      access(props.shouldFocusWrap) && focusFirstItem();
      return;
    }

    focusAtIndex(index + 1, "forward");
  };

  const focusItemPageAbove = () => {
    let index = props.collection.findIndexByKey(focusedKey());

    const scrollParent = props.scrollRef();
    let item = props.collection.findByIndex(index);

    if (!item || !scrollParent) {
      return;
    }

    const pageY = Math.max(
      0,
      item.ref.offsetTop + item.ref.offsetHeight - scrollParent.offsetHeight
    );

    while (item && item.ref.offsetTop > pageY) {
      if (props.collection.isFirstIndex(index)) {
        break;
      }

      index = index - 1;
      item = props.collection.findByIndex(index);
    }

    focusAtIndex(index, "backward");
  };

  const focusItemPageBelow = () => {
    let index = props.collection.findIndexByKey(focusedKey());

    const scrollParent = props.scrollRef();
    let item = props.collection.findByIndex(index);

    if (!item || !scrollParent) {
      return;
    }

    const pageY = Math.min(
      scrollParent.scrollHeight,
      item.ref.offsetTop - item.ref.offsetHeight + scrollParent.offsetHeight
    );

    while (item && item.ref.offsetTop < pageY) {
      if (props.collection.isLastIndex(index)) {
        break;
      }

      index = index + 1;
      item = props.collection.findByIndex(index);
    }

    focusAtIndex(index, "forward");
  };

  const focusItemForKey = (key: string) => {
    const index = props.collection.findIndexByKey(key);

    focusAtIndex(index, "forward");
  };

  const focusItemForSearch = (search: string) => {
    const focusedIndex = props.collection.findIndexByKey(focusedKey());

    const nextIndex = props.collection.findIndexBySearch(search, collator(), focusedIndex + 1);

    return focusAtIndex(nextIndex, "forward");
  };

  const focusFirstSelectedItem = () => {
    // A previously focused item exist (e.g. has tabIndex=0), bring back focus to it.
    if (focusedKey() != null) {
      focusAtIndex(props.collection.findIndexByKey(focusedKey()), "forward");
      return;
    }

    // No previous selection, focus the first enabled item.
    if (props.selectionManager.isEmpty()) {
      focusFirstItem();
      return;
    }

    // Focus the first item in the listbox that is selected.
    focusAtIndex(props.selectionManager.getFirstSelectedIndex(), "forward");
  };

  return {
    focusedKey,
    isFocusedKey,
    focusFirstItem,
    focusLastItem,
    focusItemAbove,
    focusItemBelow,
    focusItemPageAbove,
    focusItemPageBelow,
    focusItemForKey,
    focusItemForSearch,
    focusFirstSelectedItem
  };
}
