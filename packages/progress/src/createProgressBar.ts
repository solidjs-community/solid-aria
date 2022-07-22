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

import { createNumberFormatter } from "@solid-aria/i18n";
import { AriaLabelProps, createLabel } from "@solid-aria/label";
import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { clamp, filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

export interface AriaProgressCircleProps extends DOMProps, AriaLabelingProps {
  /**
   * The current value (controlled).
   * @default 0
   */
  value?: number;

  /**
   * The smallest value allowed for the input.
   * @default 0
   */
  minValue?: number;

  /**
   * The largest value allowed for the input.
   * @default 100
   */
  maxValue?: number;

  /**
   * Whether presentation is indeterminate when progress isn't known.
   */
  isIndeterminate?: boolean;
}

export interface AriaProgressBarProps extends AriaProgressCircleProps {
  /**
   * The content to display as the label.
   */
  label?: JSX.Element;

  /**
   * The display format of the value label.
   * @default {style: 'percent'}
   */
  formatOptions?: Intl.NumberFormatOptions;

  /**
   * The content to display as the value's label (e.g. 1 of 4).
   */
  valueLabel?: JSX.Element;
}

interface ProgressBarAria {
  /**
   * Props for the progress bar container element.
   */
  progressBarProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the progress bar's visual label element (if any).
   */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * The value of the progress bar as a percentage (from 0 to 1).
   */
  percentage: Accessor<number>;
}

const DEFAULT_VALUE = 0;
const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 100;

/**
 * Provides the accessibility implementation for a progress bar component.
 * Progress bars show either determinate or indeterminate progress of an operation
 * over time.
 */
export function createProgressBar(props: AriaProgressBarProps = {}): ProgressBarAria {
  const defaultProps: AriaProgressBarProps = {
    value: DEFAULT_VALUE,
    minValue: DEFAULT_MIN_VALUE,
    maxValue: DEFAULT_MAX_VALUE,
    formatOptions: {
      style: "percent"
    }
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const domProps = filterDOMProps(props, { labelable: true });

  const createLabelProps = mergeProps(props, {
    // select is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  } as Partial<AriaLabelProps>);

  const { labelProps, fieldProps } = createLabel(createLabelProps);

  const minValue = () => props.minValue ?? DEFAULT_MIN_VALUE;
  const maxValue = () => props.maxValue ?? DEFAULT_MAX_VALUE;
  const value = () => clamp(props.value ?? DEFAULT_VALUE, minValue(), maxValue());

  const percentage = createMemo(() => (value() - minValue()) / (maxValue() - minValue()));

  const formatter = createNumberFormatter(() => props.formatOptions ?? {});

  const valueLabel = () => {
    if (props.isIndeterminate || props.valueLabel) {
      return props.valueLabel;
    }

    const valueToFormat = props.formatOptions?.style === "percent" ? percentage() : value();
    return formatter().format(valueToFormat);
  };

  const baseProgressBarProps = mergeProps(fieldProps, {
    role: "progressbar",
    get "aria-valuenow"() {
      return props.isIndeterminate ? undefined : value();
    },
    get "aria-valuemin"() {
      return minValue();
    },
    get "aria-valuemax"() {
      return maxValue();
    },
    get "aria-valuetext"() {
      return props.isIndeterminate ? undefined : (valueLabel() as string);
    }
  } as JSX.HTMLAttributes<any>);

  const progressBarProps = combineProps(domProps, baseProgressBarProps);

  return { progressBarProps, labelProps, percentage };
}
