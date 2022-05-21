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

import { createRoot } from "solid-js";

import { createLink } from "../src";

describe("createLink", () => {
  it("handles defaults", () => {
    createRoot(dispose => {
      let ref: HTMLAnchorElement | undefined;

      const { linkProps } = createLink({}, () => ref);

      expect(linkProps().role).toBeUndefined();
      expect(linkProps().tabIndex).toBeUndefined();
      expect(typeof linkProps().onKeyDown).toBe("function");

      dispose();
    });
  });

  it("handles custom element type", () => {
    createRoot(dispose => {
      let ref: HTMLDivElement | undefined;

      const { linkProps } = createLink({ elementType: "div" }, () => ref);

      expect(linkProps().role).toBe("link");
      expect(linkProps().tabIndex).toBe(0);

      dispose();
    });
  });

  it("handles isDisabled", () => {
    createRoot(dispose => {
      let ref: HTMLSpanElement | undefined;

      const { linkProps } = createLink({ elementType: "span", isDisabled: true }, () => ref);

      expect(linkProps().role).toBe("link");
      expect(linkProps()["aria-disabled"]).toBe(true);
      expect(linkProps().tabIndex).toBeUndefined();
      expect(typeof linkProps().onKeyDown).toBe("function");

      dispose();
    });
  });
});
