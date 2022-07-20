import { Item } from "@solid-aria/collection";
import userEvent from "@testing-library/user-event";
import { For } from "solid-js";
import { fireEvent, render, screen, within } from "solid-testing-library";

import { states } from "./data";
import { Select } from "./example";

describe("createSelect", () => {
  const onSelectionChange = jest.fn();

  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => setTimeout(cb, 0));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

      expect(document.activeElement).toBe(listbox);
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

      console.log(document.activeElement?.tagName, listbox.tagName);

      expect(document.activeElement).toBe(listbox);
    });

    it("supports default open state", async () => {
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

      expect(document.activeElement).toBe(listbox);
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

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.click(document.body);
      await Promise.resolve();

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

    it("shift tabs to the previous element before the trigger and closes the menu", async () => {
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

      fireEvent.keyDown(document.activeElement!, { key: "Tab", shiftKey: true });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Tab", shiftKey: true });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(2);
      expect(onOpenChange).toHaveBeenCalledWith(false);

      expect(document.activeElement).toBe(screen.getByTestId("before-input"));
    });

    it("does not close in controlled open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" isOpen onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Select an option");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).toBeVisible();
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("closes in default open state", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" defaultOpen onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(onOpenChange).not.toBeCalled();

      const trigger = screen.getByLabelText("Select an option");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
      expect(trigger).toHaveAttribute("aria-controls", listbox.id);

      fireEvent.keyDown(listbox, { key: "Escape" });
      fireEvent.keyUp(listbox, { key: "Escape" });
      await Promise.resolve();
      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).not.toHaveAttribute("aria-controls");
      expect(onOpenChange).toBeCalledTimes(1);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("labeling", () => {
    it("focuses on the trigger when you click the label", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const label = screen.getAllByText("Test")[0];

      fireEvent.click(label);
      await Promise.resolve();

      const trigger = screen.getByRole("button");

      expect(document.activeElement).toBe(trigger);
    });

    it("supports labeling with a visible label", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");

      const label = screen.getAllByText("Test")[0];
      const value = screen.getByText("Select an option");

      expect(label).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `${label.id} ${value.id}`);

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", label.id);
    });

    it("supports labeling via aria-label", async () => {
      render(() => (
        <Select aria-label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Select an option");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "Test");
      expect(trigger).toHaveAttribute("aria-labelledby", `${trigger.id} ${value.id}`);

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", trigger.id);
    });

    it("supports labeling via aria-labelledby", async () => {
      render(() => (
        <Select aria-labelledby="foo" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Select an option");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${value.id}`);

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", "foo");
    });

    it("supports labeling via aria-label and aria-labelledby", async () => {
      render(() => (
        <Select aria-label="Test" aria-labelledby="foo" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      const value = screen.getByText("Select an option");

      expect(trigger).toHaveAttribute("id");
      expect(value).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-label", "Test");
      expect(trigger).toHaveAttribute("aria-labelledby", `foo ${trigger.id} ${value.id}`);

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", `foo ${trigger.id}`);
    });
  });

  describe("help text", () => {
    it("supports description", () => {
      render(() => (
        <Select
          label="Test"
          description="Please select an item."
          onSelectionChange={onSelectionChange}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      jest.runAllTimers();

      const trigger = screen.getByRole("button");
      const description = screen.getByText("Please select an item.");

      expect(description).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", description.id);
    });

    it("supports error message", () => {
      render(() => (
        <Select
          label="Test"
          errorMessage="Please select a valid item."
          validationState="invalid"
          onSelectionChange={onSelectionChange}
        >
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      jest.runAllTimers();

      const trigger = screen.getByRole("button");
      const errorMessage = screen.getByText("Please select a valid item.");

      expect(errorMessage).toHaveAttribute("id");
      expect(trigger).toHaveAttribute("aria-describedby", errorMessage.id);
    });
  });

  describe("selection", () => {
    it("can select items on press", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.click(items[2]);
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("three");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("can select items with falsy keys", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="">Empty</Item>
          <Item key={0}>Zero</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      let listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(2);
      expect(items[0]).toHaveTextContent("Empty");
      expect(items[1]).toHaveTextContent("Zero");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.click(items[0]);
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Empty");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      listbox = screen.getByRole("listbox");
      const item1 = within(listbox).getByText("Zero");

      fireEvent.click(item1);
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith(0);

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Zero");
    });

    it("can select items with the Space key", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement!, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: " " });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("two");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("can select items with the Enter key", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowUp" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("two");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("Two");
    });

    it.skip("focuses items on hover", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.mouseEnter(items[1]);
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("three");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("does not clear selection on escape closing the listbox", async () => {
      const onOpenChangeSpy = jest.fn();
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange} onOpenChange={onOpenChangeSpy}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Select an option");
      expect(onOpenChangeSpy).toHaveBeenCalledTimes(0);

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(1);

      let listbox = screen.getByRole("listbox");
      const label = screen.getAllByText("Test")[0];

      expect(listbox).toBeVisible();
      expect(listbox).toHaveAttribute("aria-labelledby", label.id);

      let item1 = within(listbox).getByText("One");
      const item2 = within(listbox).getByText("Two");
      const item3 = within(listbox).getByText("Three");

      expect(item1).toBeTruthy();
      expect(item2).toBeTruthy();
      expect(item3).toBeTruthy();

      fireEvent.click(item3);
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("listbox")).toBeNull();

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(3);

      listbox = screen.getByRole("listbox");
      item1 = within(listbox).getByText("One");

      fireEvent.keyDown(item1, { key: "Escape" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1); // still expecting it to have only been called once

      jest.runAllTimers();

      expect(onOpenChangeSpy).toHaveBeenCalledTimes(4);
      expect(screen.queryByRole("listbox")).toBeNull();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports controlled selection", async () => {
      render(() => (
        <Select label="Test" selectedKey="two" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[1]);

      expect(items[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("one");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("supports default selection", async () => {
      render(() => (
        <Select label="Test" defaultSelectedKey="two" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Two");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[1]);
      expect(items[1]).toHaveAttribute("aria-selected", "true");

      fireEvent.keyDown(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowUp" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("one");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("One");
    });

    it("skips disabled items", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange} disabledKeys={["two"]}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(3);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);
      expect(items[1]).toHaveAttribute("aria-disabled", "true");

      fireEvent.keyDown(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "ArrowDown" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("three");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Three");
    });

    it("supports type to select", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
          <Item key="">None</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      jest.runAllTimers();

      let listbox = screen.getByRole("listbox");
      let items = within(listbox).getAllByRole("option");

      expect(items.length).toBe(4);
      expect(items[0]).toHaveTextContent("One");
      expect(items[1]).toHaveTextContent("Two");
      expect(items[2]).toHaveTextContent("Three");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(listbox, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "t" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[1]);

      fireEvent.keyDown(listbox, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(listbox, { key: "h" });
      await Promise.resolve();

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("three");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("Three");

      jest.advanceTimersByTime(500);

      fireEvent.focus(trigger);
      await Promise.resolve();

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();
      jest.runAllTimers();

      listbox = screen.getByRole("listbox");
      items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[2]);

      fireEvent.keyDown(listbox, { key: "n" });
      await Promise.resolve();

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();
      expect(trigger).toHaveTextContent("None");
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith("");
    });

    it("does not deselect when pressing an already selected item", async () => {
      render(() => (
        <Select label="Test" defaultSelectedKey="two" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveTextContent("Two");

      fireEvent.click(trigger);
      await Promise.resolve();
      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");
      const items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[1]);

      fireEvent.click(items[1]);
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenCalledWith("two");

      jest.runAllTimers();

      expect(listbox).not.toBeInTheDocument();

      // run restore focus rAF
      jest.runAllTimers();

      expect(document.activeElement).toBe(trigger);
      expect(trigger).toHaveTextContent("Two");
    });

    it("move selection on Arrow-Left/Right", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      jest.runAllTimers();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveTextContent("One");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(trigger).toHaveTextContent("One");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(trigger).toHaveTextContent("Three");

      fireEvent.keyDown(trigger, { key: "ArrowRight" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(3);
      expect(trigger).toHaveTextContent("Three");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(4);
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "ArrowLeft" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(5);
      expect(trigger).toHaveTextContent("One");
    });
  });

  describe("type to select", () => {
    it("supports focusing items by typing letters in rapid succession without opening the menu", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("two");
      expect(trigger).toHaveTextContent("Two");

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(onSelectionChange).toHaveBeenLastCalledWith("three");
      expect(trigger).toHaveTextContent("Three");
    });

    it("resets the search text after a timeout", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("two");
      expect(trigger).toHaveTextContent("Two");

      jest.runAllTimers();

      fireEvent.keyDown(trigger, { key: "h" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "h" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(trigger).toHaveTextContent("Two");
    });

    it("wraps around when no items past the current one match", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");
      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(trigger).toHaveTextContent("Select an option");

      fireEvent.keyDown(trigger, { key: "t" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "t" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("two");
      expect(trigger).toHaveTextContent("Two");

      jest.runAllTimers();

      fireEvent.keyDown(trigger, { key: "o" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "o" });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(2);
      expect(trigger).toHaveTextContent("One");
    });
  });

  describe("autofill", () => {
    it("should have a hidden select element for form autocomplete", async () => {
      render(() => (
        <Select label="Test" autocomplete="address-level1" onSelectionChange={onSelectionChange}>
          <For each={states}>{item => <Item key={item.abbr}>{item.name}</Item>}</For>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      expect(trigger).toHaveTextContent("Select an option");

      const hiddenLabel = screen.getByText("Test", { selector: "label" });

      expect(hiddenLabel.tagName).toBe("LABEL");
      expect(hiddenLabel.parentElement).toHaveAttribute("aria-hidden", "true");

      // For anyone else who comes through this listbox/combobox path
      // I can't use combobox here because there is a size attribute on the html select
      // everything below this line is the path i followed to get to the correct role:
      //   not sure why i can't use listbox https://github.com/A11yance/aria-query#elements-to-roles
      //   however, i think this is correct based on https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
      //   which says "The listbox role is used for lists from which a user may select one or more items which are static and, unlike HTML <select> elements, may contain images."
      //   Also, this test in react testing library seems to indicate something about size which we do not currently have, probably a bug
      //   https://github.com/testing-library/dom-testing-library/blob/master/src/__tests__/element-queries.js#L548
      const hiddenSelect = screen.getByRole("listbox", { hidden: true });

      expect(hiddenSelect.parentElement).toBe(hiddenLabel);
      expect(hiddenSelect).toHaveAttribute("tabIndex", "-1");
      expect(hiddenSelect).toHaveAttribute("autocomplete", "address-level1");

      const options = within(hiddenSelect).getAllByRole("option", { hidden: true });

      expect(options.length).toBe(60);

      options.forEach(
        (option, index) => index > 0 && expect(option).toHaveTextContent(states[index - 1].name)
      );

      fireEvent.change(hiddenSelect, { target: { value: "CA" } });
      await Promise.resolve();

      expect(onSelectionChange).toHaveBeenCalledTimes(1);
      expect(onSelectionChange).toHaveBeenLastCalledWith("CA");
      expect(trigger).toHaveTextContent("California");
    });

    it.skip("should have a hidden input to marshall focus to the button", async () => {
      render(() => (
        <Select label="Test" onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const hiddenInput = screen.getByRole("textbox", { hidden: true }); // get the hidden ones

      expect(hiddenInput).toHaveAttribute("tabIndex", "0");
      expect(hiddenInput).toHaveAttribute("style", "font-size: 16px;");
      expect(hiddenInput.parentElement).toHaveAttribute("aria-hidden", "true");

      fireEvent.focus(hiddenInput);
      await Promise.resolve();

      const button = screen.getByRole("button");

      expect(document.activeElement).toBe(button);
      expect(hiddenInput).toHaveAttribute("tabIndex", "-1");

      fireEvent.blur(button);
      await Promise.resolve();

      expect(hiddenInput).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("disabled", () => {
    it("disables the hidden select when isDisabled is true", async () => {
      render(() => (
        <Select label="Test" isDisabled onSelectionChange={onSelectionChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      const select = screen.getByRole("textbox", { hidden: true });

      expect(select).toBeDisabled();
    });

    it("does not open on mouse down when isDisabled is true", async () => {
      const onOpenChange = jest.fn();

      render(() => (
        <Select label="Test" isDisabled onOpenChange={onOpenChange}>
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

      expect(screen.queryByRole("listbox")).toBeNull();

      expect(onOpenChange).toBeCalledTimes(0);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("does not open on Space key press when isDisabled is true", async () => {
      const onOpenChange = jest.fn();
      render(() => (
        <Select isDisabled label="Test" onOpenChange={onOpenChange}>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
        </Select>
      ));

      expect(screen.queryByRole("listbox")).toBeNull();

      const trigger = screen.getByRole("button");

      fireEvent.keyDown(trigger, { key: " " });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: " " });
      await Promise.resolve();

      jest.runAllTimers();

      expect(screen.queryByRole("listbox")).toBeNull();

      expect(onOpenChange).toBeCalledTimes(0);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(document.activeElement).not.toBe(trigger);
    });
  });

  describe("focus", () => {
    let focusSpies: any;

    beforeEach(() => {
      focusSpies = {
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onFocusChange: jest.fn()
      };
    });

    it.skip("supports autofocus", async () => {
      render(() => (
        <Select label="Test" {...focusSpies} autofocus>
          <Item key="one">One</Item>
          <Item key="two">Two</Item>
          <Item key="three">Three</Item>
          <Item key="">None</Item>
        </Select>
      ));

      const trigger = screen.getByRole("button");

      expect(document.activeElement).toBe(trigger);
      expect(focusSpies.onFocus).toHaveBeenCalled();
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);
    });

    it("calls onBlur and onFocus for the closed Select", async () => {
      jest.useRealTimers();

      render(() => (
        <>
          <button data-testid="before" />
          <Select data-testid="trigger" label="Test" {...focusSpies}>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Select>
          <button data-testid="after" />
        </>
      ));

      const beforeBtn = screen.getByTestId("before");
      const afterBtn = screen.getByTestId("after");
      const trigger = screen.getByTestId("trigger");

      trigger.focus();

      expect(document.activeElement).toBe(trigger);
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(1, true);

      await userEvent.tab();
      expect(document.activeElement).toBe(afterBtn);
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(2, false);

      await userEvent.tab({ shift: true });

      expect(document.activeElement).toBe(trigger);
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(3, true);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(beforeBtn);
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(4, false);

      jest.clearAllTimers();
      jest.useFakeTimers();
    });

    it.skip("calls onBlur and onFocus for the open Select", async () => {
      render(() => (
        <>
          <button data-testid="before" />
          <Select data-testid="trigger" label="Test" {...focusSpies}>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Select>
          <button data-testid="after" />
        </>
      ));

      const beforeBtn = screen.getByTestId("before");
      const afterBtn = screen.getByTestId("after");
      const trigger = screen.getByTestId("trigger");

      trigger.focus();

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      let listbox = screen.getByRole("listbox");
      expect(listbox).toBeVisible();

      let items = within(listbox).getAllByRole("option");
      expect(document.activeElement).toBe(items[0]);

      await userEvent.tab();
      expect(document.activeElement).toBe(afterBtn);
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(1);

      await userEvent.tab({ shift: true });
      expect(focusSpies.onFocus).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(1, true);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(2, false);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(3, true);

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      listbox = screen.getByRole("listbox");

      items = within(listbox).getAllByRole("option");
      expect(document.activeElement).toBe(items[0]);

      await userEvent.tab({ shift: true });
      expect(focusSpies.onBlur).toHaveBeenCalledTimes(2);
      expect(focusSpies.onFocusChange).toHaveBeenNthCalledWith(4, false);
      expect(document.activeElement).toBe(beforeBtn);
    });

    it("does not call blur when an item is selected", async () => {
      const otherButtonFocus = jest.fn();

      render(() => (
        <>
          <button data-testid="before" onFocus={otherButtonFocus} />
          <Select data-testid="trigger" label="Test" {...focusSpies}>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
            <Item key="">None</Item>
          </Select>
          <button data-testid="after" onFocus={otherButtonFocus} />
        </>
      ));

      const trigger = screen.getByTestId("trigger");

      fireEvent.focus(trigger);
      await Promise.resolve();

      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);

      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      fireEvent.keyUp(trigger, { key: "ArrowDown" });
      await Promise.resolve();

      jest.runAllTimers();

      const listbox = screen.getByRole("listbox");

      expect(listbox).toBeVisible();

      const items = within(listbox).getAllByRole("option");

      expect(document.activeElement).toBe(items[0]);

      fireEvent.keyDown(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      fireEvent.keyUp(document.activeElement!, { key: "Enter" });
      await Promise.resolve();

      expect(focusSpies.onFocus).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledTimes(1);
      expect(focusSpies.onFocusChange).toHaveBeenCalledWith(true);

      expect(focusSpies.onBlur).not.toHaveBeenCalled();
      expect(otherButtonFocus).not.toHaveBeenCalled();
    });
  });

  describe("form", () => {
    it("Should submit empty option by default", async () => {
      let value;

      const onSubmit = jest.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        value = Object.fromEntries(formData).trigger;
      });

      render(() => (
        <form data-testid="form" onSubmit={onSubmit}>
          <Select name="trigger" label="Test" autofocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
          </Select>
          <button type="submit" data-testid="submit">
            submit
          </button>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual("");
    });

    it("Should submit default option", async () => {
      let value;

      const onSubmit = jest.fn(e => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(formData);

        value = Object.fromEntries(formData).select;
      });

      render(() => (
        <form data-testid="form" onSubmit={onSubmit}>
          <Select defaultSelectedKey="one" name="select" label="Test" autofocus>
            <Item key="one">One</Item>
            <Item key="two">Two</Item>
            <Item key="three">Three</Item>
          </Select>
        </form>
      ));

      fireEvent.submit(screen.getByTestId("form"));
      await Promise.resolve();

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(value).toEqual("one");
    });
  });
});
