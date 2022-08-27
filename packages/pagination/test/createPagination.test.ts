import { createPagination, PaginationAriaProps } from "../src/createPagination";
import { PaginationProps, PaginationState } from "../src";

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
    // @ts-expect-error Broken type?
    paginationProps.prevButtonProps.onPress(makeEvent("click"));
    expect(state.onDecrement).toHaveBeenCalled();
    expect(props.onPrevious).toHaveBeenCalledWith(state.value());
  });

  it("handles invalid previous", function () {
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    // @ts-expect-error Broken type?
    paginationProps.prevButtonProps.onPress(makeEvent("click"));
    expect(state.onDecrement).toHaveBeenCalled();
    expect(props.onPrevious).toHaveBeenCalledWith(state.value());
  });

  it("handles valid next", function () {
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    // @ts-expect-error Broken type?
    paginationProps.nextButtonProps.onPress(makeEvent("click"));
    expect(state.onIncrement).toHaveBeenCalled();
    expect(props.onNext).toHaveBeenCalledWith(state.value());
  });

  it("handles invalid next", function () {
    jest.spyOn(state, "value").mockImplementation(() => maxValue);
    const paginationProps = createPaginationMock({
      defaultValue: 1,
      maxValue: maxValue
    });
    // @ts-expect-error Broken type?
    paginationProps.nextButtonProps.onPress(makeEvent("click"));
    expect(state.onIncrement).toHaveBeenCalled();
    expect(props.onNext).toHaveBeenCalledWith(state.value());
  });
});
