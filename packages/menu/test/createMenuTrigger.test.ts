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

import { PressEvent } from "@solid-aria/types";
import { createRoot } from "solid-js";

import { AriaMenuTriggerProps, createMenuTrigger } from "../src";

describe("createMenuTrigger", () => {
  const renderCreateMenuTriggerPrimitive = (menuTriggerProps: AriaMenuTriggerProps = {}) => {
    const ref = document.createElement("button");
    return createMenuTrigger(menuTriggerProps, () => ref);
  };

  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
  });

  it("should return default props for menu and menu trigger", () =>
    createRoot(dispose => {
      const { menuTriggerProps, menuProps } = renderCreateMenuTriggerPrimitive();

      expect(menuTriggerProps["aria-controls"]).toBeFalsy();
      expect(menuTriggerProps["aria-expanded"]).toBeFalsy();
      expect(menuTriggerProps["aria-haspopup"]).toBeTruthy();
      expect(menuProps["aria-labelledby"]).toBe(menuTriggerProps.id);
      expect(menuProps.id).toBeTruthy();

      dispose();
    }));

  it("should return proper aria props for menu and menu trigger if menu is open", () =>
    createRoot(dispose => {
      const { menuTriggerProps, menuProps, state } = renderCreateMenuTriggerPrimitive();

      state.setOpen(true);

      expect(menuTriggerProps["aria-controls"]).toBe(menuProps.id);
      expect(menuTriggerProps["aria-expanded"]).toBeTruthy();
      expect(menuProps["aria-labelledby"]).toBe(menuTriggerProps.id);
      expect(menuProps.id).toBeTruthy();

      dispose();
    }));

  it("returns the proper aria-haspopup based on the menu's type", () =>
    createRoot(dispose => {
      const { menuTriggerProps } = renderCreateMenuTriggerPrimitive({ type: "menu" });

      expect(menuTriggerProps["aria-haspopup"]).toBeTruthy();

      dispose();
    }));

  it("returns a onPress for the menuTrigger", () =>
    createRoot(dispose => {
      const { menuTriggerProps, state } = renderCreateMenuTriggerPrimitive({ type: "menu" });

      const expectedOpenState = !state.isOpen();

      expect(typeof menuTriggerProps.onPressStart).toBe("function");

      menuTriggerProps.onPressStart?.({ pointerType: "mouse" } as PressEvent);

      expect(state.isOpen()).toBe(expectedOpenState);

      dispose();
    }));

  it("doesn't toggle the menu if isDisabled", async () =>
    createRoot(async dispose => {
      const { menuTriggerProps, state } = renderCreateMenuTriggerPrimitive({ isDisabled: true });

      expect(typeof menuTriggerProps.onPressStart).toBe("function");
      expect(state.isOpen()).toBeFalsy();

      menuTriggerProps.onPressStart?.({ pointerType: "mouse" } as PressEvent);
      await Promise.resolve();

      menuTriggerProps.onPress?.({ pointerType: "touch" } as PressEvent);
      await Promise.resolve();

      expect(state.isOpen()).toBeFalsy();

      dispose();
    }));
});
