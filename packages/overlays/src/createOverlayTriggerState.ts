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

import { createControllableBooleanSignal } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor } from "solid-js";

export interface CreateOverlayTriggerStateProps {
  /**
   * Whether the overlay is open by default (controlled).
   */
  isOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the overlay is open by default (uncontrolled).
   */
  defaultOpen?: MaybeAccessor<boolean | undefined>;

  /**
   * Handler that is called when the overlay's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
}

export interface OverlayTriggerState {
  /**
   * Whether the overlay is currently open.
   */
  isOpen: Accessor<boolean>;

  /**
   * Sets whether the overlay is open.
   */
  setOpen: (isOpen: boolean) => void;

  /**
   * Opens the overlay.
   */
  open: () => void;

  /**
   * Closes the overlay.
   */
  close: () => void;

  /**
   * Toggles the overlay's visibility.
   */
  toggle: () => void;
}

/**
 * Manages state for an overlay trigger. Tracks whether the overlay is open, and provides
 * methods to toggle this state.
 */
export function createOverlayTriggerState(
  props: CreateOverlayTriggerStateProps
): OverlayTriggerState {
  const [isOpen, setOpen] = createControllableBooleanSignal({
    value: () => access(props.isOpen),
    defaultValue: () => !!access(props.defaultOpen),
    onChange: value => props.onOpenChange?.(value)
  });

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  const toggle = () => {
    setOpen(!isOpen());
  };

  return { isOpen, setOpen, open, close, toggle };
}
