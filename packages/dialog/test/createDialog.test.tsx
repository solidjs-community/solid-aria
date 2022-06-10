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

import { render, screen, waitFor } from "solid-testing-library";

import { createDialog } from "../src";

function Example(props: any) {
  let ref: any;
  const { dialogProps } = createDialog(props, () => ref);

  return (
    <div {...dialogProps} ref={ref} data-testid="test">
      {props.children}
    </div>
  );
}

describe("createDialog", () => {
  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
  });

  it('should have role="dialog" by default', () => {
    render(() => <Example />);

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("role", "dialog");
  });

  it('should accept role="alertdialog"', () => {
    render(() => <Example role="alertdialog" />);

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("role", "alertdialog");
  });

  it("should focus the overlay on mount", async () => {
    render(() => <Example />);

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("tabIndex", "-1");

    expect(document.activeElement).toBe(el);
  });

  it("should not focus the overlay if something inside is auto focused", async () => {
    render(() => (
      <Example>
        <input data-testid="input" autofocus />
      </Example>
    ));

    const input = screen.getByTestId("input");

    waitFor(() => expect(document.activeElement).toBe(input));
  });
});
