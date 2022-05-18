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

import { createVisuallyHidden } from "../src";

function Example(props: any) {
  const { visuallyHiddenProps } = createVisuallyHidden(props);

  return (
    <div tabIndex={-1} {...visuallyHiddenProps} data-testid="example">
      {props.children}
    </div>
  );
}

describe("createVisuallyHidden", () => {
  it("should apply visually hidden styles", async () => {
    render(() => <Example />);

    const el = screen.getByTestId("example");

    expect(el).toHaveStyle({
      border: 0,
      clip: "rect(0 0 0 0)",
      "clip-path": "inset(50%)",
      height: 1,
      margin: "0 -1px -1px 0",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: 1,
      "white-space": "nowrap"
    });
  });

  it("should merge user defined style with visually hidden styles", async () => {
    const customStyle = { color: "red" };

    render(() => <Example style={customStyle} />);

    const el = screen.getByTestId("example");

    expect(el).toHaveStyle({
      border: 0,
      clip: "rect(0 0 0 0)",
      "clip-path": "inset(50%)",
      height: 1,
      margin: "0 -1px -1px 0",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: 1,
      "white-space": "nowrap",
      ...customStyle
    });
  });

  it("should remove visually hidden styles if element has focus", async () => {
    render(() => <Example isFocusable />);

    const el = screen.getByTestId("example");

    fireEvent.focus(el);
    await Promise.resolve();

    expect(el).not.toHaveStyle({
      border: 0,
      clip: "rect(0 0 0 0)",
      "clip-path": "inset(50%)",
      height: 1,
      margin: "0 -1px -1px 0",
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      width: 1,
      "white-space": "nowrap"
    });
  });
});
