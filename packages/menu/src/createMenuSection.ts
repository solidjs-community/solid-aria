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

import { createId } from "@solid-aria/utils";
import { createMemo, JSX } from "solid-js";

export interface AriaMenuSectionProps {
  /**
   * The heading for the section.
   */
  heading?: JSX.Element;

  /**
   * An accessibility label for the section. Required if `heading` is not present.
   */
  "aria-label"?: string;
}

interface MenuSectionAria {
  /**
   * Props for the wrapper list item.
   */
  itemProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the heading element, if any.
   */
  headingProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the group element.
   */
  groupProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a section in a menu.
 * See `useMenu` for more details about menus.
 * @param props - Props for the section.
 */
export function createMenuSection(props: AriaMenuSectionProps): MenuSectionAria {
  const headingId = createId();

  const heading = createMemo(() => props.heading);

  const itemProps: JSX.HTMLAttributes<any> = {
    role: "presentation"
  };

  // Techincally, listbox cannot contain headings according to ARIA.
  // We hide the heading from assistive technology, and only use it
  // as a label for the nested group.
  const headingProps: JSX.HTMLAttributes<any> = {
    get id() {
      return heading() ? headingId : undefined;
    },
    get "aria-hidden"() {
      return heading() ? true : undefined;
    }
  };

  const groupProps: JSX.HTMLAttributes<any> = {
    role: "group",
    get "aria-label"() {
      return props["aria-label"];
    },
    get "aria-labelledby"() {
      return heading() ? headingId : undefined;
    }
  };

  return { itemProps, headingProps, groupProps };
}
