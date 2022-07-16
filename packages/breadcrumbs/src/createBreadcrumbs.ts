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

import { createMessageFormatter } from "@solid-aria/i18n";
import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { createMemo, JSX, mergeProps, splitProps } from "solid-js";

import { intlMessages } from "./intl";

export interface AriaBreadcrumbsProps extends DOMProps, AriaLabelingProps {
  /**
   * Whether the Breadcrumbs are disabled.
   */
  isDisabled?: boolean;

  /**
   * The breadcrumb items.
   */
  children?: JSX.Element;
}

interface BreadcrumbsAria {
  /**
   * Props for the breadcrumbs navigation element.
   */
  navProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a breadcrumbs component.
 * Breadcrumbs display a hierarchy of links to the current page or resource in an application.
 */
export function createBreadcrumbs(props: AriaBreadcrumbsProps): BreadcrumbsAria {
  const [local, others] = splitProps(props, ["aria-label"]);

  const formatMessage = createMessageFormatter(intlMessages);

  const domProps = createMemo(() => filterDOMProps(others, { labelable: true }));

  const navProps = mergeProps(domProps, {
    get "aria-label"() {
      return local["aria-label"] || formatMessage("breadcrumbs");
    }
  } as JSX.HTMLAttributes<any>);

  return { navProps };
}
