import { fireEvent, render, screen } from "solid-testing-library";

import { createInteractOutside } from "../src";
import { installPointerEvent } from "../src/test-utils";

function Example(props: any) {
  let ref: any;

  createInteractOutside(props, () => ref);

  return <div ref={ref}>test</div>;
}

function pointerEvent(type: any, opts?: any) {
  const evt = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(evt, opts);
  return evt;
}

describe("createInteractOutside", () => {
  // TODO: JSDOM doesn't yet support pointer events. Once they do, convert these tests.
  // https://github.com/jsdom/jsdom/issues/2527
  describe("pointer events", () => {
    installPointerEvent();

    it("should fire interact outside events based on pointer events", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerdown"));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerup"));
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent(document.body, pointerEvent("pointerdown"));
      await Promise.resolve();

      fireEvent(document.body, pointerEvent("pointerup"));
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should only listen for the left mouse button", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      fireEvent(document.body, pointerEvent("pointerdown", { button: 1 }));
      await Promise.resolve();

      fireEvent(document.body, pointerEvent("pointerup", { button: 1 }));
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent(document.body, pointerEvent("pointerdown", { button: 0 }));
      await Promise.resolve();

      fireEvent(document.body, pointerEvent("pointerup", { button: 0 }));
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should not fire interact outside if there is a pointer up event without a pointer down first", async () => {
      // Fire pointer down before component with useInteractOutside is mounted
      fireEvent(document.body, pointerEvent("pointerdown"));
      await Promise.resolve();

      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      fireEvent(document.body, pointerEvent("pointerup"));
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });
  });

  describe("mouse events", () => {
    it("should fire interact outside events based on mouse events", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      const el = screen.getByText("test");

      fireEvent.mouseDown(el);
      await Promise.resolve();

      fireEvent.mouseUp(el);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent.mouseDown(document.body);
      await Promise.resolve();

      fireEvent.mouseUp(document.body);
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should only listen for the left mouse button", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      fireEvent.mouseDown(document.body, { button: 1 });
      await Promise.resolve();

      fireEvent.mouseUp(document.body, { button: 1 });
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent.mouseDown(document.body, { button: 0 });
      await Promise.resolve();

      fireEvent.mouseUp(document.body, { button: 0 });
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should not fire interact outside if there is a mouse up event without a mouse down first", async () => {
      // Fire mouse down before component with useInteractOutside is mounted
      fireEvent.mouseDown(document.body);
      await Promise.resolve();

      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      fireEvent.mouseUp(document.body);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });
  });

  describe("touch events", () => {
    it("should fire interact outside events based on mouse events", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      const el = screen.getByText("test");

      fireEvent.touchStart(el);
      await Promise.resolve();

      fireEvent.touchEnd(el);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent.touchStart(document.body);
      await Promise.resolve();

      fireEvent.touchEnd(document.body);
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should ignore emulated mouse events", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      const el = screen.getByText("test");

      fireEvent.touchStart(el);
      await Promise.resolve();

      fireEvent.touchEnd(el);
      await Promise.resolve();

      fireEvent.mouseUp(el);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();

      fireEvent.touchStart(document.body);
      await Promise.resolve();

      fireEvent.touchEnd(document.body);
      await Promise.resolve();

      fireEvent.mouseUp(document.body);
      await Promise.resolve();

      expect(onInteractOutside).toHaveBeenCalledTimes(1);
    });

    it("should not fire interact outside if there is a touch end event without a touch start first", async () => {
      // Fire mouse down before component with useInteractOutside is mounted
      fireEvent.touchStart(document.body);
      await Promise.resolve();

      const onInteractOutside = jest.fn();
      render(() => <Example onInteractOutside={onInteractOutside} />);

      fireEvent.touchEnd(document.body);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });
  });

  describe("disable interact outside events", () => {
    it("does not handle pointer events if disabled", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example isDisabled onInteractOutside={onInteractOutside} />);

      fireEvent(document.body, pointerEvent("mousedown"));
      await Promise.resolve();

      fireEvent(document.body, pointerEvent("mouseup"));
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });

    it("does not handle touch events if disabled", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example isDisabled onInteractOutside={onInteractOutside} />);

      fireEvent.touchStart(document.body);
      await Promise.resolve();

      fireEvent.touchEnd(document.body);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });

    it("does not handle mouse events if disabled", async () => {
      const onInteractOutside = jest.fn();
      render(() => <Example isDisabled onInteractOutside={onInteractOutside} />);

      fireEvent.mouseDown(document.body);
      await Promise.resolve();

      fireEvent.mouseUp(document.body);
      await Promise.resolve();

      expect(onInteractOutside).not.toHaveBeenCalled();
    });
  });
});
