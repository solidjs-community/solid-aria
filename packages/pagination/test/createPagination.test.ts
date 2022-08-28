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

import { PaginationProps, PaginationState } from "../src";
import { createPagination, PaginationAriaProps } from "../src/createPagination";

describe("createPagination", () => {
  const maxValue = 20;
  const preventDefault = jest.fn();
  const setValue = jest.fn();
  const onIncrement = jest.fn();
  const onPrevious = jest.fn();
  const onNext = jest.fn();
  const props: PaginationAriaProps = {} as PaginationAriaProps;
  const onDecrement = jest.fn();
  const state: PaginationState = {} as PaginationState;
  const makeEvent = (key: string) => ({
    key,
    preventDefault
  });

  beforeEach(() => {
    state.value = () => 1;
    state.onChange = setValue;
    state.onIncrement = onIncrement;
    state.onDecrement = onDecrement;
    props.onPrevious = onPrevious;
    props.onNext = onNext;
  });

  afterEach(() => {
    preventDefault.mockClear();
    setValue.mockClear();
    onPrevious.mockClear();
    onNext.mockClear();
    onIncrement.mockClear();
    onDecrement.mockClear();
    state.value = () => 1;
  });

  const createPaginationMock = (props: PaginationProps & PaginationAriaProps = {}) => {
    props.onPrevious = onPrevious;
    props.onNext = onNext;
    return createPagination(props, state);
  };

  it("handles defaults", () => {
    const paginationProps = createPaginationMock();
    expect(typeof paginationProps.prevButtonProps.onPress).toBe("function");
    expect(typeof paginationProps.nextButtonProps.onPress).toBe("function");
    expect(typeof paginationProps.textProps.onKeyDown).toBe("function");
  });

  it("handles aria props", function () {
    const paginationProps = createPaginationMock();
    expect(paginationProps.prevButtonProps["aria-label"]).toEqual("Previous");
    expect(paginationProps.nextButtonProps["aria-label"]).toBe("Next");
  });

  it("handles valid onkeydown", function () {
    const paginationProps = createPaginationMock();
    // @ts-expect-error Broken type?
    paginationProps.textProps.onKeyDown?.(makeEvent("Up"));
    expect(state.onIncrement).toHaveBeenCalled();
  });

  it("handles invalid onkeydown : value <= 1", function () {
    const paginationProps = createPaginationMock();
    // @ts-expect-error Broken type?
    paginationProps.textProps.onKeyDown(makeEvent("Down"));
    expect(state.onDecrement).toHaveBeenCalled();
  });

  it("handles invalid onkeydown : value is a character", function () {
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    // @ts-expect-error Broken type?
    paginationProps.textProps.onKeyDown(makeEvent("a"));
    expect(state.onChange).not.toHaveBeenCalled();
  });

  it("handles valid previous", function () {
    jest.spyOn(state, "value").mockImplementation(() => 2);
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    const clickEvent = makeEvent("click");
    // @ts-expect-error Broken type?
    paginationProps.prevButtonProps.onPress(clickEvent);
    expect(state.onDecrement).toHaveBeenCalled();
    expect(props.onPrevious).toHaveBeenCalledWith(state.value(), clickEvent);
  });

  it("handles invalid previous", function () {
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    const clickEvent = makeEvent("click");
    // @ts-expect-error Broken type?
    paginationProps.prevButtonProps.onPress(clickEvent);
    expect(state.onDecrement).toHaveBeenCalled();
    expect(props.onPrevious).toHaveBeenCalledWith(state.value(), clickEvent);
  });

  it("handles valid next", function () {
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });

    const clickEvent = makeEvent("click");
    // @ts-expect-error Broken type?
    paginationProps.nextButtonProps.onPress(clickEvent);
    expect(state.onIncrement).toHaveBeenCalled();
    expect(props.onNext).toHaveBeenCalledWith(state.value(), clickEvent);
  });

  it("handles invalid next", function () {
    jest.spyOn(state, "value").mockImplementation(() => maxValue);
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    const clickEvent = makeEvent("click");
    // @ts-expect-error Broken type?
    paginationProps.nextButtonProps.onPress(makeEvent("click"));
    expect(state.onIncrement).toHaveBeenCalled();
    expect(props.onNext).toHaveBeenCalledWith(state.value(), clickEvent);
  });
});
