import { createRoot } from "solid-js";

import { createPrimitiveTemplate } from "../src";

describe("createPrimitiveTemplate", () => {
  it("should return values", () => {
    createRoot(dispose => {
      const [value, setValue] = createPrimitiveTemplate(true);

      expect(value()).toBeTruthy();

      setValue(false);

      expect(value()).toBeFalsy();

      dispose();
    });
  });
});
