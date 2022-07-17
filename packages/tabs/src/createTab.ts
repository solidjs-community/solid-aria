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

import { createSelectableItem } from "@solid-aria/selection";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { useTabListContext } from "./createTabList";
import { AriaTabProps } from "./types";
import { generateTabIds } from "./utils";

export interface TabAria {
  /**
   * Props for the tab element.
   */
  tabProps: JSX.HTMLAttributes<any>;

  /**
   * Whether the tab is currently selected.
   */
  isSelected: Accessor<boolean>;

  /**
   * Whether the tab is disabled.
   */
  isDisabled: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for a tab.
 * When selected, the associated tab panel is shown.
 */
export function createTab<T extends HTMLElement>(
  props: AriaTabProps,
  ref: Accessor<T | undefined>
): TabAria {
  const { state, tabsId } = useTabListContext();

  const isSelected = () => props.item.key === state.selectedKey();
  const isDisabled = () => props.isDisabled || state.disabledKeys().has(props.item.key);

  const { itemProps } = createSelectableItem(
    {
      selectionManager: state.selectionManager,
      key: () => props.item.key,
      isDisabled
    },
    ref
  );

  const ids = createMemo(() => generateTabIds(tabsId(), props.item.key));

  const tabProps = mergeProps(itemProps, {
    role: "tab",
    get id() {
      return ids().tabId;
    },
    get "aria-selected"() {
      return isSelected();
    },
    get "aria-disabled"() {
      return isDisabled() || undefined;
    },
    get "aria-controls"() {
      return isSelected() ? ids().tabPanelId : undefined;
    },
    get tabIndex() {
      return isDisabled() ? undefined : itemProps.tabIndex;
    }
  } as JSX.HTMLAttributes<T>);

  return { tabProps, isSelected, isDisabled };
}
