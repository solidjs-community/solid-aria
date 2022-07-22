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

import { AriaLabelingProps, DOMProps, Orientation } from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { createMemo, JSX, mergeProps } from "solid-js";

export interface AriaSeparatorProps extends DOMProps, AriaLabelingProps {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: Orientation;

  /**
   * The HTML element type that will be used to render the separator.
   */
  elementType?: string;
}

export interface SeparatorAria {
  /**
   * Props for the separator element.
   */
  separatorProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the accessibility implementation for a separator.
 * A separator is a visual divider between two groups of content,
 * e.g. groups of menu items or sections of a page.
 */
export function createSeparator(props: AriaSeparatorProps = {}): SeparatorAria {
  const domProps = filterDOMProps(props, { labelable: true });

  // eslint-disable-next-line solid/reactivity
  const separatorProps = mergeProps(domProps, {
    get role() {
      // hr elements implicitly have role = separator
      return props.elementType === "hr" ? undefined : "separator";
    },
    get "aria-orientation"() {
      // if orientation is horizontal, aria-orientation default is horizontal, so we leave it undefined
      // if it's vertical, we need to specify it
      return props.orientation === "horizontal" ? undefined : props.orientation;
    }
  } as JSX.HTMLAttributes<any>);

  return { separatorProps };
}
