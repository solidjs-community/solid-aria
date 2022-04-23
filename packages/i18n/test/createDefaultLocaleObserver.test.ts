import { createRoot, onCleanup, onMount } from "solid-js";

import { createDefaultLocaleObserver } from "../src";

describe("createDefaultLocaleObserver", () => {
  it("should use en-US locale by default", () => {
    createRoot(dispose => {
      const locale = createDefaultLocaleObserver();

      expect(locale().locale).toBe("en-US");
      expect(locale().direction).toBe("ltr");

      dispose();
    });
  });

  it("should add and remove languagechange listener correctly", () => {
    createRoot(dispose => {
      jest.spyOn(window, "addEventListener").mock;
      jest.spyOn(window, "removeEventListener").mock;

      createDefaultLocaleObserver();

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
