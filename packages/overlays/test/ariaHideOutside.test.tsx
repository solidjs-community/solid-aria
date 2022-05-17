import { createSignal, Show } from "solid-js";
import { fireEvent, render, screen, waitFor } from "solid-testing-library";

import { ariaHideOutside } from "../src";

describe("ariaHideOutside", () => {
  it("should hide everything except the provided element [button]", () => {
    render(() => (
      <>
        <input type="checkbox" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should hide everything except multiple elements", () => {
    render(() => (
      <>
        <input type="checkbox" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside(checkboxes);

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAttribute("aria-hidden");

    expect(screen.queryAllByRole("checkbox")).not.toBeNull();
    expect(screen.queryByRole("button")).toBeNull();

    revert();

    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should not traverse into an already hidden container", () => {
    render(() => (
      <>
        <div>
          <input type="checkbox" />
        </div>
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    const checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes[0].parentElement).toHaveAttribute("aria-hidden", "true");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    expect(checkboxes[0].parentElement).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should not overwrite an existing aria-hidden prop", () => {
    render(() => (
      <>
        <input type="checkbox" aria-hidden="true" />
        <button>Button</button>
        <input type="checkbox" />
      </>
    ));

    let checkboxes = screen.getAllByRole("checkbox");
    const button = screen.getByRole("button");

    const revert = ariaHideOutside([button]);

    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).toHaveAttribute("aria-hidden", "true");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert();

    checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(1);
    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(button).not.toHaveAttribute("aria-hidden");

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should handle when a new element is added outside while active", async () => {
    function Test() {
      const [show, setShow] = createSignal(false);

      return (
        <>
          <Show when={show()}>
            <input type="checkbox" />
          </Show>
          <button data-testid="button">Button</button>
          <Show when={show()}>
            <input type="checkbox" />
          </Show>
          <button data-testid="toggle-show-button" onClick={() => setShow(prev => !prev)}></button>
        </>
      );
    }

    render(() => <Test />);

    const button = screen.getByTestId("button");

    const toggleShowButton = screen.getByTestId("toggle-show-button");

    expect(() => screen.getAllByRole("checkbox")).toThrow();

    const revert = ariaHideOutside([button]);

    fireEvent.click(toggleShowButton);
    await Promise.resolve();

    // MutationObserver is async
    await waitFor(() => expect(() => screen.getAllByRole("checkbox")).toThrow());
    expect(() => screen.getByTestId("button")).not.toThrow();

    revert();

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle when a new element is added to an already hidden container", async () => {
    function Test() {
      const [show, setShow] = createSignal(false);

      return (
        <>
          <div data-testid="test">
            <Show when={show()}>
              <input type="checkbox" />
            </Show>
          </div>
          <button data-testid="button">Button</button>
          <Show when={show()}>
            <input type="checkbox" />
          </Show>
          <button data-testid="toggle-show-button" onClick={() => setShow(prev => !prev)}></button>
        </>
      );
    }

    render(() => <Test />);

    const button = screen.getByTestId("button");
    const test = screen.getByTestId("test");

    const toggleShowButton = screen.getByTestId("toggle-show-button");

    expect(() => screen.getAllByRole("checkbox")).toThrow();

    const revert = ariaHideOutside([button]);

    expect(test).toHaveAttribute("aria-hidden");

    fireEvent.click(toggleShowButton);
    await Promise.resolve();

    // MutationObserver is async
    await waitFor(() => expect(() => screen.getAllByRole("checkbox")).toThrow());
    expect(() => screen.getByTestId("button")).not.toThrow();

    const checkboxes = screen.getAllByRole("checkbox", { hidden: true });
    expect(test).toHaveAttribute("aria-hidden");
    expect(checkboxes[0]).not.toHaveAttribute("aria-hidden");
    expect(checkboxes[1]).toHaveAttribute("aria-hidden", "true");

    revert();

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("should handle when a new element is added inside a target element", async () => {
    function Test() {
      const [show, setShow] = createSignal(false);

      return (
        <>
          <input type="checkbox" />
          <div data-testid="test">
            <button data-testid="button">Button</button>
            <Show when={show()}>
              <input type="radio" />
            </Show>
          </div>
          <input type="checkbox" />
          <button data-testid="toggle-show-button" onClick={() => setShow(prev => !prev)}></button>
        </>
      );
    }

    render(() => <Test />);

    const toggleShowButton = screen.getByTestId("toggle-show-button");

    const test = screen.getByTestId("test");
    const revert = ariaHideOutside([test]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(screen.queryByRole("radio")).toBeNull();
    expect(screen.queryByTestId("button")).not.toBeNull();
    expect(() => screen.getByTestId("test")).not.toThrow();

    fireEvent.click(toggleShowButton);
    await Promise.resolve();

    // Wait for mutation observer tick
    await Promise.resolve();
    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getByRole("radio")).not.toThrow();
    expect(() => screen.getByTestId("button")).not.toThrow();
    expect(() => screen.getByTestId("test")).not.toThrow();

    revert();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getByRole("radio")).not.toThrow();
    expect(() => screen.getByTestId("button")).not.toThrow();
    expect(() => screen.getByTestId("test")).not.toThrow();
  });

  it("work when called multiple times", () => {
    render(() => (
      <>
        <input type="checkbox" />
        <input type="radio" />
        <button>Button</button>
        <input type="radio" />
        <input type="checkbox" />
      </>
    ));

    const radios = screen.getAllByRole("radio");
    const button = screen.getByRole("button");

    const revert1 = ariaHideOutside([button, ...radios]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    const revert2 = ariaHideOutside([button]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert2();

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert1();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("work when called multiple times and restored out of order", () => {
    render(() => (
      <>
        <input type="checkbox" />
        <input type="radio" />
        <button>Button</button>
        <input type="radio" />
        <input type="checkbox" />
      </>
    ));

    const radios = screen.getAllByRole("radio");
    const button = screen.getByRole("button");

    const revert1 = ariaHideOutside([button, ...radios]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    const revert2 = ariaHideOutside([button]);

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert1();

    expect(() => screen.getAllByRole("checkbox")).toThrow();
    expect(() => screen.getAllByRole("radio")).toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();

    revert2();

    expect(() => screen.getAllByRole("checkbox")).not.toThrow();
    expect(() => screen.getAllByRole("radio")).not.toThrow();
    expect(() => screen.getByRole("button")).not.toThrow();
  });

  it("should hide everything except the provided element [row]", () => {
    render(() => (
      <div role="grid">
        <div role="row">
          <div role="gridcell">Cell 1</div>
        </div>
        <div role="row">
          <div role="gridcell">Cell 2</div>
        </div>
      </div>
    ));

    const cells = screen.getAllByRole("gridcell");
    const rows = screen.getAllByRole("row");

    const revert = ariaHideOutside([rows[1]]);

    expect(rows[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[0]).toHaveAttribute("aria-hidden", "true");
    expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");

    revert();

    expect(rows[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[0]).not.toHaveAttribute("aria-hidden", "true");
    expect(rows[1]).not.toHaveAttribute("aria-hidden", "true");
    expect(cells[1]).not.toHaveAttribute("aria-hidden", "true");
  });
});
