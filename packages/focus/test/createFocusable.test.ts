/* eslint-disable solid/reactivity */
import { JSX } from "solid-js";

import { createFocusable, CreateFocusableProps } from "../src";

describe("createFocusable", () => {
  test("user props are passed through", () => {
    const onClick = jest.fn();
    const props: CreateFocusableProps<HTMLButtonElement> & JSX.IntrinsicElements["button"] = {
      children: "Hello",
      class: "test-class",
      onClick,
      style: { color: "red" }
    };

    const { focusableProps } = createFocusable<HTMLButtonElement>(props);

    expect(focusableProps.children).toBe("Hello");
    expect(focusableProps.class).toBe("test-class");
    expect(focusableProps.style).toEqual({ color: "red" });

    expect(focusableProps).toHaveProperty("onClick");
    expect(typeof focusableProps.onClick).toBe("function");

    // @ts-expect-error
    focusableProps.onClick();
    expect(onClick).toHaveBeenCalled();
  });

  test("handles ref", () => {
    const userRef = jest.fn();
    const { focusableProps, ref } = createFocusable<HTMLButtonElement>({ ref: userRef });

    expect("ref" in focusableProps).toBeFalsy();

    expect(typeof ref).toBe("function");
    expect(ref).not.toBe(userRef);
    expect(userRef).not.toHaveBeenCalled();
    const el = document.createElement("button");
    ref(el);
    expect(userRef).toHaveBeenCalledWith(el);
  });
});
