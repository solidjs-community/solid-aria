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

import { createFocus } from "@solid-aria/interactions";
import { access, isObject, MaybeAccessor } from "@solid-primitives/utils";
import { Component, createSignal, JSX, mergeProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

type ElementType = keyof JSX.IntrinsicElements | Component<any>;

interface AriaVisuallyHiddenProps extends JSX.DOMAttributes<any> {
  /**
   * Whether the element should become visible on focus, for example skip links.
   */
  isFocusable?: MaybeAccessor<boolean | undefined>;

  /**
   * The element type for the container.
   * @default "div"
   */
  elementType?: ElementType;

  /**
   * Additional style to be passed to the element.
   */
  style?: MaybeAccessor<JSX.CSSProperties | string | undefined>;
}

interface VisuallyHiddenAria {
  /**
   * Props to spread onto the target element.
   */
  visuallyHiddenProps: JSX.HTMLAttributes<any>;
}

const visuallyHiddenStyles: JSX.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: 1,
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
  "white-space": "nowrap"
};

/**
 * Provides props for an element that hides its children visually
 * but keeps content visible to assistive technology.
 */
export function createVisuallyHidden(props: AriaVisuallyHiddenProps = {}): VisuallyHiddenAria {
  const [isFocused, setFocused] = createSignal(false);

  const { focusProps } = createFocus({
    isDisabled: () => !access(props.isFocusable),
    onFocusChange: setFocused
  });

  // If focused, don't hide the element.
  const combinedStyles = () => {
    const style = access(props.style);

    if (isFocused()) {
      return style;
    }

    if (isObject(style)) {
      return { ...visuallyHiddenStyles, ...style };
    }

    return visuallyHiddenStyles;
  };

  const visuallyHiddenProps = mergeProps(focusProps, {
    get style() {
      return combinedStyles();
    }
  } as JSX.HTMLAttributes<any>);

  return { visuallyHiddenProps };
}

export function VisuallyHidden(props: AriaVisuallyHiddenProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, elementType = "div", isFocusable, style, ...otherProps } = props;
  const { visuallyHiddenProps } = createVisuallyHidden(props);

  return (
    <Dynamic component={elementType} {...mergeProps(otherProps, visuallyHiddenProps)}>
      {children}
    </Dynamic>
  );
}
