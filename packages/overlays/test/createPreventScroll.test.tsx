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

import { createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createPreventScroll, PreventScrollOptions } from "../src";

function Example(props: PreventScrollOptions) {
  createPreventScroll(props);
  return <div />;
}

describe("createPreventScroll", function () {
  it("should set overflow: hidden on the body on mount and remove on unmount", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const res = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    res.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should work with nested modals", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const one = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const two = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    two.unmount();
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    one.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should remove overflow: hidden when isDisabled option is true", async () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    render(() => {
      const [isDisabled, setDisabled] = createSignal(false);
      return (
        <>
          <button onClick={() => setDisabled(true)}>Disable scroll lock</button>
          <Example isDisabled={isDisabled} />
        </>
      );
    });
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const disableButton = screen.getByRole("button");

    fireEvent.click(disableButton);
    await Promise.resolve();

    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });
});
