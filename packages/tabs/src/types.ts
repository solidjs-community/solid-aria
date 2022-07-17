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

import { CollectionBase, Node } from "@solid-aria/collection";
import { AriaLabelingProps, DOMProps, Orientation, SingleSelection } from "@solid-aria/types";

export interface CreateTabListStateProps
  extends CollectionBase,
    Omit<SingleSelection, "disallowEmptySelection"> {}

export interface AriaTabListProps extends CreateTabListStateProps, DOMProps, AriaLabelingProps {
  /**
   * Whether tabs are activated automatically on focus or manually.
   * @default 'automatic'
   */
  keyboardActivation?: "automatic" | "manual";

  /**
   * The orientation of the tabs.
   * @default 'horizontal'
   */
  orientation?: Orientation;

  /**
   * Whether the Tabs are disabled.
   * Shows that a selection exists, but is not available in that circumstance.
   */
  isDisabled?: boolean;
}

export interface AriaTabProps {
  /**
   * The item used to render the tab.
   */
  item: Node;

  /**
   * Whether the tab should be disabled.
   */
  isDisabled?: boolean;
}

export interface AriaTabPanelProps extends DOMProps, AriaLabelingProps {}
