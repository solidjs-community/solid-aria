import { createRoot, onCleanup, onMount } from "solid-js";

import { useDefaultLocale } from "../src";

describe("useDefaultLocale", () => {
  it("should use en-US locale by default", () => {
    createRoot(dispose => {
      const locale = useDefaultLocale();

      expect(locale().locale).toBe("en-US");
      expect(locale().direction).toBe("ltr");

      dispose();
    });
  });

  it("should add and remove languagechange listener correctly", () => {
    createRoot(dispose => {
      jest.spyOn(window, "addEventListener").mock;
      jest.spyOn(window, "removeEventListener").mock;

      useDefaultLocale();

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
