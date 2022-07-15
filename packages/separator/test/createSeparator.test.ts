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

import { createSeparator } from "../src";

describe("createSeparator", () => {
  it("should not have implicit 'aria-orientation' by default", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "horizontal" });

      expect(separatorProps["aria-orientation"]).toBeUndefined();

      dispose();
    }));

  it("should not have implicit 'aria-orientation' when 'orientation=horizontal'", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "horizontal" });

      expect(separatorProps["aria-orientation"]).toBeUndefined();

      dispose();
    }));

  it("should have 'aria-orientation' set to vertical when 'orientation=vertical'", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "vertical" });

      expect(separatorProps["aria-orientation"]).toBe("vertical");

      dispose();
    }));

  it("should have 'role=separator' when elementType is not '<hr>'", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ elementType: "span" });

      expect(separatorProps.role).toBe("separator");

      dispose();
    }));

  it("should not have 'role=separator' when elementType is '<hr>'", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ elementType: "hr" });

      expect(separatorProps.role).toBeUndefined();

      dispose();
    }));

  it("supports aria-label", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ "aria-label": "test" });

      expect(separatorProps["aria-label"]).toBe("test");

      dispose();
    }));

  it("supports aria-labelledby", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ "aria-labelledby": "test" });

      expect(separatorProps["aria-labelledby"]).toBe("test");

      dispose();
    }));
});
