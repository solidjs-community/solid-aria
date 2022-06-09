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

import { createFocusable } from "@solid-aria/focus";
import { createPress } from "@solid-aria/interactions";
import { AriaLabelingProps, FocusableProps, PressEvents } from "@solid-aria/types";
import { filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX, mergeProps, splitProps } from "solid-js";

export interface AriaLinkProps extends AriaLabelingProps, PressEvents, FocusableProps {
  /**
   *  Whether the link is disabled.
   */
  isDisabled?: boolean;

  /**
   * The HTML element used to render the link, e.g. 'a', or 'span'.
   * @default 'a'
   */
  elementType?: string;

  /**
   * Handler that is called when the click is released over the target.
   */
  onClick?: (e: MouseEvent) => void;
}

export interface LinkAria<T extends HTMLElement> {
  /**
   * Props for the link element.
   */
  linkProps: Accessor<JSX.HTMLAttributes<T>>;

  /**
   * Whether the link is currently pressed.
   */
  isPressed: Accessor<boolean>;
}

/**
 * Provides the behavior and accessibility implementation for a link component.
 * A link allows a user to navigate to another page or resource within a web page
 * or application.
 */
export function createLink<T extends HTMLElement = HTMLAnchorElement>(
  props: AriaLinkProps,
  ref: Accessor<T | undefined>
): LinkAria<T> {
  const defaultProps: AriaLinkProps = {
    elementType: "a"
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props);

  const [local, createPressProps, others] = splitProps(
    props,
    ["elementType", "onClick", "isDisabled"],
    ["onPress", "onPressStart", "onPressEnd", "isDisabled"]
  );

  const { focusableProps } = createFocusable(props, ref);

  const { pressProps, isPressed } = createPress(createPressProps, ref);

  const domProps = filterDOMProps(others, { labelable: true });

  const onClick = (e: MouseEvent) => {
    if (!props.onClick) {
      return;
    }

    props.onClick(e);
    console.warn("onClick is deprecated, please use onPress");
  };

  const linkProps = createMemo(() => {
    let baseProps = {};

    if (local.elementType !== "a") {
      baseProps = {
        role: "link",
        tabIndex: !local.isDisabled ? 0 : undefined
      };
    }

    return combineProps(domProps, focusableProps, pressProps, {
      ...baseProps,
      "aria-disabled": local.isDisabled || undefined,
      onClick
    }) as JSX.HTMLAttributes<T>;
  });

  return { linkProps, isPressed };
}
