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

import { ValidationState } from "@solid-aria/types";
import { Show } from "solid-js";
import { renderToString } from "solid-js/web";

import { createField } from "../../src";

interface TextFieldProps {
  label: string;
  value?: string;
  description?: string;
  errorMessage?: string;
  validationState?: ValidationState;
}

const TextInputField = (props: TextFieldProps) => {
  let ref: HTMLInputElement | undefined;

  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = createField(props);

  return (
    <div>
      <label {...labelProps}>{props.label}</label>
      <input {...fieldProps} ref={ref} />
      <div {...descriptionProps}>{props.description}</div>
      <Show when={props.validationState === "invalid"}>
        <div {...errorMessageProps}>{props.errorMessage}</div>
      </Show>
    </div>
  );
};

describe("createField", () => {
  it("should return label props", () => {
    // renderToString is important to set "hydrable context" for createUniqueId
    renderToString(() => {
      const { labelProps, fieldProps } = createField({ label: "Test" });

      expect(labelProps.id).toBeDefined();
      expect(fieldProps.id).toBeDefined();

      return "";
    });
  });

  it("should label both the description and error message at the same time", () => {
    const string = renderToString(() => (
      <TextInputField
        label="Test label"
        value="Test value"
        description="I describe the field."
        errorMessage="I'm a helpful error for the field."
        validationState="invalid"
      />
    ));

    expect(string).toBe(
      `<div data-hk="0-5"><label id="solid-aria-0-1" for="solid-aria-0-0">Test label</label><input id="solid-aria-0-0" aria-labelledby="solid-aria-0-1" aria-describedby="solid-aria-0-3 solid-aria-0-4"><div id="solid-aria-0-3">I describe the field.</div><!--#--><div data-hk="0-6-0" id="solid-aria-0-4">I'm a helpful error for the field.</div><!--/--></div>`
    );
  });
});
