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

import { Collection, Node } from "@solid-aria/collection";
import { createCollator } from "@solid-aria/i18n";
import { FocusStrategy, ItemKey, KeyboardDelegate } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX } from "solid-js";

import { createSelectableCollection } from "./createSelectableCollection";
import { ListKeyboardDelegate } from "./ListKeyboardDelegate";
import { MultipleSelectionManager } from "./types";

interface CreateSelectableListProps {
  /**
   * An interface for reading and updating multiple selection state.
   */
  selectionManager: MaybeAccessor<MultipleSelectionManager>;

  /**
   * State of the collection.
   */
  collection: MaybeAccessor<Collection<Node>>;

  /**
   * The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with.
   */
  disabledKeys: MaybeAccessor<Set<ItemKey>>;

  /**
   * A delegate that returns collection item keys with respect to visual layout.
   */
  keyboardDelegate?: MaybeAccessor<KeyboardDelegate | undefined>;

  /**
   * Whether the collection or one of its items should be automatically focused upon render.
   * @default false
   */
  autoFocus?: MaybeAccessor<boolean | FocusStrategy | undefined>;

  /**
   * Whether focus should wrap around when the end/start is reached.
   * @default false
   */
  shouldFocusWrap?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the option is contained in a virtual scroller.
   */
  isVirtualized?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the collection allows empty selection.
   * @default false
   */
  disallowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether selection should occur automatically on focus.
   * @default false
   */
  selectOnFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether typeahead is disabled.
   * @default false
   */
  disallowTypeAhead?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the collection items should use virtual focus instead of being focused directly.
   */
  shouldUseVirtualFocus?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether navigation through tab key is enabled.
   */
  allowsTabNavigation?: MaybeAccessor<boolean | undefined>;
}

interface SelectableListAria {
  /**
   * Props for the option element.
   */
  listProps: Accessor<JSX.HTMLAttributes<any>>;
}

/**
 * Handles interactions with a selectable list.
 * @param props Props for the list.
 * @param ref A ref to the item
 */
export function createSelectableList<T extends HTMLElement>(
  props: CreateSelectableListProps,
  ref: Accessor<T | undefined>
): SelectableListAria {
  const collator = createCollator({ usage: "search", sensitivity: "base" });

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  // When virtualized, the layout object will be passed in as a prop and override this.
  const delegate = createMemo(() => {
    const keyboardDelegate = access(props.keyboardDelegate);

    if (keyboardDelegate) {
      return keyboardDelegate;
    }

    const collection = access(props.collection);
    const disabledKeys = access(props.disabledKeys);

    return new ListKeyboardDelegate(collection, disabledKeys, ref(), collator());
  });

  const { collectionProps } = createSelectableCollection(
    {
      keyboardDelegate: delegate,
      selectionManager: () => access(props.selectionManager),
      autoFocus: () => access(props.autoFocus),
      shouldFocusWrap: () => access(props.shouldFocusWrap),
      disallowEmptySelection: () => access(props.disallowEmptySelection),
      selectOnFocus: () => access(props.selectOnFocus),
      disallowTypeAhead: () => access(props.disallowTypeAhead),
      shouldUseVirtualFocus: () => access(props.shouldUseVirtualFocus),
      allowsTabNavigation: () => access(props.allowsTabNavigation),
      isVirtualized: () => access(props.isVirtualized)
    },
    ref
  );

  return {
    listProps: collectionProps
  };
}
