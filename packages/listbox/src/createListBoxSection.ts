/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { DOMElements } from "@solid-aria/types";
import { createId } from "@solid-aria/utils";
import { Accessor, createMemo, JSX } from "solid-js";

export interface AriaListBoxSectionProps {
  /**
   * An accessibility label for the section.
   * Required if `heading` is not present.
   */
  "aria-label"?: string;

  /**
   * The heading for the section.
   */
  heading?: JSX.Element;

  /**
   * The rendered contents of the section.
   */
  children?: JSX.Element;
}

export interface ListBoxSectionAria<
  ItemElementType extends DOMElements,
  HeadingElementType extends DOMElements,
  GroupElementType extends DOMElements
> {
  /**
   * Props for the wrapper list item.
   */
  itemProps: Accessor<JSX.IntrinsicElements[ItemElementType]>;

  /**
   * Props for the heading element, if any.
   */
  headingProps: Accessor<JSX.IntrinsicElements[HeadingElementType]>;

  /**
   * Props for the group element.
   */
  groupProps: Accessor<JSX.IntrinsicElements[GroupElementType]>;
}

/**
 * Provides the behavior and accessibility implementation for a section in a listbox.
 * See `createListBox` for more details about listboxes.
 * @param props - Props for the section.
 */
export function createListBoxSection<
  ItemElementType extends DOMElements = "li",
  HeadingElementType extends DOMElements = "span",
  GroupElementType extends DOMElements = "ul"
>(
  props: AriaListBoxSectionProps
): ListBoxSectionAria<ItemElementType, HeadingElementType, GroupElementType> {
  const headingId = createId();

  const itemProps = createMemo(() => {
    return {
      role: "presentation"
    } as JSX.IntrinsicElements[ItemElementType];
  });

  const headingProps: Accessor<JSX.IntrinsicElements[HeadingElementType]> = createMemo(() => {
    if (!props.heading) {
      return {};
    }

    return {
      // Techincally, listbox cannot contain headings according to ARIA.
      // We hide the heading from assistive technology, and only use it
      // as a label for the nested group.
      id: headingId,
      "aria-hidden": true
    };
  });

  const groupProps = createMemo(() => {
    return {
      role: "group",
      "aria-label": props["aria-label"],
      "aria-labelledby": props.heading ? headingId : undefined
    } as JSX.IntrinsicElements[GroupElementType];
  });

  return { itemProps, headingProps, groupProps };
}
