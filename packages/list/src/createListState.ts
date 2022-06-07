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
import {
  createMultipleSelectionState,
  MultipleSelectionStateProps,
  SelectionManager
} from "@solid-aria/selection";
import { ItemKey } from "@solid-aria/types";
import { access } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo } from "solid-js";

import { ListCollection } from "./ListCollection";

export interface CreateListStateProps extends CollectionBase, MultipleSelectionStateProps {
  /**
   * Filter function to generate a filtered list of nodes.
   */
  filter?: (nodes: Iterable<Node>) => Iterable<Node>;
}

export interface ListState {
  /**
   * A collection of items in the list.
   */
  collection: Accessor<Collection<Node>>;

  /**
   * A set of items that are disabled.
   */
  disabledKeys: Accessor<Set<ItemKey>>;

  /**
   * A selection manager to read and update multiple selection state.
   */
  selectionManager: Accessor<SelectionManager>;
}

/**
 * Provides state management for list-like components. Handles building a collection
 * of items from props, and manages multiple selection state.
 */
export function createListState(props: CreateListStateProps): ListState {
  const selectionState = createMultipleSelectionState(props);

  const disabledKeys = createMemo(() => {
    const disabledKeys = access(props.disabledKeys);
    return disabledKeys ? new Set(disabledKeys) : new Set<ItemKey>();
  });

  const factory = (nodes: Iterable<Node>) => {
    return props.filter ? new ListCollection(props.filter(nodes)) : new ListCollection(nodes);
  };

  const collection = createCollection(props, factory, [() => props.filter]);

  const selectionManager = createMemo(() => new SelectionManager(collection(), selectionState));

  // Reset focused key if that item is deleted from the collection.
  createEffect(() => {
    const focusedKey = selectionState.focusedKey();

    if (focusedKey != null && !collection().getItem(focusedKey)) {
      selectionState.setFocusedKey();
    }
  });

  return {
    collection,
    disabledKeys,
    selectionManager
  };
}
