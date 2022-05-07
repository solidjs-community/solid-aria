import { Dynamic } from "solid-js/web";
import { fireEvent, render, screen } from "solid-testing-library";

import { createPress, CreatePressProps } from "../src";
import { installPointerEvent } from "../src/test-utils";

function Example(
  props: CreatePressProps & { elementType?: string; style?: any; draggable?: boolean }
) {
  let ref: any;

  const { pressProps } = createPress(props, () => ref);

  return (
    <Dynamic
      {...pressProps()}
      ref={ref}
      component={props.elementType ?? "div"}
      style={props.style}
      tabIndex="0"
      draggable={props.draggable}
    >
      test
    </Dynamic>
  );
}

function pointerEvent(type: any, opts: any) {
  const evt = new Event(type, { bubbles: true, cancelable: true });
  Object.assign(
    evt,
    {
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
      button: opts.button || 0,
      width: 1,
      height: 1
    },
    opts
  );
  return evt;
}

describe("createPress", () => {
  beforeAll(() => {
    jest.useFakeTimers("legacy");
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => jest.runAllTimers());

  // TODO: JSDOM doesn't yet support pointer events. Once they do, convert these tests.
  // https://github.com/jsdom/jsdom/issues/2527
  describe("pointer events", function () {
    installPointerEvent();

    it("should fire press events based on pointer events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 0,
          clientY: 0
        })
      );
      await Promise.resolve();

      // How else to get the DOM node it renders the hook to?
      // let el = events[0].target;
      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: true
        },
        {
          type: "pressup",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: false
        },
        {
          type: "press",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        }
      ]);
    });

    it("should fire press change events when moving pointer outside target", async () => {
      let events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onPressStart={addEvent}
          onPressEnd={addEvent}
          onPressChange={pressed => addEvent({ type: "presschange", pressed })}
          onPress={addEvent}
          onPressUp={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointerup", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointermove", { pointerId: 1, pointerType: "mouse", clientX: 0, clientY: 0 })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: true
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: false
        }
      ]);

      events = [];

      fireEvent(el, pointerEvent("pointerdown", { pointerId: 1, pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointermove", {
          pointerId: 1,
          pointerType: "mouse",
          clientX: 100,
          clientY: 100
        })
      );
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointermove", { pointerId: 1, pointerType: "mouse", clientX: 0, clientY: 0 })
      );
      await Promise.resolve();

      fireEvent(
        el,
        pointerEvent("pointerup", { pointerId: 1, pointerType: "mouse", clientX: 0, clientY: 0 })
      );
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: true
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: false
        },
        {
          type: "pressstart",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: true
        },
        {
          type: "pressup",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "pressend",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        },
        {
          type: "presschange",
          pressed: false
        },
        {
          type: "press",
          target: el,
          pointerType: "mouse",
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          altKey: false
        }
      ]);
    });

    // it("", async () => {});
  });
});
