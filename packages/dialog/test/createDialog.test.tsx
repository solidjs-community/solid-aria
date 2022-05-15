import { render, screen } from "solid-testing-library";

import { createDialog } from "../src";

function Example(props: any) {
  let ref: any;
  const { dialogProps } = createDialog(props, () => ref);

  return (
    <div ref={ref} {...dialogProps()} data-testid="test">
      {props.children}
    </div>
  );
}

describe("createDialog", () => {
  it('should have role="dialog" by default', () => {
    render(() => <Example />);

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("role", "dialog");
  });

  it('should accept role="alertdialog"', () => {
    render(() => <Example role="alertdialog" />);

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("role", "alertdialog");
  });

  it("should focus the overlay on mount", async () => {
    render(() => <Example />);

    // wait for dialog microtask to end
    await Promise.resolve();

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("tabIndex", "-1");

    expect(document.activeElement).toBe(el);
  });

  /*
  it("should not focus the overlay if something inside is auto focused", async () => {
    render(() => (
      <Example>
        <input data-testid="input" autofocus />
      </Example>
    ));

    await Promise.resolve();

    const input = screen.getByTestId("input");

    expect(document.activeElement).toBe(input);
  });
  */
});
