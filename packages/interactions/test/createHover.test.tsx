/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createSignal } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createHover, CreateHoverProps } from "../src";
import { installPointerEvent } from "../src/test-utils";

function Example(props: CreateHoverProps) {
  const { hoverProps, isHovered } = createHover(props);
  return (
    <div {...hoverProps()}>
      test{isHovered() && "-hovered"}
      <div data-testid="inner-target" />
    </div>
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
      button: opts.button || 0
    },
    opts
  );
  return evt;
}

describe("createHover", () => {
  beforeAll(() => {
    jest.useFakeTimers("legacy");
  });

  it("does not handle hover events if disabled", async () => {
    const events: any[] = [];
    const addEvent = (e: any) => events.push(e);

    render(() => (
      <Example
        isDisabled
        onHoverEnd={addEvent}
        onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        onHoverStart={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.mouseEnter(el);
    await Promise.resolve();

    fireEvent.mouseLeave(el);
    await Promise.resolve();

    expect(events).toEqual([]);
  });

  describe("pointer events", () => {
    installPointerEvent();

    it("should fire hover events based on pointer events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        },
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);
    });

    it("hover event target should be the same element we attached listeners to even if we hover over inner elements", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");
      const inner = screen.getByTestId("inner-target");

      fireEvent(inner, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(inner, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        },
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);
    });

    it("should not fire hover events when pointerType is touch", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "touch" }));
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("ignores emulated mouse events following touch events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerdown", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerup", { pointerType: "touch" }));
      await Promise.resolve();

      // Safari on iOS has a bug that fires a pointer event with pointerType="mouse" on focus.
      // See https://bugs.webkit.org/show_bug.cgi?id=214609.
      fireEvent(el, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("ignores supports mouse events following touch events after a delay", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerdown", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "touch" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerup", { pointerType: "touch" }));
      await Promise.resolve();

      jest.advanceTimersByTime(100);

      // Safari on iOS has a bug that fires a pointer event with pointerType="mouse" on focus.
      // See https://bugs.webkit.org/show_bug.cgi?id=214609.
      fireEvent(el, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        },
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);
    });

    it("should visually change component with pointer events", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(el.textContent).toBe("test-hovered");

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(el.textContent).toBe("test");
    });

    it("should not visually change component when pointerType is touch", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "touch" }));
      await Promise.resolve();

      expect(el.textContent).toBe("test");

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "touch" }));
      await Promise.resolve();

      expect(el.textContent).toBe("test");
    });

    it("should end hover when disabled", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      function Example(props: CreateHoverProps) {
        const { hoverProps, isHovered } = createHover(props);
        return (
          <div {...hoverProps()}>
            test{isHovered() && "-hovered"}
            <div data-testid="inner-target" />
          </div>
        );
      }

      function Wrapper() {
        const [isDisabled, setIsDisabled] = createSignal(false);
        return (
          <div>
            <Example
              isDisabled={isDisabled()}
              onHoverStart={addEvent}
              onHoverEnd={addEvent}
              onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
            />
            <button data-testid="disable-button" onClick={() => setIsDisabled(true)}>
              Disable
            </button>
          </div>
        );
      }

      render(() => <Wrapper />);

      let el = screen.getByText("test");

      fireEvent(el, pointerEvent("pointerenter", { pointerType: "mouse" }));
      await Promise.resolve();

      expect(el.textContent).toBe("test-hovered");
      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        }
      ]);
      events.pop();
      events.pop();

      const disableButton = screen.getByTestId("disable-button");

      fireEvent.click(disableButton);
      await Promise.resolve();

      el = screen.getByText("test");

      expect(el.textContent).toBe("test");
      expect(events).toEqual([
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);

      fireEvent(el, pointerEvent("pointerleave", { pointerType: "mouse" }));
      await Promise.resolve();
    });
  });

  describe("mouse events", () => {
    it("should fire hover events based on mouse events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
          onHoverStart={addEvent}
        />
      ));

      const el = screen.getByText("test");

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        },
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);
    });

    it("should visually change component with mouse events", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test-hovered");

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");
    });

    it("ignores emulated mouse events following touch events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");
      fireEvent.touchStart(el);
      await Promise.resolve();

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      fireEvent.touchEnd(el);
      await Promise.resolve();

      // Safari on iOS has a bug that fires a mouse event on focus.
      // See https://bugs.webkit.org/show_bug.cgi?id=214609.
      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("ignores supports mouse events following touch events after a delay", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverStart={addEvent}
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
        />
      ));

      const el = screen.getByText("test");
      fireEvent.touchStart(el);
      await Promise.resolve();

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      fireEvent.touchEnd(el);
      await Promise.resolve();

      jest.advanceTimersByTime(100);

      // Safari on iOS has a bug that fires a mouse event on focus.
      // See https://bugs.webkit.org/show_bug.cgi?id=214609.
      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        },
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);
    });

    it("should end hover when disabled", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      function Example(props: CreateHoverProps) {
        const { hoverProps, isHovered } = createHover(props);
        return (
          <div {...hoverProps()}>
            test{isHovered() && "-hovered"}
            <div data-testid="inner-target" />
          </div>
        );
      }

      function Wrapper() {
        const [isDisabled, setIsDisabled] = createSignal(false);
        return (
          <div>
            <Example
              isDisabled={isDisabled()}
              onHoverStart={addEvent}
              onHoverEnd={addEvent}
              onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
            />
            <button data-testid="disable-button" onClick={() => setIsDisabled(true)}>
              Disable
            </button>
          </div>
        );
      }

      render(() => <Wrapper />);

      let el = screen.getByText("test");

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test-hovered");
      expect(events).toEqual([
        {
          type: "hoverstart",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: true
        }
      ]);
      events.pop();
      events.pop();

      const disableButton = screen.getByTestId("disable-button");

      fireEvent.click(disableButton);
      await Promise.resolve();

      el = screen.getByText("test");

      expect(el.textContent).toBe("test");
      expect(events).toEqual([
        {
          type: "hoverend",
          target: el,
          pointerType: "mouse"
        },
        {
          type: "hoverchange",
          isHovering: false
        }
      ]);

      fireEvent.mouseLeave(el);
      await Promise.resolve();
    });
  });

  describe("touch events", () => {
    it("should not fire hover events based on touch events", async () => {
      const events: any[] = [];
      const addEvent = (e: any) => events.push(e);

      render(() => (
        <Example
          onHoverEnd={addEvent}
          onHoverChange={isHovering => addEvent({ type: "hoverchange", isHovering })}
          onHoverStart={addEvent}
        />
      ));

      const el = screen.getByText("test");
      fireEvent.touchStart(el);
      await Promise.resolve();

      fireEvent.touchMove(el);
      await Promise.resolve();

      fireEvent.touchEnd(el);
      await Promise.resolve();

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(events).toEqual([]);
    });

    it("should not visually change component with touch events", async () => {
      render(() => <Example />);

      const el = screen.getByText("test");

      fireEvent.touchStart(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");

      fireEvent.touchMove(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");

      fireEvent.touchEnd(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");

      fireEvent.mouseEnter(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");

      fireEvent.mouseLeave(el);
      await Promise.resolve();

      expect(el.textContent).toBe("test");
    });
  });
});
