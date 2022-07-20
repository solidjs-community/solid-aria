import { createFocusRing } from "@solid-aria/focus";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  AriaListBoxSectionProps,
  createListBox,
  createListBoxOption,
  createListBoxSection
} from "@solid-aria/listbox";
import { combineProps } from "@solid-primitives/props";
import { createSignal, For, ParentProps, Show } from "solid-js";

import { ForItems, Item, Section } from "../src";

function ListBox(props: AriaListBoxProps) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps, labelProps, state } = createListBox(props, () => ref);

  return (
    <ListBoxProvider>
      <div {...labelProps}>{props.label}</div>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: "5px 0",
          "list-style": "none",
          border: "1px solid gray",
          "max-width": "250px"
        }}
      >
        <ForItems in={state.collection()}>
          {section => (
            <ListBoxSection heading={section().title}>
              <ForItems in={section().childNodes}>
                {item => <Option key={item().key}>{item().children}</Option>}
              </ForItems>
            </ListBoxSection>
          )}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function ListBoxSection(props: ParentProps<AriaListBoxSectionProps>) {
  const { itemProps, headingProps, groupProps } = createListBoxSection(props);

  return (
    <li {...itemProps}>
      <Show when={props.heading}>
        <span
          {...headingProps}
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
        {...groupProps}
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

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps, isSelected } = createListBoxOption(props, () => ref);

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  const { isFocusVisible, focusProps } = createFocusRing();

  const rootProps = combineProps(optionProps, focusProps);

  return (
    <li
      {...rootProps}
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
  const [sectionItems, setSectionItems] = createSignal([1, 2, 3]);

  function addItem() {
    setSectionItems(i => i.concat(i.length + 1));
  }

  function removeItem() {
    setSectionItems(i => i.slice(0, i.length - 1));
  }

  return (
    <>
      <button onClick={addItem}>Add Item</button>
      <button onClick={removeItem}>Remove Item</button>
      <ListBox label="Choose an option" selectionMode="multiple">
        <Section key="section-one" title="Section 1">
          <For each={sectionItems()}>{key => <Item key={`option-${key}`}>Option {key}</Item>}</For>
        </Section>
      </ListBox>
    </>
  );
}

export default App;
