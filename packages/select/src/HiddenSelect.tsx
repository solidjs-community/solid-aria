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

import { createInteractionModality } from "@solid-aria/interactions";
import { createVisuallyHidden } from "@solid-aria/visually-hidden";
import { Accessor, createMemo, For, JSX, Match, mergeProps, Switch } from "solid-js";

import { SelectState } from "./createSelectState";

export interface AriaHiddenSelectProps {
  /**
   * Describes the type of autocomplete functionality the input should provide if any. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete).
   */
  autocomplete?: string;

  /**
   *  The text label for the select.
   */
  label?: JSX.Element;

  /**
   * HTML form input name.
   */
  name?: string;

  /**
   * Sets the disabled state of the select and input.
   */
  isDisabled?: boolean;
}

/**
 * Provides the behavior and accessibility implementation for a hidden `<select>` element, which
 * can be used in combination with `createSelect` to support browser form autofill, mobile form
 * navigation, and native HTML form submission.
 */
export function createHiddenSelect<T extends HTMLElement>(
  props: AriaHiddenSelectProps,
  triggerRef: Accessor<T | undefined>,
  state: Accessor<SelectState>
) {
  const modality = createInteractionModality();
  const { visuallyHiddenProps } = createVisuallyHidden();

  // In Safari, the <select> cannot have `display: none` or `hidden` for autofill to work.
  // In Firefox, there must be a <label> to identify the <select> whereas other browsers
  // seem to identify it just by surrounding text.
  // The solution is to use <VisuallyHidden> to hide the elements, which clips the elements to a
  // 1px rectangle. In addition, we hide from screen readers with aria-hidden, and make the <select>
  // non tabbable with tabIndex={-1}.
  //
  // In mobile browsers, there are next/previous buttons above the software keyboard for navigating
  // between fields in a form. These only support native form inputs that are tabbable. In order to
  // support those, an additional hidden input is used to marshall focus to the button. It is tabbable
  // except when the button is focused, so that shift tab works properly to go to the actual previous
  // input in the form. Using the <select> for this also works, but Safari on iOS briefly flashes
  // the native menu on focus, so this isn't ideal. A font-size of 16px or greater is required to
  // prevent Safari from zooming in on the input when it is focused.
  //
  // If the current interaction modality is null, then the user hasn't interacted with the page yet.
  // In this case, we set the tabIndex to -1 on the input element so that automated accessibility
  // checkers don't throw false-positives about focusable elements inside an aria-hidden parent.

  const containerProps: JSX.HTMLAttributes<any> = mergeProps(visuallyHiddenProps, {
    "aria-hidden": true
  });

  const inputProps: JSX.InputHTMLAttributes<HTMLInputElement> = {
    type: "text",
    style: {
      "font-size": "16px"
    },
    get tabIndex() {
      return modality() == null || state().isFocused() || state().isOpen() ? -1 : 0;
    },
    get disabled() {
      return props.isDisabled;
    },
    onFocus: () => triggerRef()?.focus()
  };

  const selectProps: JSX.SelectHTMLAttributes<HTMLSelectElement> = {
    tabIndex: -1,
    get autocomplete() {
      return props.autocomplete;
    },
    get disabled() {
      return props.isDisabled;
    },
    get name() {
      return props.name;
    },
    get size() {
      return state().collection().size;
    },
    get value() {
      return state().selectedKey() ?? "";
    },
    onChange: e => {
      state().setSelectedKey((e.target as HTMLSelectElement).value);
    }
  };

  return {
    containerProps,
    inputProps,
    selectProps
  };
}

interface HiddenSelectProps<T extends HTMLElement> extends AriaHiddenSelectProps {
  /**
   * State for the select.
   */
  state: SelectState;

  /**
   * A ref to the trigger element.
   */
  triggerRef?: T;
}

/**
 * Renders a hidden native `<select>` element, which can be used to support browser
 * form autofill, mobile form navigation, and native form submission.
 */
export function HiddenSelect<T extends HTMLElement>(props: HiddenSelectProps<T>) {
  const { containerProps, inputProps, selectProps } = createHiddenSelect(
    props,
    () => props.triggerRef,
    () => props.state
  );

  const items = createMemo(() => {
    return [...props.state.collection()].filter(item => item.type === "item");
  });

  // If used in a <form>, use a hidden input so the value can be submitted to a server.
  // If the collection isn't too big, use a hidden <select> element for this so that browser
  // autofill will work. Otherwise, use an <input type="hidden">.
  return (
    <Switch>
      <Match when={props.state.collection().size <= 300}>
        <div {...containerProps}>
          <input {...inputProps} />
          <label>
            {props.label}
            <select {...selectProps} value={selectProps.value}>
              <option />
              <For each={items()}>{item => <option value={item.key}>{item.textValue}</option>}</For>
            </select>
          </label>
        </div>
      </Match>
      <Match when={props.name}>
        <input
          type="hidden"
          autocomplete={selectProps.autocomplete}
          name={props.name}
          disabled={props.isDisabled}
          value={props.state.selectedKey()}
        />
      </Match>
    </Switch>
  );
}
