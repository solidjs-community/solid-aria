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

import { createControllableSignal, CreateControllableSignalProps } from "@solid-aria/utils";
import { Accessor } from "solid-js";

import { Selection } from "./Selection";

/**
 * Creates a simple reactive `Selection` state with a getter, setter and a fallback value of an empty selection,
 * that can be controlled with `value` and `onChange` props.
 */
export function createControllableSelectionSignal(
  props: CreateControllableSignalProps<"all" | Selection>
) {
  const [_value, setValue] = createControllableSignal(props);

  const value: Accessor<"all" | Selection> = () => _value() ?? new Selection();

  return [value, setValue] as const;
}
