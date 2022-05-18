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

import { createKeyboard } from "../src";

function Example(props: any) {
  const { keyboardProps } = createKeyboard(props);

  return (
    <button {...keyboardProps} data-testid="example">
      {props.children}
    </button>
  );
}

describe("createKeyboard", () => {
  it("handles keyboard events on the immediate target", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push({ type: e.type, target: e.target });

    render(() => <Example onKeyDown={addEvent} onKeyUp={addEvent} />);

    const el = screen.getByTestId("example");

    fireEvent.keyDown(el);
    await Promise.resolve();

    fireEvent.keyUp(el);
    await Promise.resolve();

    expect(events).toEqual([
      { type: "keydown", target: el },
      { type: "keyup", target: el }
    ]);
  });

  it("does not handle keyboard events if disabled", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push({ type: e.type, target: e.target });

    render(() => <Example isDisabled onKeyDown={addEvent} onKeyUp={addEvent} />);

    const el = screen.getByTestId("example");

    fireEvent.keyDown(el);
    await Promise.resolve();

    fireEvent.keyUp(el);
    await Promise.resolve();

    expect(events).toEqual([]);
  });

  it("should not bubble events when stopPropagation is called", async () => {
    const onWrapperKeyDown = jest.fn();
    const onWrapperKeyUp = jest.fn();
    const onInnerKeyDown = jest.fn(e => e.stopPropagation());
    const onInnerKeyUp = jest.fn(e => e.stopPropagation());

    render(() => (
      <button onKeyDown={onWrapperKeyDown} onKeyUp={onWrapperKeyUp}>
        <Example onKeyDown={onInnerKeyDown} onKeyUp={onInnerKeyUp} />
      </button>
    ));

    const el = screen.getByTestId("example");

    fireEvent.keyDown(el);
    await Promise.resolve();

    fireEvent.keyUp(el);
    await Promise.resolve();

    expect(onInnerKeyDown).toHaveBeenCalledTimes(1);
    expect(onInnerKeyUp).toHaveBeenCalledTimes(1);
    expect(onWrapperKeyDown).not.toHaveBeenCalled();
    expect(onWrapperKeyUp).not.toHaveBeenCalled();
  });
});
