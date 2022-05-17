import { render, screen } from "solid-testing-library";

import { createDialog } from "../src";

function Example(props: any) {
  let ref: any;
  const { dialogProps } = createDialog(props, () => ref);

  return (
    <div {...dialogProps()} ref={ref} data-testid="test">
      {props.children}
    </div>
  );
}

describe("createDialog", () => {
  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
  });

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

    const el = screen.getByTestId("test");

    expect(el).toHaveAttribute("tabIndex", "-1");

    expect(document.activeElement).toBe(el);
  });

  it("should not focus the overlay if something inside is auto focused", async () => {
    render(() => (
      <Example>
        <input data-testid="input" autofocus />
      </Example>
    ));

    const input = screen.getByTestId("input");

    expect(document.activeElement).toBe(input);
  });
});
