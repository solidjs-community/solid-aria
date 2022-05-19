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

import { createOverlayTriggerState } from "../src";

describe("createOverlayTriggerState", () => {
  it("can be default opened (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createOverlayTriggerState({
        defaultOpen: true
      });

      expect(state.isOpen()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onOpenChangeSpy = jest.fn();

      const state = createOverlayTriggerState({
        isOpen: true,
        onOpenChange: onOpenChangeSpy
      });

      expect(state.isOpen()).toBeTruthy();

      state.toggle();

      expect(state.isOpen()).toBeTruthy();
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);
      expect(onOpenChangeSpy).toHaveBeenCalledWith(false);

      dispose();
    });
  });

  it("should set isOpen to true when calling open", () => {
    createRoot(dispose => {
      const state = createOverlayTriggerState({ defaultOpen: false });

      expect(state.isOpen()).toBeFalsy();

      state.open();

      expect(state.isOpen()).toBeTruthy();

      dispose();
    });
  });

  it("should set isOpen to false when calling close", () => {
    createRoot(dispose => {
      const state = createOverlayTriggerState({ defaultOpen: true });

      expect(state.isOpen()).toBeTruthy();

      state.close();

      expect(state.isOpen()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle isOpen state", () => {
    createRoot(dispose => {
      const state = createOverlayTriggerState({ defaultOpen: false });

      expect(state.isOpen()).toBeFalsy();

      state.toggle();

      expect(state.isOpen()).toBeTruthy();

      state.toggle();

      expect(state.isOpen()).toBeFalsy();

      dispose();
    });
  });
});
