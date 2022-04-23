import { fireEvent, render, screen } from "solid-testing-library";

import { AriaRadioProps, createRadio, createRadioGroupState } from "../src";

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;

  const state = createRadioGroupState({});
  const { inputProps } = createRadio(props, state, () => ref);

  return (
    <label data-testid="label">
      <input data-testid="input" ref={ref} {...inputProps()} />
      {props.children}
    </label>
  );
}

describe("createRadio", () => {
  it("should set input type to radio", async () => {
    render(() => <Radio value="test">Test</Radio>);

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("type", "radio");
  });

  it("ensure default unchecked can be checked", async () => {
    render(() => <Radio value="test">Click Me</Radio>);

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
  });

  it("can be disabled", async () => {
    render(() => (
      <Radio value="test" isDisabled>
        Click Me
      </Radio>
    ));

    const label = screen.getByTestId("label");
    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input.disabled).toBeTruthy();
    expect(input.checked).toBeFalsy();

    // I don't know why but `fireEvent` on the input fire the click even if the input is disabled.
    // fireEvent.click(input);
    fireEvent.click(label);
    await Promise.resolve();

    expect(input.checked).toBeFalsy();
  });

  it("supports aria-label", () => {
    const ariaLabel = "not visible";

    render(() => (
      <Radio value="test" aria-label={ariaLabel}>
        Click Me
      </Radio>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-label", ariaLabel);
  });

  it("supports aria-labelledby", () => {
    const ariaLabelledBy = "test";

    render(() => (
      <Radio value="test" aria-labelledby={ariaLabelledBy}>
        Click Me
      </Radio>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", ariaLabelledBy);
  });

  it("supports aria-describedby", () => {
    const ariaDescribedBy = "test";

    render(() => (
      <Radio value="test" aria-describedby={ariaDescribedBy}>
        Click Me
      </Radio>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", ariaDescribedBy);
  });

  it("supports additional props", () => {
    render(() => (
      <Radio value="test" data-foo="bar">
        Click Me
      </Radio>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("data-foo", "bar");
  });
});
