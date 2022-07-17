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

import { useLocale } from "@solid-aria/i18n";
import { createSelectableCollection } from "@solid-aria/selection";
import { Orientation } from "@solid-aria/types";
import { createId, mergeAriaLabels } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import {
  Accessor,
  createComponent,
  createContext,
  createMemo,
  FlowComponent,
  JSX,
  mergeProps,
  useContext
} from "solid-js";

import { createTabListState, TabListState } from "./createTabListState";
import { TabsKeyboardDelegate } from "./TabsKeyboardDelegate";
import { AriaTabListProps } from "./types";

export interface TabListAria {
  /**
   * Provide the tabList state to descendant elements.
   */
  TabListProvider: FlowComponent;

  /**
   * State for the tabList, as returned by `createTabListState`.
   */
  state: TabListState;

  /**
   * Props for the tabList container.
   */
  tabListProps: JSX.HTMLAttributes<any>;
}

const DEFAULT_ORIENTATION: Orientation = "horizontal";

/**
 * Provides the behavior and accessibility implementation for a tab list.
 * Tabs organize content into multiple sections and allow users to navigate between them.
 */
export function createTabList<T extends HTMLElement>(
  props: AriaTabListProps,
  ref: Accessor<T | undefined>
): TabListAria {
  const defaultTabsId = createId();

  const defaultProps: Partial<AriaTabListProps> = {
    id: defaultTabsId,
    orientation: DEFAULT_ORIENTATION,
    keyboardActivation: "automatic"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const state = createTabListState(props);

  const locale = useLocale();

  const delegate = createMemo(() => {
    return new TabsKeyboardDelegate(
      state.collection(),
      locale().direction,
      props.orientation ?? DEFAULT_ORIENTATION,
      state.disabledKeys()
    );
  });

  const { collectionProps } = createSelectableCollection(
    {
      keyboardDelegate: delegate,
      selectionManager: state.selectionManager,
      selectOnFocus: () => props.keyboardActivation === "automatic",
      disallowEmptySelection: true
    },
    ref
  );

  const { ariaLabelsProps } = mergeAriaLabels(props);

  const tabListProps = mergeProps(combineProps(collectionProps, ariaLabelsProps), {
    role: "tablist",
    tabIndex: undefined,
    get "aria-orientation"() {
      return props.orientation;
    }
  }) as JSX.HTMLAttributes<T>;

  const context: TabListContextValue = {
    state,
    tabsId: () => props.id ?? defaultTabsId
  };

  const TabListProvider: FlowComponent = props => {
    return createComponent(TabListContext.Provider, {
      value: context,
      get children() {
        return props.children;
      }
    });
  };

  return { TabListProvider, state, tabListProps };
}

interface TabListContextValue {
  state: TabListState;
  tabsId: Accessor<string>;
}

const TabListContext = createContext<TabListContextValue>();

export function useTabListContext() {
  const context = useContext(TabListContext);

  if (!context) {
    throw new Error("[solid-aria]: useTabListContext should be used in a TabListProvider.");
  }

  return context;
}
