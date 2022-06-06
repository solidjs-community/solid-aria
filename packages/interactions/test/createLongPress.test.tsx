/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { combineProps } from "@solid-primitives/props";
import { createMemo, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { fireEvent, render, screen } from "solid-testing-library";

import { createLongPress, createPress } from "../src";
import { installPointerEvent } from "./test-utils";

function Example(props: any) {
  const [local, others] = splitProps(props, ["elementType"]);

  const { longPressProps } = createLongPress(others);

  return (
    <Dynamic component={local.elementType ?? "div"} {...longPressProps()} tabIndex="0">
      test
    </Dynamic>
  );
}

function ExampleWithPress(props: any) {
  const [local, others] = splitProps(props, [
    "elementType",
    "onPress",
    "onPressStart",
    "onPressEnd"
  ]);

  const { longPressProps } = createLongPress(others);

  const { pressProps } = createPress(local);

  const combinedProps = createMemo(() => combineProps(longPressProps(), pressProps()));

  return (
    <Dynamic component={local.elementType ?? "div"} {...combinedProps()} tabIndex="0">
      test
    </Dynamic>
  );
}

describe("createLongPress", function () {
  beforeAll(() => {
    jest.useFakeTimers("legacy");
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    jest.runAllTimers();
  });

  installPointerEvent();

  it("should perform a long press", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example onLongPressStart={addEvent} onLongPressEnd={addEvent} onLongPress={addEvent} />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);

    jest.advanceTimersByTime(400);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);

    jest.advanceTimersByTime(200);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);
  });

  it("should cancel if pointer ends before timeout", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example onLongPressStart={addEvent} onLongPressEnd={addEvent} onLongPress={addEvent} />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(200);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(800);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);
  });

  it("should cancel other press events", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <ExampleWithPress
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        onPressStart={addEvent}
        onPressEnd={addEvent}
        onPress={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "pressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "pressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);
  });

  it("should not cancel press events if pointer ends before timer", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <ExampleWithPress
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        onPressStart={addEvent}
        onPressEnd={addEvent}
        onPress={addEvent}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(300);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "pressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "pressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "press",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);
  });

  it("allows changing the threshold", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        threshold={800}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);

    jest.advanceTimersByTime(800);

    expect(events).toEqual([
      {
        type: "longpressstart",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpressend",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      },
      {
        type: "longpress",
        target: el,
        pointerType: "touch",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false
      }
    ]);
  });

  it("supports accessibilityDescription", () => {
    render(() => (
      <Example
        accessibilityDescription="Long press to open menu"
        onLongPress={() => {
          return;
        }}
      />
    ));

    const el = screen.getByText("test");
    expect(el).toHaveAttribute("aria-describedby");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const description = document.getElementById(el.getAttribute("aria-describedby")!);
    expect(description).toHaveTextContent("Long press to open menu");
  });

  it("does not show accessibilityDescription if disabled", () => {
    render(() => (
      <Example
        accessibilityDescription="Long press to open menu"
        onLongPress={() => {
          return;
        }}
        isDisabled
      />
    ));

    const el = screen.getByText("test");
    expect(el).not.toHaveAttribute("aria-describedby");
  });

  it("does not show accessibilityDescription if no onLongPress handler", () => {
    render(() => <Example accessibilityDescription="Long press to open menu" />);

    const el = screen.getByText("test");
    expect(el).not.toHaveAttribute("aria-describedby");
  });

  it("prevents context menu events on touch", async () => {
    render(() => (
      <Example
        onLongPress={() => {
          return;
        }}
      />
    ));

    const el = screen.getByText("test");
    fireEvent.pointerDown(el, { pointerType: "touch" });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    const performDefault = fireEvent.contextMenu(el);
    expect(performDefault).toBe(false);

    fireEvent.pointerUp(el, { pointerType: "touch" });
    await Promise.resolve();
  });

  it("should not fire any events for keyboard interactions", async () => {
    const events: any[] = [];
    const addEvent = (e: Event) => events.push(e);

    render(() => (
      <Example
        onLongPressStart={addEvent}
        onLongPressEnd={addEvent}
        onLongPress={addEvent}
        threshold={800}
      />
    ));

    const el = screen.getByText("test");

    fireEvent.keyDown(el, { key: " " });
    await Promise.resolve();

    jest.advanceTimersByTime(600);

    fireEvent.keyUp(el, { key: " " });
    await Promise.resolve();

    expect(events).toHaveLength(0);
  });
});
