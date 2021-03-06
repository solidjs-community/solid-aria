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

import { AriaButtonProps } from "@solid-aria/button";
import { createId } from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { JSX } from "solid-js";

import {
  createOverlayTriggerState,
  CreateOverlayTriggerStateProps,
  OverlayTriggerState
} from "./createOverlayTriggerState";

export interface AriaOverlayTriggerProps extends CreateOverlayTriggerStateProps {
  /**
   * Type of overlay that is opened by the trigger.
   */
  type: MaybeAccessor<"dialog" | "menu" | "listbox" | "tree" | "grid">;
}

export interface OverlayTriggerAria {
  /**
   * Props for the trigger element.
   */
  triggerProps: AriaButtonProps;

  /**
   * Props for the overlay container element.
   */
  overlayProps: JSX.HTMLAttributes<any>;

  /**
   * State for the overlay trigger, as returned by `createOverlayTriggerState`.
   */
  state: OverlayTriggerState;
}

/**
 * Handles the behavior and accessibility for an overlay trigger, e.g. a button
 * that opens a popover, menu, or other overlay that is positioned relative to the trigger.
 */
export function createOverlayTrigger(
  props: AriaOverlayTriggerProps,
  state: OverlayTriggerState = createOverlayTriggerState(props)
): OverlayTriggerAria {
  const overlayId = createId();

  const triggerProps: AriaButtonProps = {
    // Aria 1.1 supports multiple values for aria-haspopup other than just menus.
    // https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
    // However, we only add it for menus for now because screen readers often
    // announce it as a menu even for other values.
    get "aria-haspopup"() {
      switch (access(props.type)) {
        case "menu":
          return true;
        case "listbox":
          return "listbox";
        default:
          return;
      }
    },
    get "aria-expanded"() {
      return state.isOpen();
    },
    get "aria-controls"() {
      return state.isOpen() ? overlayId : undefined;
    }
  };

  const overlayProps = {
    id: overlayId
  };

  return { triggerProps, overlayProps, state };
}
