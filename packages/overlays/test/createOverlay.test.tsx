import { combineProps } from "@solid-primitives/props";
import { createMemo } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createOverlay } from "../src";
import { installMouseEvent, installPointerEvent } from "../src/test-utils";

function noop() {
  return;
}

function Example(props: any) {
  let ref: any;
  const { overlayProps, underlayProps } = createOverlay(props, () => ref);

  const rootProps = createMemo(() => combineProps(underlayProps(), props.underlayProps || {}));

  return (
    <div {...rootProps}>
      <div ref={ref} {...overlayProps()} data-testid={props["data-testid"] || "test"}>
        {props.children}
      </div>
    </div>
  );
}

describe("createOverlay", () => {
  describe.each`
    type                | prepare                | actions
    ${"mouse events"}   | ${installMouseEvent}   | ${[(el: any) => fireEvent.mouseDown(el, { button: 0 }), (el: any) => fireEvent.mouseUp(el, { button: 0 })]}
    ${"pointer events"} | ${installPointerEvent} | ${[(el: any) => fireEvent.pointerDown(el, { button: 0, pointerId: 1 }), (el: any) => fireEvent.pointerUp(el, { button: 0, pointerId: 1 })]}
    ${"touch events"}   | ${noop}                | ${[(el: any) => fireEvent.touchStart(el, { changedTouches: [{ identifier: 1 }] }), (el: any) => fireEvent.touchEnd(el, { changedTouches: [{ identifier: 1 }] })]}
  `("$type", ({ actions: [pressStart, pressEnd], prepare }) => {
    prepare();

    // it("should not focus the overlay if a child is focused", async () => {
    //   render(() => (
    //     <Example isOpen>
    //       <input autofocus data-testid="input" />
    //     </Example>
    //   ));

    //   const input = screen.getByTestId("input");

    //   expect(document.activeElement).toBe(input);
    // });

    it("should hide the overlay when clicking outside if isDismissble is true", async () => {
      const onClose = jest.fn();

      render(() => <Example isOpen onClose={onClose} isDismissable />);

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should hide the overlay when clicking outside if shouldCloseOnInteractOutside returns true", async () => {
      const onClose = jest.fn();
      render(() => (
        <Example
          isOpen
          onClose={onClose}
          isDismissable
          shouldCloseOnInteractOutside={(target: any) => target === document.body}
        />
      ));

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not hide the overlay when clicking outside if shouldCloseOnInteractOutside returns false", async () => {
      const onClose = jest.fn();
      render(() => (
        <Example
          isOpen
          onClose={onClose}
          isDismissable
          shouldCloseOnInteractOutside={(target: any) => target !== document.body}
        />
      ));

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onClose).toHaveBeenCalledTimes(0);
    });

    it("should not hide the overlay when clicking outside if isDismissable is false", async () => {
      const onClose = jest.fn();
      render(() => <Example isOpen onClose={onClose} isDismissable={false} />);

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onClose).toHaveBeenCalledTimes(0);
    });

    it("should only hide the top-most overlay", async () => {
      const onCloseFirst = jest.fn();
      const onCloseSecond = jest.fn();

      render(() => <Example isOpen onClose={onCloseFirst} isDismissable />);
      const second = render(() => <Example isOpen onClose={onCloseSecond} isDismissable />);

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onCloseSecond).toHaveBeenCalledTimes(1);
      expect(onCloseFirst).not.toHaveBeenCalled();

      second.unmount();

      pressStart(document.body);
      await Promise.resolve();

      pressEnd(document.body);
      await Promise.resolve();

      expect(onCloseFirst).toHaveBeenCalledTimes(1);
    });
  });

  it("should hide the overlay when pressing the escape key", async () => {
    const onClose = jest.fn();
    render(() => <Example isOpen onClose={onClose} />);

    const el = screen.getByTestId("test");

    fireEvent.keyDown(el, { key: "Escape" });
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should still hide the overlay when pressing the escape key if isDismissable is false", async () => {
    const onClose = jest.fn();
    render(() => <Example isOpen onClose={onClose} isDismissable={false} />);

    const el = screen.getByTestId("test");

    fireEvent.keyDown(el, { key: "Escape" });
    await Promise.resolve();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("firefox bug", () => {
    installPointerEvent();

    it("should prevent default on pointer down on the underlay", async () => {
      let underlayRef: any;

      render(() => (
        <Example
          isOpen
          isDismissable
          underlayProps={{ ref: (el: Element) => (underlayRef = el) }}
        />
      ));

      const isPrevented = fireEvent.pointerDown(underlayRef, { button: 0, pointerId: 1 });
      await Promise.resolve();

      fireEvent.pointerUp(document.body);
      await Promise.resolve();

      expect(isPrevented).toBeFalsy(); // meaning the event had preventDefault called
    });
  });
});
