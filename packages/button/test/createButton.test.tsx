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

import { createButton } from "../src";
import { AriaButtonProps } from "../src/types";

describe("createButton", () => {
  it("handles defaults", () => {
    let ref: any;
    const props = {};
    const { buttonProps } = createButton(props, () => ref);

    expect(typeof buttonProps().onClick).toBe("function");
  });

  it("handles elements other than button", () => {
    let ref: any;
    const props: AriaButtonProps<"a"> = { elementType: "a" };
    const { buttonProps } = createButton(props, () => ref);

    expect(buttonProps().role).toBe("button");
    expect(buttonProps().tabIndex).toBe(0);
    expect(buttonProps()["aria-disabled"]).toBeUndefined();
    expect(buttonProps().href).toBeUndefined();
    expect(typeof buttonProps().onKeyDown).toBe("function");
    expect(buttonProps().rel).toBeUndefined();
  });

  it("handles elements other than button disabled", () => {
    let ref: any;
    const props: AriaButtonProps<"a"> = { elementType: "a", isDisabled: true };
    const { buttonProps } = createButton(props, () => ref);

    expect(buttonProps().role).toBe("button");
    expect(buttonProps().tabIndex).toBeUndefined();
    expect(buttonProps()["aria-disabled"]).toBeTruthy();
    expect(buttonProps().href).toBeUndefined();
    expect(typeof buttonProps().onKeyDown).toBe("function");
    expect(buttonProps().rel).toBeUndefined();
  });

  it("handles the rel attribute on anchors", () => {
    let ref: any;
    const props: AriaButtonProps<"a"> = { elementType: "a", rel: "noopener noreferrer" };
    const { buttonProps } = createButton(props, () => ref);

    expect(buttonProps().rel).toBe("noopener noreferrer");
  });

  it("handles the rel attribute as a string on anchors", () => {
    let ref: any;
    const props: AriaButtonProps<"a"> = { elementType: "a", rel: "search" };
    const { buttonProps } = createButton(props, () => ref);

    expect(buttonProps().rel).toBe("search");
  });

  it("handles input elements", () => {
    let ref: any;
    const props: AriaButtonProps<"input"> = { elementType: "input", isDisabled: true };
    const { buttonProps } = createButton(props, () => ref);

    expect(buttonProps().role).toBe("button");
    expect(buttonProps().tabIndex).toBeUndefined();
    expect(buttonProps()["aria-disabled"]).toBeUndefined();
    expect(buttonProps().disabled).toBeTruthy();
    expect(typeof buttonProps().onKeyDown).toBe("function");

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(buttonProps().href).toBeUndefined();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(buttonProps().rel).toBeUndefined();
  });
});
