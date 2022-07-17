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

import { getFocusableTreeWalker } from "@solid-aria/focus";
import { mergeAriaLabels } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createEffect, createMemo, createSignal, JSX, mergeProps, on } from "solid-js";

import { useTabListContext } from "./createTabList";
import { AriaTabPanelProps } from "./types";
import { generateTabIds } from "./utils";

export interface TabPanelAria {
  /**
   * Props for the tab panel element.
   */
  tabPanelProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a tab panel. A tab panel is a container for
 * the contents of a tab, and is shown when the tab is selected.
 */
export function createTabPanel<T extends HTMLElement>(
  props: AriaTabPanelProps,
  ref: Accessor<T | undefined>
): TabPanelAria {
  const { state, tabsId } = useTabListContext();

  const [tabIndex, setTabIndex] = createSignal<number | undefined>(0);

  // The tabpanel should have tabIndex=0 when there are no tabbable elements within it.
  // Otherwise, tabbing from the focused tab should go directly to the first tabbable element
  // within the tabpanel.
  createEffect(
    on(ref, refEl => {
      if (refEl) {
        const update = () => {
          // Detect if there are any tabbable elements and update the tabIndex accordingly.
          const walker = getFocusableTreeWalker(refEl, { tabbable: true });
          setTabIndex(walker.nextNode() ? undefined : 0);
        };

        update();

        // Update when new elements are inserted, or the tabIndex/disabled attribute updates.
        const observer = new MutationObserver(update);
        observer.observe(refEl, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ["tabIndex", "disabled"]
        });

        return () => {
          observer.disconnect();
        };
      }
    })
  );

  const ids = createMemo(() => {
    const selectedKey = state.selectedKey();

    if (selectedKey == null) {
      return;
    }

    return generateTabIds(tabsId(), selectedKey);
  });

  const { ariaLabelsProps } = mergeAriaLabels(
    mergeProps(props, {
      get id() {
        return ids()?.tabPanelId;
      },
      get "aria-labelledby"() {
        return ids()?.tabId;
      }
    })
  );

  const tabPanelProps = combineProps(ariaLabelsProps, {
    role: "tabpanel",
    get tabIndex() {
      return tabIndex();
    },
    get "aria-describedby"() {
      return props["aria-describedby"];
    },
    get "aria-details"() {
      return props["aria-details"];
    }
  }) as JSX.HTMLAttributes<T>;

  return { tabPanelProps };
}
