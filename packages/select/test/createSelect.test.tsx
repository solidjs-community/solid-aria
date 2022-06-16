import { Item } from "@solid-aria/collection";
import { fireEvent, render, screen, within } from "solid-testing-library";

import { Select } from "./example";

describe("createSelect", () => {
  const onSelectionChange = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders correctly", () => {
    render(() => (
      <Select label="Test" data-testid="test" onSelectionChange={onSelectionChange}>
        <Item key="one">One</Item>
        <Item key="two">Two</Item>
        <Item key="three">Three</Item>
      </Select>
    ));

    // select is the native hidden <select>
    const select = screen.getByRole("textbox", { hidden: true });

    expect(select).not.toBeDisabled();

    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("data-testid", "test");

    const label = screen.getByTestId("label");
    const value = screen.getByTestId("value");

    expect(label).toBeVisible();
    expect(value).toBeVisible();
  });

  describe("opening", () => {
    it("can be opened on mouse down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on touch up", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.touchStart(trigger, { targetTouches: [{ identifier: 1 }] });
      await Promise.resolve();
      jest.runAllTimers();

      expect(screen.queryByRole("listbox")).toBeNull();

      fireEvent.touchEnd(trigger, { changedTouches: [{ identifier: 1, clientX: 0, clientY: 0 }] });
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on Space key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on Enter key down", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "Enter" });
      fireEvent.keyUp(trigger, { key: "Enter" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowDown key down and auto focuses the first item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("can be opened on ArrowUp key down and auto focuses the first item", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[2]);
    });

    it('can change item focus with arrow keys, even for item key=""', async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);
    });

    it("supports controlled open state", () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" data-testid="test" isOpen onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByTestId("test");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });

    it("supports default open state", function () {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" data-testid="test" defaultOpen onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByTestId("test");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
    });
  });

  describe("closing", () => {
    it("can be closed by clicking on the button", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.click(trigger);
      await Promise.resolve();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(trigger);
    });

    it.skip("can be closed by clicking outside", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.click(document.body);
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("can be closed by pressing the Escape key", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      await Promise.resolve();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(trigger);
    });

    it("closes on blur", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      (document.activeElement as HTMLElement).blur();
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).not.toBe(trigger);
    });

    it("tabs to the next element after the trigger and closes the menu", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <>
          <input data-testid="before-input" />
          <Select label="Test" onOpenChange={onOpenChange}>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
          </Select>
          <input data-testid="after-input" />
        </>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(document.activeElement!, { key: "Tab" });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(screen.getByTestId("after-input"));
    });
  });
});
