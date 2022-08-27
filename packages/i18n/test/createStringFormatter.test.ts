import { createStringFormatter } from "../src";

describe("createStringFormatter", () => {
  it("should format", () => {
    const stringFormatter = createStringFormatter({
      "en-US": {
        back: "Back",
        next: "Next"
      }
    });

    expect(typeof stringFormatter).toBe("function");

    const formattedStr = stringFormatter().format("back");

    expect(formattedStr).toBe("Back");
  });
});
