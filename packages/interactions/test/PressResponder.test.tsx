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

import { fireEvent, render, screen } from "solid-testing-library";

import { createPress, PressResponder } from "../src";

function PressableButton(props: any) {
  const { pressProps, ref } = createPress<HTMLButtonElement>(props);

  return (
    <button ref={ref} {...pressProps}>
      Button
    </button>
  );
}

describe("PressResponder", () => {
  it("should handle press events on nested pressable children", async () => {
    const onPress = jest.fn();

    render(() => (
      <PressResponder onPress={onPress}>
        <div>
          <PressableButton />
        </div>
      </PressResponder>
    ));

    const button = screen.getByRole("button");

    fireEvent.mouseDown(button);
    await Promise.resolve();

    fireEvent.mouseUp(button);
    await Promise.resolve();

    fireEvent.click(button);
    await Promise.resolve();

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should handle forward refs to nested pressable children", () => {
    let ref: HTMLButtonElement | undefined;

    render(() => (
      <PressResponder ref={ref}>
        <div>
          <PressableButton />
        </div>
      </PressResponder>
    ));

    const button = screen.getByRole("button");

    expect(ref).toBe(button);
  });

  it("should warn if there is no pressable child", () => {
    const warn = jest.spyOn(global.console, "warn").mockImplementation();

    render(() => (
      <PressResponder>
        <div>
          <button>Button</button>
        </div>
      </PressResponder>
    ));

    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
  });

  it("should not warn if there is a pressable child", () => {
    const warn = jest.spyOn(global.console, "warn").mockImplementation();

    render(() => (
      <PressResponder>
        <div>
          <PressableButton />
        </div>
      </PressResponder>
    ));

    expect(warn).not.toHaveBeenCalled();

    warn.mockRestore();
  });

  it("should merge with existing props, not overwrite", async () => {
    const onPress = jest.fn();
    const onClick = jest.fn();

    render(() => (
      <PressResponder>
        <div>
          <PressableButton onPress={onPress} onClick={onClick} />
        </div>
      </PressResponder>
    ));

    const button = screen.getByRole("button");
    fireEvent.mouseDown(button);
    await Promise.resolve();

    fireEvent.mouseUp(button);
    await Promise.resolve();

    fireEvent.click(button);
    await Promise.resolve();

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
