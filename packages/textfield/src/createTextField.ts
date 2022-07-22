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
import { createField } from "@solid-aria/label";
import {
  AriaLabelingProps,
  AriaValidationProps,
  FocusableDOMProps,
  FocusableProps,
  HelpTextProps,
  InputBase,
  IntrinsicHTMLElements,
  LabelableProps,
  TextInputBase,
  TextInputDOMProps,
  Validation,
  ValueBase
} from "@solid-aria/types";
import { callHandler, filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

type DefaultElementType = "input";

/**
 * The intrinsic HTML element names that `createTextField` supports; e.g. `input`, `textarea`.
 */
type TextFieldIntrinsicElements = keyof Pick<IntrinsicHTMLElements, "input" | "textarea">;

/**
 * The HTML element interfaces that `createTextField` supports based on what is
 * defined for `TextFieldIntrinsicElements`; e.g. `HTMLInputElement`, `HTMLTextAreaElement`.
 */
type TextFieldHTMLElementType = Pick<IntrinsicHTMLElements, TextFieldIntrinsicElements>;

/**
 * The HTML attributes interfaces that `createTextField` supports based on what
 * is defined for `TextFieldIntrinsicElements`; e.g. `InputHTMLAttributes`, `TextareaHTMLAttributes`.
 */
type TextFieldHTMLAttributesType = Pick<JSX.IntrinsicElements, TextFieldIntrinsicElements>;

/**
 * The type of `inputProps` returned by `createTextField`; e.g. `InputHTMLAttributes`, `TextareaHTMLAttributes`.
 */
type TextFieldInputProps<T extends TextFieldIntrinsicElements> = TextFieldHTMLAttributesType[T];

export interface AriaTextFieldProps<T extends TextFieldIntrinsicElements>
  extends InputBase,
    Validation,
    HelpTextProps,
    FocusableProps,
    TextInputBase,
    ValueBase<string>,
    LabelableProps,
    AriaLabelingProps,
    FocusableDOMProps,
    TextInputDOMProps,
    AriaValidationProps {
  /**
   * Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
   * See https://www.w3.org/TR/wai-aria-1.2/#textbox.
   */
  "aria-activedescendant"?: string;

  /**
   * Indicates whether inputting text could trigger display of one or more predictions
   * of the user's intended value for an input
   * and specifies how predictions would be presented if they are made.
   */
  "aria-autocomplete"?: "none" | "inline" | "list" | "both";

  /**
   * Indicates the availability and type of interactive popup element,
   * such as menu or dialog, that can be triggered by an element.
   */
  "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";

  /**
   * The HTML element used to render the input, e.g. 'input', or 'textarea'.
   * It determines whether certain HTML attributes will be included in `inputProps`.
   * For example, [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type).
   * @default 'input'
   */
  inputElementType?: T;
}

export interface TextFieldAria<T extends TextFieldIntrinsicElements = DefaultElementType> {
  /**
   * Props for the input element.
   */
  inputProps: TextFieldInputProps<T>;

  /**
   * Props for the text field's visible label element, if any.
   */
  labelProps: JSX.LabelHTMLAttributes<HTMLLabelElement>;

  /**
   * Props for the text field's description element, if any.
   */
  descriptionProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the text field's error message element, if any.
   */
  errorMessageProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a text field.
 * @param props - Props for the text field.
 * @param ref - Ref to the HTML input or textarea element.
 */
export function createTextField<T extends TextFieldIntrinsicElements = DefaultElementType>(
  props: AriaTextFieldProps<T>,
  ref: Accessor<TextFieldHTMLElementType[T] | undefined>
): TextFieldAria<T> {
  const defaultProps: AriaTextFieldProps<TextFieldIntrinsicElements> = {
    type: "text",
    inputElementType: "input",
    isDisabled: false,
    isRequired: false,
    isReadOnly: false
  };

  // eslint-disable-next-line solid/reactivity
  props = mergeProps(defaultProps, props) as AriaTextFieldProps<T>;

  const { focusableProps } = createFocusable(props, ref);
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField(props);

  const domProps = filterDOMProps(props, { labelable: true });

  const baseInputProps: JSX.HTMLAttributes<any> = mergeProps(
    {
      get type() {
        return props.inputElementType === "input" ? props.type : undefined;
      },
      get pattern() {
        return props.inputElementType === "input" ? props.pattern : undefined;
      },
      get disabled() {
        return props.isDisabled;
      },
      get readOnly() {
        return props.isReadOnly;
      },
      get "aria-required"() {
        return props.isRequired || undefined;
      },
      get "aria-invalid"() {
        return props.validationState === "invalid" || undefined;
      },
      get "aria-errormessage"() {
        return props["aria-errormessage"];
      },
      get "aria-activedescendant"() {
        return props["aria-activedescendant"];
      },
      get "aria-autocomplete"() {
        return props["aria-autocomplete"];
      },
      get "aria-haspopup"() {
        return props["aria-haspopup"];
      },
      get value() {
        return props.value;
      },
      get defaultValue() {
        return props.value ? undefined : props.defaultValue;
      },
      get autocomplete() {
        return props.autocomplete;
      },
      get maxLength() {
        return props.maxLength;
      },
      get minLength() {
        return props.minLength;
      },
      get name() {
        return props.name;
      },
      get placeholder() {
        return props.placeholder;
      },
      get inputMode() {
        return props.inputMode;
      },

      // Change events
      onChange: e => props.onChange?.((e.target as HTMLInputElement).value),

      // Clipboard events
      onCopy: e => callHandler(props.onCopy, e),
      onCut: e => callHandler(props.onCut, e),
      onPaste: e => callHandler(props.onPaste, e),

      // Composition events
      onCompositionEnd: e => callHandler(props.onCompositionEnd, e),
      onCompositionStart: e => callHandler(props.onCompositionStart, e),
      onCompositionUpdate: e => callHandler(props.onCompositionUpdate, e),

      // Selection events
      onSelect: e => callHandler(props.onSelect, e),

      // Input events
      onBeforeInput: e => callHandler(props.onBeforeInput, e),
      onInput: e => callHandler(props.onInput, e)
    } as JSX.HTMLAttributes<any>,
    focusableProps,
    fieldProps
  );

  const inputProps = combineProps(domProps, baseInputProps);

  return {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps
  };
}
