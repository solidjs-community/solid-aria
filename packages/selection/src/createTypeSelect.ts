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

import { DOMElements, ItemKey, KeyboardDelegate } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, createSignal, JSX } from "solid-js";

import { MultipleSelectionManager } from "./types";

interface CreateTypeSelectProps {
  /**
   * A delegate that returns collection item keys with respect to visual layout.
   */
  keyboardDelegate: MaybeAccessor<KeyboardDelegate>;

  /**
   * An interface for reading and updating multiple selection state.
   */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /**
   * Called when an item is focused by typing.
   */
  onTypeSelect?: (key: ItemKey) => void;
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

  const onKeyDown = (e: KeyboardEvent) => {
    const keyboardDelegate = access(props.keyboardDelegate);
    const selectionManager = access(props.selectionManager);

    const character = getStringForKey(e.key);
    if (!character || e.ctrlKey || e.metaKey) {
      return;
    }

    // Do not propagate the Spacebar event if it's meant to be part of the search.
    // When we time out, the search term becomes empty, hence the check on length.
    // Trimming is to account for the case of pressing the Spacebar more than once,
    // which should cycle through the selection/deselection of the focused item.
    if (character === " " && search().trim().length > 0) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newSearch = setSearch(prev => (prev += character));

    // Use the delegate to find a key to focus.
    // Prioritize items after the currently focused item, falling back to searching the whole list.
    let key = keyboardDelegate.getKeyForSearch?.(newSearch, selectionManager.focusedKey());

    // If no key found, search from the top.
    if (key == null) {
      key = keyboardDelegate.getKeyForSearch?.(newSearch);
    }

    if (key != null) {
      selectionManager.setFocusedKey(key);
      props.onTypeSelect?.(key);
    }

    clearTimeout(timeoutId());

    setTimeoutId(window.setTimeout(() => setSearch(""), 500));
  };

  const typeSelectProps = createMemo(() => {
    const keyboardDelegate = access(props.keyboardDelegate);

    return {
      onKeyDown: keyboardDelegate.getKeyForSearch ? onKeyDown : null
    } as JSX.IntrinsicElements[T];
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
