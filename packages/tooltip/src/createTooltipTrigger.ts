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

import { createFocusable } from "@solid-aria/focus/src";
import {
  createHover,
  CreateHoverProps,
  createInteractionModality,
  createPress,
  CreatePressProps,
  isKeyboardFocusVisible
} from "@solid-aria/interactions/src";
import { FocusEvents } from "@solid-aria/types/src";
import { createId } from "@solid-aria/utils/src";
import { Accessor, createEffect, JSX, mergeProps } from "solid-js";

import { CreateTooltipTriggerState } from "./createTooltipTriggerState";
import { TooltipTriggerProps } from "./types";

export interface TooltipTriggerAria {
  /**
   * Props for the trigger element.
   */
  triggerProps: JSX.HTMLAttributes<any> & CreatePressProps & CreateHoverProps & FocusEvents;

  /**
   * Props for the overlay container element.
   */
  tooltipProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the accessibility implementation for a Tooltip component.
 * @param props - Props to be applied to the tooltip.
 * @param ref - A ref to a DOM element for the tooltip.
 * @param state
 */
export function createTooltipTrigger(
  props: TooltipTriggerProps,
  ref: Accessor<any>,
  state: CreateTooltipTriggerState
): TooltipTriggerAria {
  const modality = createInteractionModality();
  const tooltipId = createId();
  let isHovered = false;
  let isFocused = false;

  const handleShow = () => {
    if (isHovered || isFocused) {
      state.open(isFocused);
    }
  };

  const handleHide = (immediate?: boolean) => {
    if (!isHovered && !isFocused) {
      state.close(immediate);
    }
  };

  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Escape after clicking something can give it keyboard focus
      // dismiss tooltip on esc key press
      if (e.key === "Escape") {
        state.close(true);
      }
    };

    if (state.isOpen()) {
      document.addEventListener("keydown", onKeyDown, true);
      return () => {
        document.removeEventListener("keydown", onKeyDown, true);
      };
    }
  });

  const onHoverStart = () => {
    if (props.trigger === "focus") {
      return;
    }
    // In chrome, if you hover a trigger, then another element obscures it, due to keyboard
    // interactions for example, hover will end. When hover is restored after that element disappears,
    // focus moves on for example, then the tooltip will reopen. We check the modality to know if the hover
    // is the result of moving the mouse.
    isHovered = modality() === "pointer";
    handleShow();
  };
  const onHoverEnd = () => {
    if (props.trigger === "focus") {
      return;
    }
    // no matter how the trigger is left, we should close the tooltip
    isFocused = false;
    isHovered = false;
    handleHide();
  };

  const onPressStart = () => {
    // no matter how the trigger is pressed, we should close the tooltip
    isFocused = false;
    isHovered = false;
    handleHide(true);
  };

  // TODO
  // The type onFocus requires an event of type FocusEvent to be passed but in
  // react-aria they are not passing it.

  const onFocus = (e: FocusEvent) => {
    const isVisible = isKeyboardFocusVisible();
    if (isVisible) {
      isFocused = true;
      handleShow();
    }
  };

  const onBlur = () => {
    isFocused = false;
    isHovered = false;
    handleHide(true);
  };

  const { hoverProps } = createHover({
    isDisabled: props.isDisabled,
    onHoverStart,
    onHoverEnd
  });

  const { pressProps } = createPress({ onPressStart });

  const { focusableProps } = createFocusable(
    {
      isDisabled: props.isDisabled,
      onFocus,
      onBlur
    },
    ref
  );

  const mergedProps = mergeProps(focusableProps, hoverProps, pressProps);

  return {
    triggerProps: {
      "aria-describedby": state.isOpen() ? tooltipId : undefined,
      ...mergedProps
    },
    tooltipProps: {
      id: tooltipId
    }
  };
}
