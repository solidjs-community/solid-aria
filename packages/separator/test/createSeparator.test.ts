import { createRoot } from "solid-js";

import { createSeparator } from "../src";

describe("createSeparator", () => {
  it("should have 'aria-orientation' set to horizontal by default", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "horizontal" });

      expect(separatorProps["aria-orientation"]).toBe("horizontal");

      dispose();
    }));

  it("should have 'aria-orientation' set to horizontal when orientation props is horizontal", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "horizontal" });

      expect(separatorProps["aria-orientation"]).toBe("horizontal");

      dispose();
    }));

  it("should have 'aria-orientation' set to vertical when orientation props is vertical", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ orientation: "vertical" });

      expect(separatorProps["aria-orientation"]).toBe("vertical");

      dispose();
    }));

  it("should have 'role=separator' when elementType is not <hr>", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ elementType: "span" });

      expect(separatorProps.role).toBe("separator");

      dispose();
    }));

  it("should not have 'role=separator' when elementType is <hr>", () =>
    createRoot(dispose => {
      const { separatorProps } = createSeparator({ elementType: "hr" });

      expect(separatorProps.role).toBeUndefined();

      dispose();
    }));
});
