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

import { AriaLinkProps, createLink } from "@solid-aria/link";
import { DOMProps } from "@solid-aria/types";
import { Accessor, JSX, mergeProps, splitProps } from "solid-js";

export interface AriaBreadcrumbItemProps extends AriaLinkProps, DOMProps {
  /**
   * The type of current location the breadcrumb item represents, if `isCurrent` is true.
   * @default 'page'
   */
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | boolean | "true" | "false";

  /**
   * Whether the breadcrumb item represents the current page.
   */
  isCurrent?: boolean;

  /**
   * Whether the breadcrumb item is disabled.
   */
  isDisabled?: boolean;

  /**
   * The HTML element used to render the breadcrumb link, e.g. 'a', or 'span'.
   * @default 'a'
   */
  elementType?: string;

  /**
   * The contents of the breadcrumb item.
   */
  children?: JSX.Element;
}

interface BreadcrumbItemAria<T extends HTMLElement> {
  /**
   * Props for the breadcrumb item link element.
   */
  itemProps: JSX.HTMLAttributes<T>;
}

/**
 * Provides the behavior and accessibility implementation for an in a breadcrumbs component.
 * See `useBreadcrumbs` for details about breadcrumbs.
 */
export function createBreadcrumbItem<T extends HTMLElement = HTMLAnchorElement>(
  props: AriaBreadcrumbItemProps,
  ref: Accessor<T | undefined>
): BreadcrumbItemAria<T> {
  const defaultProps: AriaBreadcrumbItemProps = {
    elementType: "a"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const [local, others] = splitProps(props, [
    "aria-current",
    "isCurrent",
    "isDisabled",
    "elementType"
  ]);

  const createLinkProps = mergeProps(others, {
    get isDisabled() {
      return local.isDisabled || local.isCurrent;
    },
    get elementType() {
      return local.elementType;
    }
  });

  const { linkProps } = createLink(createLinkProps, ref);

  // This is not reactive but `elementType` is not a dynamic value that should change at runtime.
  const isHeading = /^h[1-6]$/.test(local.elementType ?? "");

  const itemProps: JSX.HTMLAttributes<T> = {
    ...(!isHeading ? linkProps : {}),
    get "aria-disabled"() {
      return local.isDisabled;
    },
    get "aria-current"() {
      return local.isCurrent ? local["aria-current"] || "page" : undefined;
    },
    get tabIndex() {
      if (local.isCurrent) {
        // isCurrent sets isDisabled === true for the current item,
        // so we have to restore the tabIndex in order to support autoFocus.
        return props.autoFocus ? -1 : undefined;
      }

      return !isHeading ? linkProps.tabIndex : undefined;
    }
  };

  return { itemProps };
}
