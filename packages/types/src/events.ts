/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

export type HoverPointerType = "mouse" | "pen";

export type PointerType = HoverPointerType | "touch" | "keyboard" | "virtual";

export interface PressEvent {
  /**
   * The type of press event being fired.
   */
  type: "pressstart" | "pressend" | "pressup" | "press";

  /**
   * The pointer type that triggered the press event.
   */
  pointerType: PointerType;

  /**
   * The target element of the press event.
   */
  target: HTMLElement;

  /**
   * Whether the shift keyboard modifier was held during the press event.
   */
  shiftKey: boolean;

  /**
   * Whether the ctrl keyboard modifier was held during the press event.
   */
  ctrlKey: boolean;

  /**
   * Whether the meta keyboard modifier was held during the press event.
   */
  metaKey: boolean;

  /**
   * Whether the alt keyboard modifier was held during the press event.
   */
  altKey: boolean;
}

export interface LongPressEvent extends Omit<PressEvent, "type"> {
  /**
   * The type of long press event being fired.
   */
  type: "longpressstart" | "longpressend" | "longpress";
}

export interface HoverEvent {
  /**
   * The type of hover event being fired.
   */
  type: "hoverstart" | "hoverend";

  /**
   * The pointer type that triggered the hover event.
   */
  pointerType: HoverPointerType;

  /**
   * The target element of the hover event.
   */
  target: HTMLElement;
}

export interface PressEvents {
  /**
   * Handler that is called when the press is released over the target.
   */
  onPress?: (e: PressEvent) => void;

  /**
   * Handler that is called when a press interaction starts.
   */
  onPressStart?: (e: PressEvent) => void;

  /**
   * Handler that is called when a press interaction ends, either
   * over the target or when the pointer leaves the target.
   */
  onPressEnd?: (e: PressEvent) => void;

  /**
   * Handler that is called when the press state changes.
   */
  onPressChange?: (isPressed: boolean) => void;

  /**
   * Handler that is called when a press is released over the target, regardless of
   * whether it started on the target or not.
   */
  onPressUp?: (e: PressEvent) => void;
}

export interface HoverEvents {
  /**
   * Handler that is called when a hover interaction starts.
   */
  onHoverStart?: (e: HoverEvent) => void;

  /**
   * Handler that is called when a hover interaction ends.
   */
  onHoverEnd?: (e: HoverEvent) => void;

  /**
   * Handler that is called when the hover state changes.
   */
  onHoverChange?: (isHovering: boolean) => void;
}

export interface FocusEvents {
  /**
   * Handler that is called when the element receives focus.
   */
  onFocus?: (e: FocusEvent) => void;

  /**
   * Handler that is called when the element loses focus.
   */
  onBlur?: (e: FocusEvent) => void;

  /**
   * Handler that is called when the element's focus status changes.
   */
  onFocusChange?: (isFocused: boolean) => void;
}

export interface FocusWithinEvents {
  /**
   * Handler that is called when the element or a descendant receives focus.
   */
  onFocusIn?: (e: FocusEvent) => void;

  /**
   * Handler that is called when the element and all descendants lose focus.
   */
  onFocusOut?: (e: FocusEvent) => void;

  /**
   * Handler that is called when the the focus within state changes.
   */
  onFocusWithinChange?: (isFocusWithin: boolean) => void;
}

export interface KeyboardEvents {
  /**
   * Handler that is called when a key is pressed.
   */
  onKeyDown?: (e: KeyboardEvent) => void;

  /**
   * Handler that is called when a key is released.
   */
  onKeyUp?: (e: KeyboardEvent) => void;
}
