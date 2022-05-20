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

import { render, screen } from "solid-testing-library";

import { DismissButton } from "../src";

describe("DismissButton", () => {
  it("should have a default aria-label", () => {
    render(() => <DismissButton />);

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-label", "Dismiss");
  });

  it("should accept an aria-label", () => {
    render(() => <DismissButton aria-label="foo" />);

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-label", "foo");
  });

  it("should accept an aria-labelledby", () => {
    render(() => (
      <>
        <span id="span-id">bar</span>
        <DismissButton aria-labelledby="span-id" />
      </>
    ));

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-labelledby", "span-id");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("should accept an aria-labelledby and aria-label", () => {
    render(() => (
      <>
        <span id="span-id">bar</span>
        <DismissButton aria-labelledby="span-id" aria-label="foo" id="self" />
      </>
    ));

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-labelledby", "span-id self");
    expect(button).toHaveAttribute("aria-label", "foo");
  });
});
