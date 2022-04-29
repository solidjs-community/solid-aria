import { Collection, Item } from "@solid-aria/collection";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { createSignal } from "solid-js";

import { ListFocusManager, SelectionManager } from "./types";

export interface CreateListFocusManagerProps<T> {
  /**
   * The managed collection.
   */
  collection: Collection<T>;

  /**
   * An interface for managing selection state in collection.
   */
  selectionManager: SelectionManager;

  /**
   * Whether focus should wrap around when the end/start is reached.
   */
  shouldFocusWrap: MaybeAccessor<boolean>;
}

/**
 * Manage keyboard focus movement behavior in a list.
 */
export function createListFocusManager<T extends Item<any>>(
  props: CreateListFocusManagerProps<T>
): ListFocusManager {
  const [focusedKey, setFocusedKey] = createSignal<string | undefined>();

  const isFocusedKey = (key: string) => {
    return key === focusedKey();
  };

  const focusAtIndex = (index: number | null, move: "forward" | "backward") => {
    if (index == null) {
      return;
    }

    const item = props.collection.findByIndex(index);

    if (!item) {
      return;
    }

    if (item.isDisabled()) {
      // All items after the focused one was disabled, do nothing
      if (move === "forward" && props.collection.isLastIndex(index)) {
        return;
      }

      // All items before the focused one was disabled, do nothing
      if (move === "backward" && props.collection.isFirstIndex(index)) {
        return;
      }

      // Move forward or backward until we find an enabled item to focus.
      const nextIndex = move === "forward" ? index + 1 : index - 1;

      focusAtIndex(nextIndex, move);

      return;
    }

    setFocusedKey(item.key);

    item.ref.focus();
  };

  const focusFirst = () => {
    focusAtIndex(props.collection.getFirstIndex(), "forward");
  };

  const focusLast = () => {
    focusAtIndex(props.collection.getLastIndex(), "backward");
  };

  const focusPrevious = () => {
    const index = props.collection.findIndexByKey(focusedKey());

    if (index == null) {
      return;
    }

    if (props.collection.isFirstIndex(index)) {
      access(props.shouldFocusWrap) && focusLast();
      return;
    }

    focusAtIndex(index - 1, "backward");
  };

  const focusNext = () => {
    const index = props.collection.findIndexByKey(focusedKey());

    if (index == null) {
      return;
    }

    if (props.collection.isLastIndex(index)) {
      access(props.shouldFocusWrap) && focusFirst();
      return;
    }

    focusAtIndex(index + 1, "forward");
  };

  const focusFirstSelected = () => {
    // A previously focused option exist, bring back focus to it.
    if (focusedKey() != null) {
      focusAtIndex(props.collection.findIndexByKey(focusedKey()), "forward");
      return;
    }

    // No selection, focus the first option.
    if (props.selectionManager.isEmpty()) {
      focusFirst();
      return;
    }

    // Focus the first option in the listbox that is selected.
    focusAtIndex(props.selectionManager.getFirstSelectedIndex(), "forward");
  };

  return {
    focusedKey,
    isFocusedKey,
    setFocusedKey,
    focusFirst,
    focusLast,
    focusPrevious,
    focusNext,
    focusFirstSelected
  };
}
