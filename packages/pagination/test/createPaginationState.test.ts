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

import { createPaginationState, PaginationProps } from "../src";

describe("createPaginationState", () => {
  const maxValue = 20;

  it("should have correct type", () => {
    const props: PaginationProps = { defaultValue: 1 };
    const result = createPaginationState(props);
    expect(typeof result.onChange).toBe("function");
    expect(typeof result.onDecrement).toBe("function");
    expect(typeof result.onIncrement).toBe("function");
    expect(typeof result.value).toBe("function");
  });

  it("renders with default value", () => {
    const props = { defaultValue: 1 };
    const result = createPaginationState(props);
    expect(result.value()).toEqual(props.defaultValue);
  });

  it("renders with changed value", () => {
    const props = { value: 2, defaultValue: 1 };
    const result = createPaginationState(props);
    expect(result.value()).toEqual(2);
  });

  it("onPageInputChange", () => {
    const props = {
      defaultValue: 1,
      maxValue: maxValue,
      onChange: () => ({})
    };
    const onChangeSpy = jest.spyOn(props, "onChange");
    const result = createPaginationState(props);
    result.onChange(5);

    expect(result.value()).toEqual(5);
    expect(onChangeSpy).toHaveBeenCalledWith(5);
  });

  it("should be controlled if props.value is defined", () => {
    const props = { value: 2, defaultValue: 1, maxValue: maxValue };
    const result = createPaginationState(props);
    result.onChange(5);
    expect(result.value()).toEqual(props.value);
  });

  it("test invalid state value : character", () => {
    const props = { defaultValue: 1, maxValue: maxValue };
    const result = createPaginationState(props);
    // @ts-expect-error should pass "" | number
    result.onChange("a");
    expect(result.value()).toEqual(props.defaultValue);
  });

  it("test invalid state value : value > maxValue", () => {
    const props = { defaultValue: 1, maxValue: maxValue };
    const result = createPaginationState(props);
    result.onChange(maxValue + 1);
    expect(result.value()).toEqual(props.defaultValue);
  });

  it("test empty state value", () => {
    const props = { defaultValue: 1, maxValue: maxValue };
    const result = createPaginationState(props);
    result.onChange("");
    expect(result.value()).toEqual("");
  });

  it("test cannot be major than max value", () => {
    const props = { defaultValue: maxValue, maxValue: maxValue };
    const result = createPaginationState(props);
    result.onIncrement();
    expect(result.value()).toEqual(maxValue);
  });

  it("test onIncrement", () => {
    const props = { defaultValue: 1, maxValue: maxValue };
    const result = createPaginationState(props);
    result.onIncrement();
    expect(result.value()).toEqual(2);
  });

  it("test onDecrement", () => {
    const props = { defaultValue: 2, maxValue: maxValue };
    const result = createPaginationState(props);

    result.onDecrement();

    expect(result.value()).toEqual(1);

    result.onDecrement();

    expect(result.value()).toEqual(1);
  });
});
