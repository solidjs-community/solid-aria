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

import { AriaButtonProps } from "@solid-aria/button";
import { createCollator } from "@solid-aria/i18n";
import { setInteractionModality } from "@solid-aria/interactions";
import { AriaFieldProps, createField } from "@solid-aria/label";
import { AriaListBoxProps } from "@solid-aria/listbox";
import { createMenuTrigger } from "@solid-aria/menu";
import { createTypeSelect, ListKeyboardDelegate } from "@solid-aria/selection";
import {
  AriaLabelingProps,
  AsyncLoadable,
  DOMProps,
  FocusableDOMProps,
  FocusableProps,
  HelpTextProps,
  InputBase,
  KeyboardDelegate,
  KeyboardEvents,
  LabelableProps,
  TextInputBase,
  Validation
} from "@solid-aria/types";
import { createId, filterDOMProps } from "@solid-aria/utils";
import { combineProps } from "@solid-primitives/props";
import { chain } from "@solid-primitives/utils";
import { Accessor, createMemo, JSX, mergeProps } from "solid-js";

import { createSelectState, CreateSelectStateProps, SelectState } from "./createSelectState";

export interface AriaSelectProps
  extends CreateSelectStateProps,
    AsyncLoadable,
    Omit<InputBase, "isReadOnly">,
    Validation,
    HelpTextProps,
    LabelableProps,
    TextInputBase,
    FocusableProps,
    DOMProps,
    AriaLabelingProps,
    FocusableDOMProps {
  /**
   * An optional keyboard delegate implementation for type to select,
   * to override the default.
   */
  keyboardDelegate?: KeyboardDelegate;

  /**
   * Describes the type of autocomplete functionality the input should provide if any.
   * See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autocomplete?: string;

  /**
   * The name of the input, used when submitting an HTML form.
   */
  name?: string;
}

interface SelectAria {
  /**
   * State for the select, as returned by `createSelectState`.
   */
  state: SelectState;

  /**
   * Props for the label element.
   */
  labelProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the popup trigger element.
   */
  triggerProps: AriaButtonProps;

  /**
   * Props for the element representing the selected value.
   */
  valueProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the popup.
   */
  menuProps: AriaListBoxProps;

  /**
   * Props for the select's description element, if any.
   */
  descriptionProps: JSX.HTMLAttributes<any>;

  /**
   * Props for the select's error message element, if any.
   */
  errorMessageProps: JSX.HTMLAttributes<any>;
}

/**
 * Provides the behavior and accessibility implementation for a select component.
 * A select displays a collapsible list of options and allows a user to select one of them.
 * @param props - Props for the select.
 * @param ref - The ref for the select trigger element.
 */
export function createSelect<T extends HTMLElement>(
  props: AriaSelectProps,
  ref: Accessor<T | undefined>
): SelectAria {
  const state = createSelectState(props);

  const collator = createCollator({ usage: "search", sensitivity: "base" });

  // By default, a KeyboardDelegate is provided which uses the DOM to query layout information (e.g. for page up/page down).
  // When virtualized, the layout object will be passed in as a prop and override this.
  const delegate = createMemo(() => {
    if (props.keyboardDelegate) {
      return props.keyboardDelegate;
    }

    return new ListKeyboardDelegate(
      state.collection(),
      state.disabledKeys(),
      undefined,
      collator()
    );
  });

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft": {
        // prevent scrolling containers
        e.preventDefault();

        const selectedKey = state.selectedKey();

        const key =
          selectedKey != null ? delegate().getKeyAbove?.(selectedKey) : delegate().getFirstKey?.();

        if (key) {
          state.setSelectedKey(key);
        }
        break;
      }
      case "ArrowRight": {
        // prevent scrolling containers
        e.preventDefault();

        const selectedKey = state.selectedKey();

        const key =
          selectedKey != null ? delegate().getKeyBelow?.(selectedKey) : delegate().getFirstKey?.();

        if (key) {
          state.setSelectedKey(key);
        }
        break;
      }
    }
  };

  const { menuTriggerProps, menuProps } = createMenuTrigger(
    {
      type: "listbox",
      get isDisabled() {
        return props.isDisabled;
      }
    },
    ref,
    state
  );

  const { typeSelectProps } = createTypeSelect({
    keyboardDelegate: delegate,
    selectionManager: state.selectionManager,
    onTypeSelect: key => state.setSelectedKey(key)
  });

  const createFieldProps = mergeProps(props, {
    // select is not an HTML input element so it
    // shouldn't be labeled by a <label> element.
    isHTMLLabelElement: false
  } as Partial<AriaFieldProps>);

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    createField(createFieldProps);

  const domProps = filterDOMProps(props, { labelable: true });

  const triggerProps = combineProps(typeSelectProps, menuTriggerProps, fieldProps);

  const valueId = createId();

  const _labelProps = mergeProps(labelProps, {
    onClick() {
      if (!props.isDisabled) {
        ref()?.focus();

        // Show the focus ring so the user knows where focus went
        setInteractionModality("keyboard");
      }
    }
  } as JSX.HTMLAttributes<any>);

  const _triggerProps = combineProps(
    domProps,
    // eslint-disable-next-line solid/reactivity
    mergeProps(triggerProps, {
      get "aria-labelledby"() {
        return [
          triggerProps["aria-labelledby"],
          triggerProps["aria-label"] && !triggerProps["aria-labelledby"] ? triggerProps.id : null,
          valueId
        ]
          .filter(Boolean)
          .join(" ");
      },
      onKeyDown: chain([
        triggerProps.onKeyDown as KeyboardEvents["onKeyDown"],
        onKeyDown,
        props.onKeyDown
      ]),
      onKeyUp: props.onKeyUp,
      onFocus(e: FocusEvent) {
        if (state.isFocused()) {
          return;
        }

        props.onFocus?.(e);
        props.onFocusChange?.(true);

        state.setFocused(true);
      },
      onBlur(e: FocusEvent) {
        if (state.isOpen()) {
          return;
        }

        props.onBlur?.(e);
        props.onFocusChange?.(false);

        state.setFocused(false);
      }
    } as JSX.HTMLAttributes<any>)
  ) as AriaButtonProps;

  // eslint-disable-next-line solid/reactivity
  const _menuProps = mergeProps(menuProps, {
    shouldSelectOnPressUp: true,
    shouldFocusOnHover: true,
    disallowEmptySelection: true,
    get autofocus() {
      return state.focusStrategy() ?? true;
    },
    get "aria-labelledby"() {
      return [
        fieldProps["aria-labelledby"],
        triggerProps["aria-label"] && !fieldProps["aria-labelledby"] ? triggerProps.id : null
      ]
        .filter(Boolean)
        .join(" ");
    },
    onBlur: e => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
      }

      props.onBlur?.(e);
      props.onFocusChange?.(false);

      state.setFocused(false);
    }
  } as JSX.HTMLAttributes<any>) as AriaListBoxProps;

  const valueProps = {
    id: valueId
  };

  return {
    state,
    labelProps: _labelProps,
    triggerProps: _triggerProps,
    menuProps: _menuProps,
    valueProps,
    descriptionProps,
    errorMessageProps
  };
}
