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

import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { splitProps } from "solid-js";

/**
 * A set of common DOM props that are allowed on any component
 * Ensure this is synced with DOMProps in types/dom.
 */
const DOMPropNames: ReadonlySet<string> = new Set(["id"]);

/**
 * A set of common DOM props that are allowed on any component
 * Ensure this is synced with AriaLabelingProps in types/aria.
 */
const labelablePropNames: ReadonlySet<string> = new Set([
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-details"
]);

interface Options {
  /**
   * If labelling associated aria properties should be included in the filter.
   */
  labelable?: boolean;

  /**
   * A Set of other property names that should be included in the filter.
   */
  propNames?: Set<string>;
}

const dataAttrsRegex = /^(data-.*)$/;

// Note: "valid DOM props" refers to the `DOMPropNames` Set above, not "any valid DOM props".
/**
 * Filters out all props that aren't valid DOM props or defined via override prop obj.
 * @param props - The component props to be filtered.
 * @param opts - Props to override.
 */
export function filterDOMProps(
  props: Record<string, any> & DOMProps & AriaLabelingProps,
  opts: Options = {}
): DOMProps & AriaLabelingProps {
  const { labelable, propNames } = opts;
  const filteredPropNames: Array<string> = [];

  for (const prop in props) {
    if (
      Object.prototype.hasOwnProperty.call(props, prop) &&
      (DOMPropNames.has(prop) ||
        (labelable && labelablePropNames.has(prop)) ||
        propNames?.has(prop) ||
        dataAttrsRegex.test(prop))
    ) {
      filteredPropNames.push(prop);
    }
  }

  const [filteredProps] = splitProps(props, filteredPropNames as any);

  return filteredProps;
}
