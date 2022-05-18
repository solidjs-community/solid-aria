/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { Collection } from "@solid-aria/collection";
import { createControllableSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";

import { SelectionManager, SelectionMode } from "./types";

export interface CreateSelectionManagerProps {
  /**
   * The managed collection.
   */
  collection: Collection;

  /**
   * The type of selection that is allowed in the collection.
   */
  selectionMode: MaybeAccessor<SelectionMode>;

  /**
   * The currently selected keys in the collection (controlled).
   */
  selectedKeys?: MaybeAccessor<Set<string> | undefined>;

  /**
   * The initial selected keys in the collection (uncontrolled).
   */
  defaultSelectedKeys?: MaybeAccessor<Set<string> | undefined>;

  /**
   * Whether the collection allows empty selection.
   */
  allowEmptySelection?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the selection changes.
   */
  onSelectionChange?: (keys: Set<string>) => void;
}

/**
 * Manage selection in a collection.
 */
export function createSelectionManager(props: CreateSelectionManagerProps): SelectionManager {
  const [selectedKeys, setSelectedKeys] = createControllableSignal<Set<string>>({
    value: () => access(props.selectedKeys),
    defaultValue: () => access(props.defaultSelectedKeys) ?? new Set([]),
    onChange: value => props.onSelectionChange?.(value)
  });

  const selectionMode = () => access(props.selectionMode);

  const isEmpty = () => {
    return !selectedKeys() || selectedKeys()?.size === 0;
  };

  const isSelected = (key: string) => {
    return selectedKeys()?.has(key) ?? false;
  };

  const getFirstSelectedIndex = () => {
    return props.collection.items().findIndex(item => selectedKeys()?.has(item.key));
  };

  const replaceSelection = (key: string) => {
    setSelectedKeys(new Set([key]));
  };

  const toggleSelection = (key: string) => {
    if (access(props.selectionMode) === "single" && !isSelected(key)) {
      replaceSelection(key);
      return;
    }

    const keys = new Set(selectedKeys());

    isSelected(key) ? keys.delete(key) : keys.add(key);

    if (!access(props.allowEmptySelection) && keys.size === 0) {
      return;
    }

    setSelectedKeys(keys);
  };

  const select = (key: string) => {
    if (access(props.selectionMode) === "single") {
      if (isSelected(key) && access(props.allowEmptySelection)) {
        toggleSelection(key);
      } else {
        replaceSelection(key);
      }
    } else {
      toggleSelection(key);
    }
  };

  const selectAll = () => {
    if (access(props.selectionMode) !== "multiple") {
      return;
    }

    setSelectedKeys(new Set(props.collection.keys()));
  };

  const clearSelection = () => {
    if (!access(props.allowEmptySelection)) {
      return;
    }

    setSelectedKeys(new Set([]));
  };

  return {
    selectionMode,
    selectedKeys,
    isEmpty,
    isSelected,
    getFirstSelectedIndex,
    replaceSelection,
    toggleSelection,
    select,
    selectAll,
    clearSelection
  };
}
