/* eslint-disable solid/reactivity */
import { JSX } from "solid-js";

import { createFocusable, CreateFocusableProps } from "../src";

describe("createFocusable", () => {
  test("user props are passed through", () => {
    const ref = document.createElement("button");
    const onClick = jest.fn();
    const props: CreateFocusableProps & JSX.IntrinsicElements["button"] = {
      children: "Hello",
      class: "test-class",
      onClick,
      style: { color: "red" }
    };

    const { focusableProps } = createFocusable(props, () => ref);

    expect(focusableProps.children).toBe("Hello");
    expect(focusableProps.class).toBe("test-class");
    expect(focusableProps.style).toEqual({ color: "red" });

    expect(focusableProps).toHaveProperty("onClick");
    expect(typeof focusableProps.onClick).toBe("function");

    // @ts-expect-error
    focusableProps.onClick();
    expect(onClick).toHaveBeenCalled();
  });
});
