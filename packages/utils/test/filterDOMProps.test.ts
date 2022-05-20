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

import { filterDOMProps } from "../src";

describe("filterDOMProps", () => {
  it("should include only valid DOM props", async () => {
    createRoot(async dispose => {
      const filteredProps = filterDOMProps({
        id: "test",
        foo: "bar"
      });

      expect(filteredProps).toHaveProperty("id", "test");
      expect(filteredProps).not.toHaveProperty("foo");

      dispose();
    });
  });

  it("should include labelling props when labelable option is set to true", async () => {
    createRoot(async dispose => {
      const filteredProps = filterDOMProps(
        {
          id: "test",
          foo: "bar",
          "aria-label": "baz"
        },
        { labelable: true }
      );

      expect(filteredProps).toHaveProperty("id", "test");
      expect(filteredProps).toHaveProperty("aria-label", "baz");
      expect(filteredProps).not.toHaveProperty("foo");

      dispose();
    });
  });

  it("should include custom props when propNames option is set", async () => {
    createRoot(async dispose => {
      const filteredProps = filterDOMProps(
        {
          id: "test",
          foo: "bar"
        },
        { propNames: new Set(["foo"]) }
      );

      expect(filteredProps).toHaveProperty("id", "test");
      expect(filteredProps).toHaveProperty("foo", "bar");

      dispose();
    });
  });

  it("should include data-* attributes", async () => {
    createRoot(async dispose => {
      const filteredProps = filterDOMProps({
        id: "test",
        "data-foo": "bar"
      });

      expect(filteredProps).toHaveProperty("id", "test");
      expect(filteredProps).toHaveProperty("data-foo", "bar");

      dispose();
    });
  });
});
