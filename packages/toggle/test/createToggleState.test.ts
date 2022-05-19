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

import { createToggleState } from "../src";

describe("createToggleState", () => {
  it("can be default selected (uncontrolled)", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: true
      });

      expect(state.isSelected()).toBeTruthy();

      dispose();
    });
  });

  it("can be controlled", () => {
    createRoot(dispose => {
      const onChangeSpy = jest.fn();

      const state = createToggleState({
        isSelected: true,
        onChange: onChangeSpy
      });

      expect(state.isSelected()).toBeTruthy();

      state.toggle();

      expect(state.isSelected()).toBeTruthy();
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith(false);

      dispose();
    });
  });

  it("should setSelected with the given value", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultSelected: false });

      expect(state.isSelected()).toBeFalsy();

      state.setSelected(true);

      expect(state.isSelected()).toBeTruthy();

      state.setSelected(false);

      expect(state.isSelected()).toBeFalsy();

      dispose();
    });
  });

  it("should not setSelected with the given value when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: false,
        isReadOnly: true
      });

      expect(state.isSelected()).toBeFalsy();

      state.setSelected(true);

      expect(state.isSelected()).toBeFalsy();

      dispose();
    });
  });

  it("should toggle isSelected state", () => {
    createRoot(dispose => {
      const state = createToggleState({ defaultSelected: false });

      expect(state.isSelected()).toBeFalsy();

      state.toggle();

      expect(state.isSelected()).toBeTruthy();

      state.toggle();

      expect(state.isSelected()).toBeFalsy();

      dispose();
    });
  });

  it("should not toggle isSelected state when is read only", () => {
    createRoot(dispose => {
      const state = createToggleState({
        defaultSelected: false,
        isReadOnly: true
      });

      expect(state.isSelected()).toBeFalsy();

      state.toggle();

      expect(state.isSelected()).toBeFalsy();

      dispose();
    });
  });
});
