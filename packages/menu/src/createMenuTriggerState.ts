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
  createOverlayTriggerState,
  CreateOverlayTriggerStateProps,
  OverlayTriggerState
} from "@solid-aria/overlays";
import { FocusStrategy } from "@solid-aria/types";
import { Accessor, createSignal } from "solid-js";

export interface MenuTriggerState extends OverlayTriggerState {
  /**
   * Controls which item will be auto focused when the menu opens.
   */
  focusStrategy: Accessor<FocusStrategy | undefined>;

  /**
   * Opens the menu.
   */
  open: (focusStrategy?: FocusStrategy) => void;

  /**
   * Toggles the menu.
   */
  toggle: (focusStrategy?: FocusStrategy) => void;
}

/**
 * Manages state for a menu trigger. Tracks whether the menu is currently open,
 * and controls which item will receive focus when it opens.
 */
export function createMenuTriggerState(props: CreateOverlayTriggerStateProps): MenuTriggerState {
  const overlayTriggerState = createOverlayTriggerState(props);
  const [focusStrategy, setFocusStrategy] = createSignal<FocusStrategy>();

  const open = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    overlayTriggerState.open();
  };

  const toggle = (focusStrategy?: FocusStrategy) => {
    setFocusStrategy(focusStrategy);
    overlayTriggerState.toggle();
  };

  return {
    focusStrategy,
    ...overlayTriggerState,
    // override the ones from `overlayTriggerState`
    open,
    toggle
  };
}
