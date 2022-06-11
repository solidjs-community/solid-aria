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

import { createBreadcrumbs } from "../src";

describe("createBreadcrumbs", () => {
  it("handles defaults", () => {
    createRoot(dispose => {
      const { navProps } = createBreadcrumbs({});

      expect(navProps["aria-label"]).toBe("Breadcrumbs");

      dispose();
    });
  });

  it("handles custom aria label", () => {
    createRoot(dispose => {
      const { navProps } = createBreadcrumbs({ "aria-label": "test-label" });

      expect(navProps["aria-label"]).toBe("test-label");

      dispose();
    });
  });
});
