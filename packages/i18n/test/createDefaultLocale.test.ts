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
