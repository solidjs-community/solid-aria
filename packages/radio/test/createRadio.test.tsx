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

import { fireEvent, render, screen } from "solid-testing-library";

import { AriaRadioGroupProps, AriaRadioProps, createRadio, createRadioGroup } from "../src";

function RadioGroup(props: AriaRadioGroupProps) {
  const { RadioGroupProvider, groupProps, labelProps } = createRadioGroup(props);

  return (
    <div {...groupProps()}>
      <span {...labelProps()}>{props.label}</span>
      <RadioGroupProvider>{props.children}</RadioGroupProvider>
    </div>
  );
}

function Radio(props: AriaRadioProps) {
  let ref: HTMLInputElement | undefined;

  const { inputProps } = createRadio(props, () => ref);

  return (
    <label data-testid="label">
      <input data-testid="input" ref={ref} {...inputProps()} />
      {props.children}
    </label>
  );
}

describe("createRadio", () => {
  it("should set input type to radio", async () => {
    render(() => (
      <RadioGroup>
        <Radio value="test">Test</Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("type", "radio");
  });

  it("ensure default unchecked can be checked", async () => {
    render(() => (
      <RadioGroup>
        <Radio value="test">Click Me</Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input.checked).toBeFalsy();

    fireEvent.click(input);
    await Promise.resolve();

    expect(input.checked).toBeTruthy();
  });

  it("can be disabled", async () => {
    render(() => (
      <RadioGroup>
        <Radio value="test" isDisabled>
          Click Me
        </Radio>
      </RadioGroup>
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
      <RadioGroup>
        <Radio value="test" aria-label={ariaLabel}>
          Click Me
        </Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-label", ariaLabel);
  });

  it("supports aria-labelledby", () => {
    const ariaLabelledBy = "test";

    render(() => (
      <RadioGroup>
        <Radio value="test" aria-labelledby={ariaLabelledBy}>
          Click Me
        </Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-labelledby", ariaLabelledBy);
  });

  it("supports aria-describedby", () => {
    const ariaDescribedBy = "test";

    render(() => (
      <RadioGroup>
        <Radio value="test" aria-describedby={ariaDescribedBy}>
          Click Me
        </Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("aria-describedby", ariaDescribedBy);
  });

  it("supports additional props", () => {
    render(() => (
      <RadioGroup>
        <Radio value="test" data-foo="bar">
          Click Me
        </Radio>
      </RadioGroup>
    ));

    const input = screen.getByTestId("input") as HTMLInputElement;

    expect(input).toHaveAttribute("data-foo", "bar");
  });
});
