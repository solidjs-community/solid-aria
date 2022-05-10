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
