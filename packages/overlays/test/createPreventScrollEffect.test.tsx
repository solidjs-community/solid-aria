import { createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createPreventScrollEffect, PreventScrollOptions } from "../src";

function Example(props: PreventScrollOptions) {
  createPreventScrollEffect(props);
  return <div />;
}

describe("createPreventScrollEffect", function () {
  it("should set overflow: hidden on the body on mount and remove on unmount", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const res = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    res.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should work with nested modals", () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    const one = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const two = render(() => <Example />);
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    two.unmount();
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    one.unmount();
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });

  it("should remove overflow: hidden when isDisabled option is true", async () => {
    expect(document.documentElement).not.toHaveStyle("overflow: hidden");

    render(() => {
      const [isDisabled, setDisabled] = createSignal(false);
      return (
        <>
          <button onClick={() => setDisabled(true)}>Disable scroll lock</button>
          <Example isDisabled={isDisabled} />
        </>
      );
    });
    expect(document.documentElement).toHaveStyle("overflow: hidden");

    const disableButton = screen.getByRole("button");

    fireEvent.click(disableButton);
    await Promise.resolve();

    expect(document.documentElement).not.toHaveStyle("overflow: hidden");
  });
});
