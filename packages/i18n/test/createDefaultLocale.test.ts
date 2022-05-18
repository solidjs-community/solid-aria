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

import { createRoot, onCleanup, onMount } from "solid-js";

import { createDefaultLocale } from "../src";

describe("createDefaultLocale", () => {
  it("should use en-US locale by default", () => {
    createRoot(dispose => {
      const locale = createDefaultLocale();

      expect(locale().locale).toBe("en-US");
      expect(locale().direction).toBe("ltr");

      dispose();
    });
  });

  it("should add and remove languagechange listener correctly", () => {
    createRoot(dispose => {
      jest.spyOn(window, "addEventListener").mock;
      jest.spyOn(window, "removeEventListener").mock;

      createDefaultLocale();

      onMount(() => {
        expect(window.addEventListener).toHaveBeenCalledWith(
          "languagechange",
          expect.any(Function)
        );

        onCleanup(() => {
          expect(window.removeEventListener).toHaveBeenCalledWith(
            "languagechange",
            expect.any(Function)
          );
        });
      });

      dispose();
    });
  });
});
