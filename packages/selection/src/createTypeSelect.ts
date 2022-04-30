import { DOMElements } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, createSignal, JSX } from "solid-js";

import { ListFocusManager } from "./types";

interface CreateTypeSelectProps {
  /**
   * An interface that implements behavior for keyboard focus movement in a list.
   */
  focusManager: MaybeAccessor<ListFocusManager>;

  /**
   * Called when an item is focused by typing.
   */
  onTypeSelect?: (key: string) => void;
}

interface TypeSelectAria<T extends DOMElements> {
  /**
   * Props to be spread on the owner of the options.
   */
  typeSelectProps: Accessor<JSX.IntrinsicElements[T]>;
}

/**
 * Handles typeahead interactions with collections.
 */
export function createTypeSelect<T extends DOMElements = "ul">(
  props: CreateTypeSelectProps
): TypeSelectAria<T> {
  const [search, setSearch] = createSignal("");
  const [timeoutId, setTimeoutId] = createSignal(-1);

  const onKeyDown = (event: KeyboardEvent) => {
    const focusManager = access(props.focusManager);

    const character = getStringForKey(event.key);

    if (!character || event.ctrlKey || event.metaKey) {
      return;
    }

    // Do not propagate the Spacebar event if it's meant to be part of the search.
    // When we time out, the search term becomes empty, hence the check on length.
    // Trimming is to account for the case of pressing the Spacebar more than once,
    // which should cycle through the selection/deselection of the focused item.
    if (character === " " && search().trim().length > 0) {
      event.preventDefault();
      event.stopPropagation();
    }

    setSearch(prev => (prev += character));

    clearTimeout(timeoutId());

    const id = window.setTimeout(() => {
      focusManager.focusItemForSearch(search());

      const focusedKey = focusManager.focusedKey();

      focusedKey != null && props.onTypeSelect?.(focusedKey);

      setSearch("");
    }, 500);

    setTimeoutId(id);
  };

  const typeSelectProps = createMemo(() => {
    return { onKeyDown } as JSX.IntrinsicElements[T];
  });

  return { typeSelectProps };
}

function getStringForKey(key: string) {
  // If the key is of length 1, it is an ASCII value.
  // Otherwise, if there are no ASCII characters in the key name,
  // it is a Unicode character.
  // See https://www.w3.org/TR/uievents-key/
  if (key.length === 1 || !/^[A-Z]/i.test(key)) {
    return key;
  }

  return "";
}
