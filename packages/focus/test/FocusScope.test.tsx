import userEvent from "@testing-library/user-event";
import { createSignal, Show } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { FocusScope } from "../src";

let spyRequestAnimationFrame: any;

describe("FocusScope", () => {
  beforeEach(() => {
    spyRequestAnimationFrame = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(cb => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    spyRequestAnimationFrame.mockRestore();
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

    /*
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

      const outside = screen.getByTestId("outside");
      const toggleShowButton = screen.getByTestId("toggle-show-button");

      outside.focus();
      await Promise.resolve();

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      const input2 = screen.getByTestId("input2");

      expect(document.activeElement).toBe(input2);

      fireEvent.click(toggleShowButton);
      await Promise.resolve();

      expect(document.activeElement).toBe(outside);
    });


    it("should move focus after the previously focused node when tabbing away from a scope with autoFocus", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
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

      expect(document.activeElement).toBe(input3);

      await userEvent.tab();
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });
    
    it("should move focus before the previously focused node when tabbing away from a scope with Shift+Tab", async () => {
      function Test() {
        const [show, setShow] = createSignal(false);

        return (
          <div>
            <input data-testid="outside" />
            <Show when={show()}>
              <FocusScope restoreFocus>
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
    */

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
    it("should auto focus the first tabbable element in the scope on mount", () => {
      render(() => (
        <FocusScope autoFocus>
          <div />
          <input data-testid="input1" />
          <input data-testid="input2" />
          <input data-testid="input3" />
        </FocusScope>
      ));

      const input1 = screen.getByTestId("input1");

      expect(document.activeElement).toBe(input1);
    });

    /*
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

      expect(document.activeElement).toBe(input2);
    });
    */
  });

  //describe("focus manager", function () {});
});
