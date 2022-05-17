import { render, screen } from "solid-testing-library";

import { DismissButton } from "../src";

describe("DismissButton", () => {
  it("should have a default aria-label", () => {
    render(() => <DismissButton />);

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-label", "Dismiss");
  });

  it("should accept an aria-label", () => {
    render(() => <DismissButton aria-label="foo" />);

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-label", "foo");
  });

  it("should accept an aria-labelledby", () => {
    render(() => (
      <>
        <span id="span-id">bar</span>
        <DismissButton aria-labelledby="span-id" />
      </>
    ));

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-labelledby", "span-id");
    expect(button).not.toHaveAttribute("aria-label");
  });

  it("should accept an aria-labelledby and aria-label", () => {
    render(() => (
      <>
        <span id="span-id">bar</span>
        <DismissButton aria-labelledby="span-id" aria-label="foo" id="self" />
      </>
    ));

    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-labelledby", "span-id self");
    expect(button).toHaveAttribute("aria-label", "foo");
  });
});
