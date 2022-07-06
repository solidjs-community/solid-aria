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

import { AriaButtonProps, createButton } from "@solid-aria/button";
import { Node } from "@solid-aria/collection";
import { createSelectableItem } from "@solid-aria/selection";
import { createId } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, JSX, mergeProps } from "solid-js";

import { useAccordionContext } from "./createAccordion";

export interface AriaAccordionItemProps {
  item: Node;
}

export interface AccordionItemAria {
  /**
   * Props for the accordion item button.
   */
  buttonProps: JSX.ButtonHTMLAttributes<any>;

  /**
   * Props for the accordion item content element.
   */
  regionProps: JSX.HTMLAttributes<any>;

  /**
   * Whether the accordion item is expanded.
   */
  isExpanded: Accessor<boolean>;

  /**
   * Whether the accordion item is disabled.
   */
  isDisabled: Accessor<boolean>;
}

export function createAccordionItem(
  props: AriaAccordionItemProps,
  ref: Accessor<HTMLButtonElement | undefined>
): AccordionItemAria {
  const { state } = useAccordionContext();

  const buttonId = createId();
  const regionId = createId();

  const isExpanded = () => state.expandedKeys().has(props.item.key);
  const isDisabled = () => state.disabledKeys().has(props.item.key);

  const { itemProps } = createSelectableItem(
    {
      selectionManager: state.selectionManager,
      key: () => props.item.key
    },
    ref
  );

  const { buttonProps } = createButton(
    combineProps(
      itemProps as any,
      {
        id: buttonId,
        elementType: "button",
        get isDisabled() {
          return isDisabled();
        },
        onPress: () => state.toggleKey(props.item.key)
      } as Partial<AriaButtonProps>
    ),
    ref
  );

  return {
    buttonProps: mergeProps(buttonProps, {
      get "aria-expanded"() {
        return isExpanded();
      },
      get "aria-controls"() {
        return isExpanded() ? regionId : undefined;
      }
    }) as JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    regionProps: {
      id: regionId,
      role: "region",
      "aria-labelledby": buttonId
    },
    isExpanded,
    isDisabled
  };
}
