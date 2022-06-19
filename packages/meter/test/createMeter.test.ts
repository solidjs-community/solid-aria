import { createRoot } from "solid-js";

import { createMeter } from "../src";

describe("createMeter", () => {
  it("should have 'role=meter progressbar'", () => {
    createRoot(dispose => {
      const { meterProps } = createMeter();

      expect(meterProps.role).toBe("meter progressbar");
      dispose();
    });
  });
});
