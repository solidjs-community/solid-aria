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

import { CollectionBase, Node } from "@solid-aria/collection";
import { ItemKey, SelectionType, SingleSelection } from "@solid-aria/types";
import { createControllableSignal } from "@solid-aria/utils";
import { access } from "@solid-primitives/utils";
import { Accessor, createMemo, mergeProps, splitProps } from "solid-js";

import { createListState, CreateListStateProps, ListState } from "./createListState";

export interface CreateSingleSelectListStateProps
  extends CollectionBase,
    Omit<SingleSelection, "disallowEmptySelection"> {
  /**
   * Filter function to generate a filtered list of nodes.
   */
  filter?: (nodes: Iterable<Node>) => Iterable<Node>;
}

export interface SingleSelectListState extends ListState {
  /**
   * The value of the currently selected item.
   */
  selectedItem: Accessor<Node | undefined>;

  /**
   * The key for the currently selected item.
   */
  selectedKey: Accessor<ItemKey | undefined>;

  /**
   * Sets the selected key.
   */
  setSelectedKey(key: ItemKey): void;
}

/**
 * Provides state management for list-like components with single selection.
 * Handles building a collection of items from props, and manages selection state.
 */
export function createSingleSelectListState(
  props: CreateSingleSelectListStateProps
): SingleSelectListState {
  const [selectedKey, setSelectedKey] = createControllableSignal<ItemKey>({
    value: () => access(props.selectedKey),
    defaultValue: () => access(props.defaultSelectedKey),
    onChange: value => props.onSelectionChange?.(value)
  });

  const selectedKeys = createMemo(() => {
    const selection = selectedKey();
    return selection != null ? [selection] : [];
  });

  const [, defaultCreateListStateProps] = splitProps(props, ["onSelectionChange"]);

  const createListStateProps = mergeProps(defaultCreateListStateProps, {
    selectionMode: "single",
    disallowEmptySelection: true,
    allowDuplicateSelectionEvents: true,
    selectedKeys,
    onSelectionChange: (keys: SelectionType) => {
      // keys cannot be "all" because selectionMode is "single".
      const key = (keys as Set<ItemKey>).values().next().value;

      // Always fire onSelectionChange, even if the key is the same
      // as the current key (createControllableSignal does not).
      if (key === selectedKey()) {
        props.onSelectionChange?.(key);
      }

      setSelectedKey(key);
    }
  } as Partial<CreateListStateProps>);

  const { collection, disabledKeys, selectionManager } = createListState(createListStateProps);

  const selectedItem = createMemo(() => {
    const selection = selectedKey();
    return selection != null ? collection().getItem(selection) : undefined;
  });

  return {
    collection,
    disabledKeys,
    selectionManager,
    selectedKey,
    setSelectedKey,
    selectedItem
  };
}
