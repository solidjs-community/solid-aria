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

import { createRoot } from "solid-js";

import { createLabel } from "../src";

describe("createLabel", () => {
  it("should return props for visible label", () => {
    createRoot(dispose => {
      const { labelProps, fieldProps } = createLabel({ label: "Test" });

      expect(labelProps().id).toBeDefined();
      expect(fieldProps().id).toBeDefined();
      expect(labelProps().id).toBe(fieldProps()["aria-labelledby"]);
      expect(labelProps().for).toBe(fieldProps().id);

      // check that generated ids are unique
      expect(labelProps().id).not.toBe(fieldProps().id);

      dispose();
    });
  });

  it("should combine aria-labelledby if visible label is also provided", () => {
    createRoot(dispose => {
      const { labelProps, fieldProps } = createLabel({ label: "Test", "aria-labelledby": "foo" });

      expect(labelProps().id).toBeDefined();
      expect(fieldProps().id).toBeDefined();
      expect(fieldProps()["aria-labelledby"]).toBe(`foo ${labelProps().id}`);
      expect(labelProps().for).toBe(fieldProps().id);
      expect(labelProps().id).not.toBe(fieldProps().id);

      dispose();
    });
  });

  it("should combine aria-labelledby if visible label and aria-label is also provided", () => {
    createRoot(dispose => {
      const { labelProps, fieldProps } = createLabel({
        label: "Test",
        "aria-labelledby": "foo",
        "aria-label": "bar"
      });

      expect(labelProps().id).toBeDefined();
      expect(fieldProps().id).toBeDefined();
      expect(fieldProps()["aria-label"]).toBe("bar");
      expect(fieldProps()["aria-labelledby"]).toBe(`foo ${labelProps().id} ${fieldProps().id}`);
      expect(labelProps().for).toBe(fieldProps().id);
      expect(labelProps().id).not.toBe(fieldProps().id);

      dispose();
    });
  });

  it("should work without a visisble label", () => {
    createRoot(dispose => {
      const { labelProps, fieldProps } = createLabel({ "aria-label": "Label" });

      expect(labelProps().id).toBeUndefined();
      expect(labelProps().for).toBeUndefined();
      expect(fieldProps().id).toBeDefined();
      expect(fieldProps()["aria-labelledby"]).toBeUndefined();
      expect(fieldProps()["aria-label"]).toBe("Label");

      dispose();
    });
  });

  it("should work without a visible label and both aria-label and aria-labelledby", async () => {
    createRoot(async dispose => {
      const { labelProps, fieldProps } = createLabel({
        "aria-label": "Label",
        "aria-labelledby": "foo"
      });

      expect(labelProps().id).toBeUndefined();
      expect(labelProps().for).toBeUndefined();
      expect(fieldProps().id).toBeDefined();
      expect(fieldProps()["aria-labelledby"]).toBe(`foo ${fieldProps().id}`);
      expect(fieldProps()["aria-label"]).toBe("Label");

      dispose();
    });
  });

  it("should not return a `for` attribute when the label element is not <label>", async () => {
    createRoot(async dispose => {
      const { labelProps, fieldProps } = createLabel({ label: "Test", isHTMLLabelElement: false });

      expect(labelProps().id).toBeDefined();
      expect(fieldProps().id).toBeDefined();
      expect(labelProps().id).toBe(fieldProps()["aria-labelledby"]);
      expect(labelProps().for).toBeUndefined();

      dispose();
    });
  });
});
