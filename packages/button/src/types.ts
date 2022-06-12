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

import { CreateToggleStateProps } from "@solid-aria/toggle";
import {
  AriaLabelingProps,
  ElementType,
  FocusableDOMProps,
  FocusableProps,
  PressEvents
} from "@solid-aria/types";
import { JSX } from "solid-js";

interface ButtonProps extends PressEvents, FocusableProps {
  /**
   * Whether the button is disabled.
   */
  isDisabled?: boolean;

  /**
   * The content to display in the button.
   */
  children?: JSX.Element;
}

export interface AriaButtonElementTypeProps<T extends ElementType = "button"> {
  /**
   * The HTML element or SolidJS component used to render the button, e.g. 'div', 'a', or `Link`.
   * @default 'button'
   */
  elementType?: T;
}

export interface LinkButtonProps<T extends ElementType = "button">
  extends AriaButtonElementTypeProps<T> {
  /**
   * A URL to link to if elementType="a".
   */
  href?: string;

  /**
   * The target window for the link.
   */
  target?: string;

  /**
   * The relationship between the linked resource and the current page.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel).
   */
  rel?: string;
}

interface AriaBaseButtonProps extends FocusableDOMProps, AriaLabelingProps {
  /**
   * Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
   */
  "aria-expanded"?: boolean;

  /**
   * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
   */
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";

  /**
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   */
  "aria-controls"?: string;

  /**
   * Indicates the current "pressed" state of toggle buttons. */
  "aria-pressed"?: boolean;

  /**
   * The behavior of the button when used in an HTML form.
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";

  /**
   * Whether the button should not receive focus on press.
   */
  preventFocusOnPress?: boolean;

  /**
   * Whether the button can receive focus when disabled.
   */
  allowFocusWhenDisabled?: boolean;

  /**
   * Handler that is called when the click is released over the target.
   */
  onClick?: (e: MouseEvent) => void;
}

export interface AriaButtonProps<T extends ElementType = "button">
  extends ButtonProps,
    LinkButtonProps<T>,
    AriaBaseButtonProps {}

export interface AriaToggleButtonProps<T extends ElementType = "button">
  extends CreateToggleStateProps,
    ButtonProps,
    AriaBaseButtonProps,
    AriaButtonElementTypeProps<T> {}
