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

import { Collection, CollectionBase, createCollection, Node } from "@solid-aria/collection";
import { createMultipleSelectionState, SelectionManager } from "@solid-aria/selection";
import { Expandable, ItemKey, MultipleSelection } from "@solid-aria/types";
import { createControllableSetSignal } from "@solid-aria/utils";
import { access } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, on } from "solid-js";

import { TreeCollection } from "./TreeCollection";

export interface CreateTreeStateProps extends CollectionBase, Expandable, MultipleSelection {}

export interface TreeState {
  /**
   * A selection manager to read and update multiple selection state.
   */
  selectionManager: Accessor<SelectionManager>;

  /**
   * A collection of items in the tree.
   */
  collection: Accessor<Collection<Node>>;

  /**
   * A set of keys for items that are disabled.
   */
  disabledKeys: Accessor<Set<ItemKey>>;

  /**
   * A set of keys for items that are expanded.
   */
  expandedKeys: Accessor<Set<ItemKey>>;

  /**
   * Toggles the expanded state for an item by its key.
   */
  toggleKey: (key: ItemKey) => void;
}

/**
 * Provides state management for tree-like components. Handles building a collection
 * of items from props, item expanded state, and manages multiple selection state.
 */
export function createTreeState(props: CreateTreeStateProps): TreeState {
  const [expandedKeys, setExpandedKeys] = createControllableSetSignal<ItemKey>({
    value: () => {
      const expandedKeys = access(props.expandedKeys);
      return expandedKeys ? new Set(expandedKeys) : undefined;
    },
    defaultValue: () => {
      const defaultExpandedKeys = access(props.defaultExpandedKeys);
      return defaultExpandedKeys ? new Set(defaultExpandedKeys) : new Set();
    },
    onChange: value => props.onExpandedChange?.(value)
  });

  const selectionState = createMultipleSelectionState(props);

  const disabledKeys = createMemo(() => {
    const disabledKeys = access(props.disabledKeys);
    return disabledKeys ? new Set(disabledKeys) : new Set<ItemKey>();
  });

  const factory = (nodes: Iterable<Node>) => new TreeCollection(nodes, expandedKeys());

  const collection = createCollection(props, factory, [expandedKeys]);

  const selectionManager = createMemo(() => new SelectionManager(collection(), selectionState));

  const toggleKey = (key: ItemKey) => {
    const newSet = new Set(expandedKeys());

    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }

    setExpandedKeys(newSet);
  };

  // Reset focused key if that item is deleted from the collection.
  createEffect(
    on([collection, selectionState.focusedKey], newValue => {
      const [collection, focusedKey] = newValue;

      if (focusedKey != null && !collection.getItem(focusedKey)) {
        selectionState.setFocusedKey(undefined);
      }
    })
  );

  return {
    selectionManager,
    collection,
    expandedKeys,
    disabledKeys,
    toggleKey
  };
}
