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

import { createHover } from "@solid-aria/interactions/src";
import { filterDOMProps } from "@solid-aria/utils/src";
import { Accessor, JSX, mergeProps } from "solid-js";

import { CreateTooltipTriggerState } from "./createTooltipTriggerState";
import { AriaTooltipProps } from "./types";

export interface TooltipAria {
  /**
   * Props for the tooltip element.
   */
  tooltipProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the accessibility implementation for a Tooltip component.
 */
export function createTooltip(
  props: AriaTooltipProps,
  ref: Accessor<any>,
  state?: CreateTooltipTriggerState
): TooltipAria {
  const domProps = filterDOMProps(props, { labelable: true });
  const { hoverProps } = createHover({
    onHoverStart: () => state?.open(true),
    onHoverEnd: () => state?.close()
  });

  const tooltipProps: JSX.HTMLAttributes<any> = mergeProps(domProps, hoverProps, {
    role: "tooltip" as TooltipAria["tooltipProps"]["role"] // Typescript throws an error because role is a string
  });

  return { tooltipProps };
}
