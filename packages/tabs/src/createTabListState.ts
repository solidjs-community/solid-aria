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

import { createSingleSelectListState, SingleSelectListState } from "@solid-aria/list";
import { createEffect, createSignal } from "solid-js";

import { CreateTabListStateProps } from "./types";

export type TabListState = SingleSelectListState;

/**
 * Provides state management for a Tabs component. Tabs include a TabList which tracks
 * which tab is currently selected and displays the content associated with that Tab in a TabPanel.
 */
export function createTabListState(props: CreateTabListStateProps): TabListState {
  const state = createSingleSelectListState(props);

  const [lastSelectedKey, setLastSelectedKey] = createSignal(state.selectedKey());

  createEffect(() => {
    const selectionManager = state.selectionManager();
    const collection = state.collection();
    const disabledKeys = state.disabledKeys();

    let selectedKey = state.selectedKey();

    // Ensure a tab is always selected (in case no selected key was specified or if selected item was deleted from collection)
    if (selectionManager.isEmpty() || (selectedKey != null && !collection.getItem(selectedKey))) {
      selectedKey = collection.getFirstKey();

      // loop over tabs until we find one that isn't disabled and select that
      while (
        selectedKey != null &&
        disabledKeys.has(selectedKey) &&
        selectedKey !== collection.getLastKey()
      ) {
        selectedKey = collection.getKeyAfter(selectedKey);
      }

      // if this check is true, then every item is disabled, it makes more sense to default to the first key than the last
      if (
        selectedKey != null &&
        disabledKeys.has(selectedKey) &&
        selectedKey === collection.getLastKey()
      ) {
        selectedKey = collection.getFirstKey();
      }

      // directly set selection because replace/toggle selection won't consider disabled keys
      if (selectedKey != null) {
        selectionManager.setSelectedKeys([selectedKey]);
      }
    }

    // If the tablist doesn't have focus and the selected key changes or if there isn't a focused key yet, change focused key to the selected key if it exists.
    if (
      (!selectionManager.isFocused() && selectedKey !== lastSelectedKey()) ||
      selectionManager.focusedKey() == null
    ) {
      selectionManager.setFocusedKey(selectedKey);
    }

    setLastSelectedKey(selectedKey);
  });

  return state;
}
