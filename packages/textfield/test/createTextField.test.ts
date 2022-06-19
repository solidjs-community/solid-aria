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

import { callHandler } from "@solid-aria/utils";
import { createRoot } from "solid-js";

import { createTextField } from "../src";

describe("createTextField", () => {
  it("should use default props if no props are provided", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      const { inputProps } = createTextField({}, () => ref);

      expect(inputProps.type).toBe("text");
      expect(inputProps.disabled).toBeFalsy();
      expect(inputProps.readOnly).toBeFalsy();
      expect(inputProps["aria-invalid"]).toBeUndefined();
      expect(inputProps["aria-required"]).toBeUndefined();
      expect(typeof inputProps.onChange).toBe("function");
      expect(inputProps.autofocus).toBeFalsy();

      dispose();
    }));

  it("supports custom type", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      const { inputProps } = createTextField({ type: "search" }, () => ref);

      expect(inputProps.type).toBe("search");

      dispose();
    }));

  it("set disabled based on isDisabled prop", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      let result = createTextField({ isDisabled: true }, () => ref);

      expect(result.inputProps.disabled).toBeTruthy();

      result = createTextField({ isDisabled: false }, () => ref);

      expect(result.inputProps.disabled).toBeFalsy();

      dispose();
    }));

  it("set aria-required based on isRequired prop", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      let result = createTextField({ isRequired: true }, () => ref);

      expect(result.inputProps["aria-required"]).toBeTruthy();

      result = createTextField({ isRequired: false }, () => ref);

      expect(result.inputProps["aria-required"]).toBeUndefined();

      dispose();
    }));

  it("set readonly based on isReadOnly prop", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      let result = createTextField({ isReadOnly: true }, () => ref);

      expect(result.inputProps.readOnly).toBeTruthy();

      result = createTextField({ isReadOnly: false }, () => ref);

      expect(result.inputProps.readOnly).toBeFalsy();

      dispose();
    }));

  it("set aria-invalid based on validationState prop", () =>
    createRoot(dispose => {
      const ref = document.createElement("input");
      let result = createTextField({ validationState: "invalid" }, () => ref);

      expect(result.inputProps["aria-invalid"]).toBeTruthy();

      result = createTextField({ validationState: "valid" }, () => ref);

      expect(result.inputProps["aria-invalid"]).toBeUndefined();

      dispose();
    }));

  it("should call user provided onChange handler with appropriate value", () =>
    createRoot(dispose => {
      const onChange = jest.fn();

      const ref = document.createElement("input");
      const { inputProps } = createTextField({ onChange }, () => ref);

      const mockEvent = {
        target: {
          value: 1
        }
      };

      callHandler(inputProps.onChange, mockEvent as any);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(mockEvent.target.value);

      onChange.mockClear();

      dispose();
    }));

  it("should not set type and pattern when inputElementType is textarea", () =>
    createRoot(dispose => {
      const ref = document.createElement("textarea");
      const { inputProps } = createTextField(
        {
          type: "search",
          pattern: /pattern/ as unknown as string,
          inputElementType: "textarea"
        },
        () => ref
      );

      // TS hack: cast to 'any' for checking if those props are undefined
      expect((inputProps as any).type).toBeUndefined();
      expect((inputProps as any).pattern).toBeUndefined();

      dispose();
    }));
});
