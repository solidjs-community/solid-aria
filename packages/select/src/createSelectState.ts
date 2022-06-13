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

import {
  createSingleSelectListState,
  CreateSingleSelectListStateProps,
  SingleSelectListState
} from "@solid-aria/list";
import { createMenuTriggerState, MenuTriggerState } from "@solid-aria/menu";
import { CreateOverlayTriggerStateProps } from "@solid-aria/overlays";
import { FocusStrategy } from "@solid-aria/types";
import { Accessor, createMemo, createSignal, mergeProps } from "solid-js";

export interface CreateSelectStateProps
  extends CreateOverlayTriggerStateProps,
    CreateSingleSelectListStateProps {}

export interface SelectState extends SingleSelectListState, MenuTriggerState {
  /**
   * Whether the select is currently focused.
   */
  isFocused: Accessor<boolean>;

  /**
   * Sets whether the select is focused.
   */
  setFocused(isFocused: boolean): void;
}

/**
 * Provides state management for a select component. Handles building a collection
 * of items from props, handles the open state for the popup menu, and manages
 * multiple selection state.
 */
export function createSelectState(props: CreateSelectStateProps): SelectState {
  const [isFocused, setFocused] = createSignal(false);

  const triggerState = createMenuTriggerState(props);

  const createSingleSelectListStateProps = mergeProps(props, {
    onSelectionChange: key => {
      props.onSelectionChange?.(key);
      triggerState.close();
    }
  } as Partial<CreateSingleSelectListStateProps>);

  const listState = createSingleSelectListState(createSingleSelectListStateProps);

  const isCollectionEmpty = createMemo(() => listState.collection().size === 0);

  const open = () => {
    // Don't open if the collection is empty.
    if (isCollectionEmpty()) {
      return;
    }

    triggerState.open();
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    if (isCollectionEmpty()) {
      return;
    }

    triggerState.toggle(focusStrategy);
  };

  // eslint-disable-next-line solid/reactivity
  return mergeProps(listState, triggerState, { open, toggle, isFocused, setFocused });
}
