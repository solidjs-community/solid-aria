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

import { createControllableSignal } from "@solid-aria/utils";
import { access } from "@solid-primitives/utils";
import { Accessor, untrack } from "solid-js";
import { PaginationProps, PaginationValue } from "./types";

export interface PaginationState {
  onChange: (val: PaginationValue | undefined) => void;
  onDecrement: () => void;
  onIncrement: () => void;
  value: Accessor<PaginationValue | undefined>;
}

export function createPaginationState(props: PaginationProps): PaginationState {
  const [value, setValue] = createControllableSignal({
    value: () => access(props.value),
    defaultValue: () => props.defaultValue,
    onChange: value => props.onChange?.(value)
  });

  const onIncrement = () => {
    const untrackedValue = untrack(value);
    const page = untrackedValue === "" ? 1 : parseInt(`${untrackedValue}`, 10) + 1;
    if (isValidPage(props.maxValue, page)) {
      setValue(page);
    }
  };

  const onDecrement = () => {
    const untrackedValue = untrack(value) as string | number | undefined;
    const page = untrackedValue === "" ? 1 : parseInt(`${untrackedValue}`, 10) - 1;
    if (isValidPage(props.maxValue, page)) {
      setValue(page);
    }
  };

  const onPageInputChange = (newValue: PaginationValue | undefined) => {
    let value: PaginationValue;
    if (newValue === "" || isValidPage(props.maxValue, newValue)) {
      value = newValue !== "" ? parseInt(`${newValue}`, 10) : newValue;
      setValue(value);
    }
  };

  return {
    value,
    onChange: onPageInputChange,
    onIncrement,
    onDecrement
  };
}

function isValidPage(
  totalPages: number | undefined,
  page: number | string | undefined
): page is number {
  page = parseInt(`${page}`, 10);
  totalPages = parseInt(`${totalPages}`);
  return !isNaN(page) && page >= 1 && !!totalPages && page <= totalPages;
}
