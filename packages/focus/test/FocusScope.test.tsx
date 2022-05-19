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

import userEvent from "@testing-library/user-event";
import { createSignal, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { fireEvent, render, screen, waitFor } from "solid-testing-library";

import { FocusScope, useFocusManager } from "../src";

describe("FocusScope", () => {
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

  describe("focus containment", () => {
    it("should contain focus within the scope", async () => {
      render(() => (
        <FocusScope contain>
          <input data-testid="input1" />
          <input data-testid="input2" />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const input3 = screen.getByTestId("input3");

      input1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();
      expect(document.activeElement).toBe(input2);

      await userEvent.tab();
      expect(document.activeElement).toBe(input3);

      await userEvent.tab();
      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input3);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input2);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input1);
    });

    it("should work with nested elements", async () => {
      render(() => (
        <FocusScope contain>
          <input data-testid="input1" />
          <div>
            <input data-testid="input2" />
            <div>
              <input data-testid="input3" />
            </div>
          </div>
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const input3 = screen.getByTestId("input3");

      input1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();
      expect(document.activeElement).toBe(input2);

      await userEvent.tab();
      expect(document.activeElement).toBe(input3);

      await userEvent.tab();
      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input3);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input2);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input1);
    });

    it("should skip non-tabbable elements", async () => {
      render(() => (
        <FocusScope contain>
          <input data-testid="input1" />
          <div />
          <input data-testid="input2" />
          <input data-testid="hiddenInput1" hidden />
          <input style={{ display: "none" }} />
          <input style={{ visibility: "hidden" }} />
          <input style={{ visibility: "collapse" }} />
          <div tabIndex={-1} />
          <input disabled tabIndex={0} />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const input3 = screen.getByTestId("input3");

      input1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();
      expect(document.activeElement).toBe(input2);

      await userEvent.tab();
      expect(document.activeElement).toBe(input3);

      await userEvent.tab();
      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input3);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input2);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input1);
    });

    it("should do nothing if a modifier key is pressed", async () => {
      render(() => (
        <FocusScope contain>
          <input data-testid="input1" />
          <input data-testid="input2" />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");

      input1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      fireEvent.keyDown(document.activeElement!, { key: "Tab", altKey: true });
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);
    });

    it("should work with multiple focus scopes", async () => {
      render(() => (
        <div>
          <FocusScope contain>
            <input data-testid="input1" />
            <input data-testid="input2" />
            <input style={{ display: "none" }} />
            <input style={{ visibility: "hidden" }} />
            <input style={{ visibility: "collapse" }} />
            <input data-testid="input3" />
          </FocusScope>
          <FocusScope contain>
            <input data-testid="input4" />
            <input data-testid="input5" />
            <input style={{ display: "none" }} />
            <input style={{ visibility: "hidden" }} />
            <input style={{ visibility: "collapse" }} />
            <input data-testid="input6" />
          </FocusScope>
        </div>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const input3 = screen.getByTestId("input3");
      const input4 = screen.getByTestId("input4");

      input1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();
      expect(document.activeElement).toBe(input2);

      await userEvent.tab();
      expect(document.activeElement).toBe(input3);

      await userEvent.tab();
      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input3);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input2);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(input1);

      input4.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);
    });

    it("should restore focus to the last focused element in the scope when re-entering the browser", async () => {
      render(() => (
        <div>
          <input data-testid="outside" />
          <FocusScope contain>
            <input data-testid="input1" />
            <input data-testid="input2" />
            <input data-testid="input3" />
          </FocusScope>
        </div>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");
      const outside = screen.getByTestId("outside");

      input1.focus();
      await Promise.resolve();

      fireEvent.focusIn(input1); // jsdom doesn't fire this automatically
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();

      fireEvent.focusIn(input2);
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      input2.blur();
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      outside.focus();
      await Promise.resolve();

      fireEvent.focusIn(outside);
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);
    });

    it("should restore focus to the last focused element in the scope on focus out", async () => {
      render(() => (
        <div>
          <FocusScope contain>
            <input data-testid="input1" />
            <input data-testid="input2" />
          </FocusScope>
        </div>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");

      input1.focus();
      await Promise.resolve();

      fireEvent.focusIn(input1); // jsdom doesn't fire this automatically
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      await userEvent.tab();

      fireEvent.focusIn(input2);
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      input2.blur();
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);

      fireEvent.focusOut(input2);
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);
    });

    it("uses document.activeElement instead of e.relatedTarget on blur to determine if focus is still in scope", async () => {
      render(() => (
        <div>
          <FocusScope contain>
            <input data-testid="input1" />
            <input data-testid="input2" />
          </FocusScope>
        </div>
      ));

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");

      input1.focus();
      await Promise.resolve();

      fireEvent.focusIn(input1); // jsdom doesn't fire this automatically
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      // set document.activeElement to input2
      input2.focus();
      await Promise.resolve();

      // if onBlur didn't fallback to checking document.activeElement, this would reset focus to input1
      fireEvent.blur(input1, { relatedTarget: null });
      await Promise.resolve();

      expect(document.activeElement).toBe(input2);
    });
  });

  describe("focus restoration", () => {
    it("should restore focus to the previously focused node on unmount", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      expect(document.activeElement).toBe(outside);
    });

    it("should restore focus to the previously focused node after a child with autoFocus unmounts", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <Show when={show()}>
              <FocusScope restoreFocus>
                <input data-testid="input1" />
                <input data-testid="input2" autofocus />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input2 = screen.getByTestId("input2");

      waitFor(async () => {
        expect(document.activeElement).toBe(input2);

        fireEvent.click(toggleShowButton);
        await Promise.resolve();

        expect(document.activeElement).toBe(outside);
      });
    });

    it("should move focus after the previously focused node when tabbing away from a scope with autoFocus", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <input data-testid="outside" />
            <input data-testid="after" />
            <Show when={show()}>
              <FocusScope restoreFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" autofocus />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input3 = screen.getByTestId("input3");

      waitFor(async () => {
        expect(document.activeElement).toBe(input3);

        await userEvent.tab();
        expect(document.activeElement).toBe(screen.getByTestId("after"));
      });
    });

    it("should move focus before the previously focused node when tabbing away from a scope with Shift+Tab", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <input data-testid="outside" />
            <input data-testid="after" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" autofocus />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(screen.getByTestId("before"));
    });

    it("should restore focus to the previously focused node after children change", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);
        const [showChild, setShowChild] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" />
                <Show when={showChild()}>
                  <input data-testid="dynamic" />
                </Show>
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
            <button
              onClick={() => setShowChild(prev => !prev)}
              data-testid="toggle-show-child-button"
            >
              Toggle show child button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");
      const toggleShowChildButton = screen.getByTestId("toggle-show-child-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      fireEvent.click(toggleShowChildButton);
      await Promise.resolve();

      const dynamic = screen.getByTestId("dynamic");

      dynamic.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(dynamic);

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      expect(document.activeElement).toBe(outside);
    });

    it("should move focus to the element after the previously focused node on Tab", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <button data-testid="trigger" />
            <input data-testid="after" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const trigger = screen.getByTestId("trigger");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      trigger.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      const input3 = screen.getByTestId("input3");

      input3.focus();
      await Promise.resolve();

      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });

    it("should move focus to the previous element after the previously focused node on Shift+Tab", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <button data-testid="trigger" />
            <input data-testid="after" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const trigger = screen.getByTestId("trigger");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      trigger.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(screen.getByTestId("before"));
    });

    it("should skip over elements within the scope when moving focus to the next element", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <button data-testid="trigger" />
            <Show when={show()}>
              <FocusScope restoreFocus autoFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <input data-testid="after" />
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const trigger = screen.getByTestId("trigger");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      trigger.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      const input3 = screen.getByTestId("input3");

      input3.focus();
      await Promise.resolve();

      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });

    it("should not handle tabbing if the focus scope does not restore focus", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="before" />
            <button data-testid="trigger" />
            <Show when={show()}>
              <FocusScope autoFocus>
                <input data-testid="input1" />
                <input data-testid="input2" />
                <input data-testid="input3" />
              </FocusScope>
            </Show>
            <input data-testid="after" />
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      const trigger = screen.getByTestId("trigger");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      trigger.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);

      const input3 = screen.getByTestId("input3");

      input3.focus();
      await Promise.resolve();

      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });
  });

  describe("auto focus", () => {
    it("should auto focus the first tabbable element in the scope on mount", async () => {
      render(() => (
        <FocusScope autoFocus>
          <div />
          <input data-testid="input1" />
          <input data-testid="input2" />
          <input data-testid="input3" />
        </FocusScope>
      ));
      await Promise.resolve();

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);
    });

    it("should do nothing if something is already focused in the scope", async () => {
      render(() => (
        <FocusScope autoFocus>
          <div />
          <input data-testid="input1" />
          <input data-testid="input2" autofocus />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input2 = screen.getByTestId("input2");

      waitFor(() => expect(document.activeElement).toBe(input2));
    });
  });

  describe("focus manager", function () {
    it("should move focus forward", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusNext();

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div {...props} tabIndex={-1} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" />
            <Item data-testid="item2" />
            <Item data-testid="item3" />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");
      const item3 = screen.getByTestId("item3");

      item1.focus();
      await Promise.resolve();

      fireEvent.click(item1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item2);

      fireEvent.click(item2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);

      fireEvent.click(item3);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);
    });

    it("should move focus forward and wrap around", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusNext({ wrap: true });

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div {...props} tabIndex={-1} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" />
            <Item data-testid="item2" />
            <Item data-testid="item3" />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");
      const item3 = screen.getByTestId("item3");

      item1.focus();
      await Promise.resolve();

      fireEvent.click(item1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item2);

      fireEvent.click(item2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);

      fireEvent.click(item3);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);
    });

    it("should move focus forward but only to tabbable elements", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusNext({ tabbable: true });

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div tabIndex={0} {...props} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" tabIndex={0} />
            <Item data-testid="item2" tabIndex={-1} />
            <Item style={{ display: "none" }} />
            <Item style={{ visibility: "hidden" }} />
            <Item style={{ visibility: "collapse" }} />
            <Item data-testid="item3" tabIndex={0} />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item3 = screen.getByTestId("item3");

      item1.focus();
      await Promise.resolve();

      fireEvent.click(item1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);
    });

    it("should move focus forward but only to tabbable elements while accounting for container elements within the scope", async () => {
      function Item(props: any) {
        return <div {...props} role="button" />;
      }

      function Group(props: any) {
        const focusManager = useFocusManager();
        const onMouseDown = (e: Event) => {
          focusManager.focusNext({ from: e.target as HTMLElement, tabbable: true });
        };

        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        return <div {...props} role="group" onMouseDown={onMouseDown} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Group data-testid="group1">
              <Item data-testid="item1" tabIndex={-1} />
              <Item data-testid="item2" tabIndex={0} />
              <Item style={{ display: "none" }} />
            </Group>
            <Group data-testid="group2">
              <Item style={{ visibility: "hidden" }} />
              <Item style={{ visibility: "collapse" }} />
              <Item data-testid="item3" tabIndex={0} />
            </Group>
          </FocusScope>
        );
      }

      render(() => <Test />);

      const group1 = screen.getByTestId("group1");
      const group2 = screen.getByTestId("group2");
      const item2 = screen.getByTestId("item2");
      const item3 = screen.getByTestId("item3");

      fireEvent.mouseDown(group2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);

      fireEvent.mouseDown(group1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item2);
    });

    it("should move focus backward", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusPrevious();

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div {...props} tabIndex={-1} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" />
            <Item data-testid="item2" />
            <Item data-testid="item3" />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");
      const item3 = screen.getByTestId("item3");

      item3.focus();
      await Promise.resolve();

      fireEvent.click(item3);
      await Promise.resolve();

      expect(document.activeElement).toBe(item2);

      fireEvent.click(item2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);

      fireEvent.click(item1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);
    });

    it("should move focus backward and wrap around", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusPrevious({ wrap: true });

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div {...props} tabIndex={-1} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" />
            <Item data-testid="item2" />
            <Item data-testid="item3" />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item2 = screen.getByTestId("item2");
      const item3 = screen.getByTestId("item3");

      item3.focus();
      await Promise.resolve();

      fireEvent.click(item3);
      await Promise.resolve();

      expect(document.activeElement).toBe(item2);

      fireEvent.click(item2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);

      fireEvent.click(item1);
      await Promise.resolve();

      expect(document.activeElement).toBe(item3);
    });

    it("should move focus backward but only to tabbable elements", async () => {
      function Item(props: any) {
        const focusManager = useFocusManager();
        const onClick = () => focusManager.focusPrevious({ tabbable: true });

        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        return <div tabIndex={0} {...props} role="button" onClick={onClick} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Item data-testid="item1" tabIndex={0} />
            <Item data-testid="item2" tabIndex={-1} />
            <Item style={{ display: "none" }} />
            <Item style={{ visibility: "hidden" }} />
            <Item style={{ visibility: "collapse" }} />
            <Item data-testid="item3" tabIndex={0} />
          </FocusScope>
        );
      }

      render(() => <Test />);

      const item1 = screen.getByTestId("item1");
      const item3 = screen.getByTestId("item3");

      item3.focus();
      await Promise.resolve();

      fireEvent.click(item3);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);
    });

    it("should move focus backward but only to tabbable elements while accounting for container elements within the scope", async () => {
      function Item(props: any) {
        return <div {...props} role="button" />;
      }

      function Group(props: any) {
        const focusManager = useFocusManager();
        const onMouseDown = (e: Event) => {
          focusManager.focusPrevious({ from: e.target as HTMLElement, tabbable: true });
        };

        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        return <div {...props} role="group" onMouseDown={onMouseDown} />;
      }

      function Test() {
        return (
          <FocusScope>
            <Group data-testid="group1">
              <Item data-testid="item1" tabIndex={0} />
              <Item data-testid="item2" tabIndex={-1} />
              <Item style={{ display: "none" }} />
            </Group>
            <Group data-testid="group2">
              <Item style={{ visibility: "hidden" }} />
              <Item style={{ visibility: "collapse" }} />
              <Item data-testid="item3" tabIndex={0} />
            </Group>
          </FocusScope>
        );
      }

      render(() => <Test />);

      const group1 = screen.getByTestId("group1");
      const group2 = screen.getByTestId("group2");
      const item1 = screen.getByTestId("item1");

      fireEvent.mouseDown(group2);
      await Promise.resolve();

      expect(document.activeElement).toBe(item1);

      fireEvent.mouseDown(group1);
      await Promise.resolve();

      // focus should remain unchanged,
      // because there is no focusable element in scope before group1,
      // and wrap is false
      expect(document.activeElement).toBe(item1);
    });
  });

  describe("nested focus scopes", function () {
    it("should make child FocusScopes the active scope regardless of DOM structure", async () => {
      function ChildComponent(props: any) {
        return <Portal>{props.children}</Portal>;
      }

      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <FocusScope restoreFocus contain>
              <input data-testid="input1" />
              <Show when={show()}>
                <ChildComponent>
                  <FocusScope restoreFocus contain>
                    <input data-testid="input3" />
                  </FocusScope>
                </ChildComponent>
              </Show>
            </FocusScope>
            <button onClick={() => setShow(prev => !prev)} data-testid="toggle-show-button">
              Toggle show button
            </button>
          </div>
        );
      }

      render(() => <Test />);

      // Set a focused node and make first FocusScope the active scope
      const input1 = screen.getByTestId("input1");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      input1.focus();
      await Promise.resolve();

      fireEvent.focusIn(input1);
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      expect(document.activeElement).toBe(input1);

      const input3 = screen.getByTestId("input3");

      input3.focus();
      await Promise.resolve();

      fireEvent.focusIn(input3);
      await Promise.resolve();

      expect(document.activeElement).toBe(input3);
    });

    it("should lock tab navigation inside direct child focus scope", async () => {
      function Test() {
        return (
          <div>
            <input data-testid="outside" />
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent1" />
              <input data-testid="parent2" />
              <input data-testid="parent3" />
              <FocusScope autoFocus restoreFocus contain>
                <input data-testid="child1" />
                <input data-testid="child2" />
                <input data-testid="child3" />
              </FocusScope>
            </FocusScope>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const child1 = screen.getByTestId("child1");
      const child2 = screen.getByTestId("child2");
      const child3 = screen.getByTestId("child3");

      expect(document.activeElement).toBe(child1);

      await userEvent.tab();
      expect(document.activeElement).toBe(child2);

      await userEvent.tab();
      expect(document.activeElement).toBe(child3);

      await userEvent.tab();
      expect(document.activeElement).toBe(child1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(child3);
    });

    it("should lock tab navigation inside nested child focus scope", async () => {
      function Test() {
        return (
          <div>
            <input data-testid="outside" />
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent1" />
              <input data-testid="parent2" />
              <input data-testid="parent3" />
              <div>
                <div>
                  <FocusScope autoFocus restoreFocus contain>
                    <input data-testid="child1" />
                    <input data-testid="child2" />
                    <input data-testid="child3" />
                  </FocusScope>
                </div>
              </div>
            </FocusScope>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const child1 = screen.getByTestId("child1");
      const child2 = screen.getByTestId("child2");
      const child3 = screen.getByTestId("child3");

      expect(document.activeElement).toBe(child1);

      await userEvent.tab();
      expect(document.activeElement).toBe(child2);

      await userEvent.tab();
      expect(document.activeElement).toBe(child3);

      await userEvent.tab();

      expect(document.activeElement).toBe(child1);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(child3);
    });

    it("should not lock tab navigation inside a nested focus scope without contain", async () => {
      function Test() {
        return (
          <div>
            <input data-testid="outside" />
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent" />
              <div>
                <div>
                  <FocusScope>
                    <input data-testid="child1" />
                    <input data-testid="child2" />
                    <input data-testid="child3" />
                  </FocusScope>
                </div>
              </div>
            </FocusScope>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const parent = screen.getByTestId("parent");
      const child1 = screen.getByTestId("child1");
      const child2 = screen.getByTestId("child2");
      const child3 = screen.getByTestId("child3");

      expect(document.activeElement).toBe(parent);

      await userEvent.tab();
      expect(document.activeElement).toBe(child1);

      await userEvent.tab();
      expect(document.activeElement).toBe(child2);

      await userEvent.tab();
      expect(document.activeElement).toBe(child3);

      await userEvent.tab();
      expect(document.activeElement).toBe(parent);

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(child3);
    });

    it("should restore to the correct scope on unmount", async () => {
      function Test() {
        const [show1, setShow1] = createSignal(false);
        const [show2, setShow2] = createSignal(false);
        const [show3, setShow3] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent" />
              <Show when={show1()}>
                <FocusScope contain>
                  <input data-testid="child1" />
                  <Show when={show2()}>
                    <FocusScope contain>
                      <input data-testid="child2" />
                      <Show when={show3()}>
                        <FocusScope contain>
                          <input data-testid="child3" />
                        </FocusScope>
                      </Show>
                    </FocusScope>
                  </Show>
                </FocusScope>
              </Show>
            </FocusScope>
            <button onClick={() => setShow1(prev => !prev)} data-testid="toggle-show1-button">
              Toggle show1 button
            </button>
            <button onClick={() => setShow2(prev => !prev)} data-testid="toggle-show2-button">
              Toggle show2 button
            </button>
            <button onClick={() => setShow3(prev => !prev)} data-testid="toggle-show3-button">
              Toggle show3 button
            </button>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const parent = screen.getByTestId("parent");
      const toggleShow1Button = screen.getByTestId("toggle-show1-button");
      const toggleShow2Button = screen.getByTestId("toggle-show2-button");
      const toggleShow3Button = screen.getByTestId("toggle-show3-button");

      expect(document.activeElement).toBe(parent);

      fireEvent.click(toggleShow1Button);
      await Promise.resolve();

      expect(document.activeElement).toBe(parent);

      // Can move into a child, but not out.
      const child1 = screen.getByTestId("child1");

      await userEvent.tab();
      expect(document.activeElement).toBe(child1);

      parent.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child1);

      fireEvent.click(toggleShow2Button);
      await Promise.resolve();

      expect(document.activeElement).toBe(child1);

      const child2 = screen.getByTestId("child2");

      await userEvent.tab();
      expect(document.activeElement).toBe(child2);

      child1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child2);

      parent.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child2);

      fireEvent.click(toggleShow3Button);
      await Promise.resolve();

      const child3 = screen.getByTestId("child3");

      await userEvent.tab();
      expect(document.activeElement).toBe(child3);

      fireEvent.click(toggleShow3Button);
      await Promise.resolve();

      fireEvent.click(toggleShow2Button);
      await Promise.resolve();

      child1.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child1);

      parent.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child1);
    });

    it("should not lock focus inside a focus scope with a child scope in a portal", async () => {
      function Test() {
        return (
          <div>
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent" />
              <div>
                <Portal>
                  <FocusScope>
                    <input data-testid="child" />
                  </FocusScope>
                </Portal>
              </div>
            </FocusScope>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const parent = screen.getByTestId("parent");
      const child = screen.getByTestId("child");

      expect(document.activeElement).toBe(parent);

      child.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child);

      parent.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(parent);
    });

    it("should lock focus inside a child focus scope with contain in a portal", async () => {
      function Test() {
        return (
          <div>
            <FocusScope autoFocus restoreFocus contain>
              <input data-testid="parent" />
              <div>
                <Portal>
                  <FocusScope contain>
                    <input data-testid="child" />
                  </FocusScope>
                </Portal>
              </div>
            </FocusScope>
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const parent = screen.getByTestId("parent");
      const child = screen.getByTestId("child");

      expect(document.activeElement).toBe(parent);

      child.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child);

      parent.focus();
      await Promise.resolve();

      expect(document.activeElement).toBe(child);
    });
  });

  describe("scope child of document.body", () => {
    it("should navigate in and out of scope in DOM order when the nodeToRestore is the document.body", async () => {
      function Test() {
        return (
          <div>
            <input data-testid="beforeScope" />
            <FocusScope>
              <input data-testid="inScope" />
            </FocusScope>
            <input data-testid="afterScope" />
          </div>
        );
      }

      render(() => <Test />);
      await Promise.resolve();

      const beforeScope = screen.getByTestId("beforeScope");
      const inScope = screen.getByTestId("inScope");
      const afterScope = screen.getByTestId("afterScope");

      inScope.focus();
      await Promise.resolve();

      await userEvent.tab();
      expect(document.activeElement).toBe(afterScope);

      inScope.focus();
      await Promise.resolve();

      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(beforeScope);
    });
  });
});
