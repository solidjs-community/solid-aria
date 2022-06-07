import { ForItems, Item } from "@solid-aria/collection";
import { createFocusRing } from "@solid-aria/focus";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "@solid-aria/listbox";
import { combineProps } from "@solid-primitives/props";
import { createMemo, ParentProps } from "solid-js";
import { render } from "solid-js/web";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps, labelProps, state } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <div {...labelProps()}>{props.label}</div>
      <ul
        {...listBoxProps()}
        ref={ref}
        class="listbox"
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {item => <Option key={item().key}>{item().rendered()}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected } = createListBoxOption(props, () => ref);

  const { isFocusVisible, focusProps } = createFocusRing();

  const rootProps = createMemo(() => combineProps(optionProps(), focusProps()));

  return (
    <li
      {...rootProps()}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : "transparent",
        color: isSelected() ? "white" : null,
        padding: "2px 5px",
        outline: isFocusVisible() ? "2px solid orange" : "none"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  return (
    <>
      <button>Before</button>
      <ListBox label="Choose an option" selectionMode="single">
        <Item key="one">One</Item>
        <Item key="two">Two</Item>
        <Item key="three">Three</Item>
      </ListBox>
      <button>After</button>
    </>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
