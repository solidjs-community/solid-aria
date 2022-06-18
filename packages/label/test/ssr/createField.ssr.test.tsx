import { renderToString } from "solid-js/web";

jest.mock("solid-js/web", () => ({
  ...jest.requireActual("solid-js/web"),
  template: jest.fn()
}));

describe("run on ssr", () => {
  it("has no window", () => {
    expect(typeof window).toBe("undefined");
  });

  it("renders string", () => {
    const string = renderToString(() => <div></div>);
    expect(string).toBe("<div></div>");
  });
});

export {};
