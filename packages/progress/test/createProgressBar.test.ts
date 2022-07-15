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

import { createProgressBar } from "../src";

describe("createProgressBar", () => {
  it("should use default props if no props are provided", () =>
    createRoot(dispose => {
      const { progressBarProps } = createProgressBar();

      expect(progressBarProps.role).toBe("progressbar");
      expect(progressBarProps["aria-valuemin"]).toBe(0);
      expect(progressBarProps["aria-valuemax"]).toBe(100);
      expect(progressBarProps["aria-valuenow"]).toBe(0);
      expect(progressBarProps["aria-valuetext"]).toBe("0%");
      expect(progressBarProps["aria-label"]).toBeUndefined();
      expect(progressBarProps["aria-labelledby"]).toBeUndefined();

      dispose();
    }));

  it("supports labeling", () =>
    createRoot(dispose => {
      const { progressBarProps, labelProps } = createProgressBar({ label: "Test" });

      expect(labelProps.id).toBeDefined();
      expect(progressBarProps["aria-labelledby"]).toBe(labelProps.id);

      dispose();
    }));

  it("supports custom value", () =>
    createRoot(dispose => {
      const { progressBarProps } = createProgressBar({ value: 25 });

      expect(progressBarProps["aria-valuenow"]).toBe(25);
      expect(progressBarProps["aria-valuetext"]).toBe("25%");

      dispose();
    }));

  it("supports indeterminate state", () =>
    createRoot(dispose => {
      const { progressBarProps } = createProgressBar({ isIndeterminate: true });

      expect(progressBarProps["aria-valuemin"]).toBe(0);
      expect(progressBarProps["aria-valuemax"]).toBe(100);
      expect(progressBarProps["aria-valuenow"]).toBeUndefined();
      expect(progressBarProps["aria-valuetext"]).toBeUndefined();

      dispose();
    }));

  it("supports custom text value", () =>
    createRoot(dispose => {
      const { progressBarProps } = createProgressBar({ value: 25, valueLabel: "25€" });

      expect(progressBarProps["aria-valuenow"]).toBe(25);
      expect(progressBarProps["aria-valuetext"]).toBe("25€");

      dispose();
    }));

  it("supports custom label", () =>
    createRoot(dispose => {
      const { progressBarProps, labelProps } = createProgressBar({ label: "test", value: 25 });

      expect(progressBarProps["aria-labelledby"]).toBe(labelProps.id);

      dispose();
    }));
});
