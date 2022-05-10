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
