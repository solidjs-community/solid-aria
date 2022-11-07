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

import { createOverlayTriggerState } from "@solid-aria/overlays/src";
import { Accessor, createEffect } from "solid-js";
import { clearTimeout } from "timers";

import { TooltipTriggerProps } from "./types";

const TOOLTIP_DELAY = 1500; // this seems to be a 1.5 second delay, check with design
const TOOLTIP_COOLDOWN = 500;

export interface CreateTooltipTriggerState {
  /** Whether the tooltip is currently showing. */
  isOpen: Accessor<boolean>;
  /**
   * Shows the tooltip. By default, the tooltip becomes visible after a delay
   * depending on a global warmup timer. The `immediate` option shows the
   * tooltip immediately instead.
   */
  open(immediate?: boolean): void;
  /** Hides the tooltip. */
  close(immediate?: boolean): void;
}

type Timeout = ReturnType<typeof setTimeout>;

const tooltips: Record<string, any> = {};
let tooltipId = 0;
let globalWarmedUp = false;
let globalWarmUpTimeout: Timeout | null = null;
let globalCooldownTimeout: Timeout | null = null;

/**
 * Manages state for a tooltip trigger. Tracks whether the tooltip is open, and provides
 * methods to toggle this state. Ensures only one tooltip is open at a time and controls
 * the delay for showing a tooltip.
 */
export function createTooltipTriggerState(
  props: TooltipTriggerProps = {}
): CreateTooltipTriggerState {
  const { delay = TOOLTIP_DELAY } = props;
  const { isOpen, open, close } = createOverlayTriggerState(props);
  const id = () => `${++tooltipId}`;
  let closeTimeout: Timeout | null;

  const hideTooltip = (immediate?: boolean) => {
    if (immediate) {
      clearTimeout(closeTimeout as Timeout);
      closeTimeout = null;
      close();
    } else if (!closeTimeout) {
      closeTimeout = setTimeout(() => {
        closeTimeout = null;
        close();
      }, TOOLTIP_COOLDOWN);
    }

    if (globalWarmUpTimeout) {
      clearTimeout(globalWarmUpTimeout);
      globalWarmUpTimeout = null;
    }
    if (globalWarmedUp) {
      if (globalCooldownTimeout) {
        clearTimeout(globalCooldownTimeout);
      }
      globalCooldownTimeout = setTimeout(() => {
        delete tooltips[id()];
        globalCooldownTimeout = null;
        globalWarmedUp = false;
      }, TOOLTIP_COOLDOWN);
    }
  };

  const ensureTooltipEntry = () => {
    tooltips[id()] = hideTooltip;
  };

  const closeOpenTooltips = () => {
    for (const hideTooltipId in tooltips) {
      if (hideTooltipId !== id()) {
        tooltips[hideTooltipId](true);
        delete tooltips[hideTooltipId];
      }
    }
  };

  const showTooltip = () => {
    clearTimeout(closeTimeout as Timeout);
    closeTimeout = null;
    closeOpenTooltips();
    ensureTooltipEntry();
    globalWarmedUp = true;
    open();
    if (globalWarmUpTimeout) {
      clearTimeout(globalWarmUpTimeout);
      globalWarmUpTimeout = null;
    }
    if (globalCooldownTimeout) {
      clearTimeout(globalCooldownTimeout);
      globalCooldownTimeout = null;
    }
  };

  const warmupTooltip = () => {
    closeOpenTooltips();
    ensureTooltipEntry();
    if (!isOpen() && !globalWarmUpTimeout && !globalWarmedUp) {
      globalWarmUpTimeout = setTimeout(() => {
        globalWarmUpTimeout = null;
        globalWarmedUp = true;
        showTooltip();
      }, delay);
    } else if (!isOpen()) {
      showTooltip();
    }
  };

  createEffect(() => {
    return () => {
      clearTimeout(closeTimeout as Timeout);
      const tooltip = tooltips[id()];
      if (tooltip) {
        delete tooltips[id()];
      }
    };
  });

  return {
    isOpen,
    open: immediate => {
      if (!immediate && delay > 0 && !closeTimeout) {
        warmupTooltip();
      } else {
        showTooltip();
      }
    },
    close: hideTooltip
  };
}
