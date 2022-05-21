import { createRoot } from "solid-js";

import { createBreadcrumbItem } from "../src";

describe("createBreadcrumbItem", () => {
  it("handles span elements", () => {
    createRoot(dispose => {
      const ref = document.createElement("span");
      const { itemProps } = createBreadcrumbItem({ elementType: "span" }, () => ref);

      expect(itemProps().tabIndex).toBe(0);
      expect(itemProps().role).toBe("link");
      expect(itemProps()["aria-disabled"]).toBeUndefined();
      expect(typeof itemProps().onKeyDown).toBe("function");

      dispose();
    });
  });

  it("handles isCurrent", () => {
    createRoot(dispose => {
      const ref = document.createElement("span");
      const { itemProps } = createBreadcrumbItem(
        { elementType: "span", isCurrent: true },
        () => ref
      );

      expect(itemProps().tabIndex).toBeUndefined();
      expect(itemProps().role).toBe("link");
      expect(itemProps()["aria-current"]).toBe("page");

      dispose();
    });
  });

  it("handles isDisabled", () => {
    createRoot(dispose => {
      const ref = document.createElement("span");
      const { itemProps } = createBreadcrumbItem(
        { elementType: "span", isDisabled: true },
        () => ref
      );

      expect(itemProps().tabIndex).toBeUndefined();
      expect(itemProps().role).toBe("link");
      expect(itemProps()["aria-disabled"]).toBe(true);

      dispose();
    });
  });
});
