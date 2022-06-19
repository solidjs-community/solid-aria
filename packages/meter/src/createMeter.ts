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

import { AriaProgressBarProps, createProgressBar } from "@solid-aria/progress";
import { Accessor, JSX, mergeProps } from "solid-js";

export type AriaMeterProps = AriaProgressBarProps;

export interface MeterAria {
  /**
   * Props for the meter container element.
   */
  meterProps: JSX.HTMLAttributes<any>;

  /**
   * Props foJSX.r the meter's visual label (if any).
   */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * The value of the meter as a percentage (from 0 to 1).
   */
  percentage: Accessor<number>;
}

/**
 * Provides the accessibility implementation for a meter component.
 * Meters represent a quantity within a known range, or a fractional value.
 */
export function createMeter(props: AriaMeterProps = {}): MeterAria {
  const { progressBarProps, labelProps, percentage } = createProgressBar(props);

  const meterProps = mergeProps(progressBarProps, {
    // Use the meter role if available, but fall back to progressbar if not
    // Chrome currently falls back from meter automatically, and Firefox
    // does not support meter at all. Safari 13+ seems to support meter properly.
    // https://bugs.chromium.org/p/chromium/issues/detail?id=944542
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1460378
    role: "meter progressbar"
  } as unknown as JSX.HTMLAttributes<any>);

  return { meterProps, labelProps, percentage };
}
