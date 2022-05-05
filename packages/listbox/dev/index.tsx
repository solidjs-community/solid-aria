import { createFocusRing } from "@solid-aria/focus";
import { combineProps } from "@solid-aria/utils";
import { JSX, Show } from "solid-js";
import { render } from "solid-js/web";

import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  AriaListBoxSectionProps,
  createListBox,
  createListBoxOption,
  createListBoxSection
} from "../src";

function ListBox(props: AriaListBoxProps & JSX.IntrinsicElements["ul"]) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <ul
        {...listBoxProps()}
        ref={ref}
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        {props.children}
      </ul>
    </ListBoxProvider>
  );
}

function Section(props: AriaListBoxSectionProps) {
  const { groupProps, headingProps, itemProps } = createListBoxSection(props);

  return (
    <li {...itemProps()}>
      <Show when={props.heading}>
        <span
          {...headingProps()}
          style={{
            "font-weight": "bold",
            "font-size": "1.1em",
            padding: "2px 5px"
          }}
        >
          {props.heading}
        </span>
      </Show>
      <ul
        {...groupProps()}
        style={{
          padding: 0,
          "list-style": "none"
        }}
      >
        {props.children}
      </ul>
    </li>
  );
}

function Option(props: AriaListBoxOptionProps) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected, isDisabled } = createListBoxOption(props, () => ref);

  const { isFocusVisible, focusProps } = createFocusRing();

  return (
    <li
      {...combineProps(optionProps(), focusProps())}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : "transparent",
        color: isSelected() ? "white" : null,
        padding: "2px 5px",
        outline: isFocusVisible() ? "2px solid orange" : "none",
        opacity: isDisabled() ? 0.4 : 1
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <div>
      <ListBox>
        <Option value="1">One</Option>
        <Option value="2">Two</Option>
        <Option value="3">Three</Option>
        <Option value="4">Four</Option>
        <Option value="5">Five</Option>
        <Option value="6">Six</Option>
        <Option value="7">Seven</Option>
        <Option value="8">Eight</Option>
        <Option value="9">Nine</Option>
        <Option value="10">Ten</Option>
      </ListBox>
    </div>
  );
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
