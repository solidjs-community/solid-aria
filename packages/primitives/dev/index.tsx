/*
import { createButton } from "@solid-aria/button";
import { ForItems, Item } from "@solid-aria/collection";
import { FocusScope } from "@solid-aria/focus";
import { ListState } from "@solid-aria/list";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "@solid-aria/listbox";
import { AriaOverlayProps, createOverlay, DismissButton } from "@solid-aria/overlays";
import { AriaSelectProps, createSelect, HiddenSelect } from "@solid-aria/select";
import { ParentProps, Show } from "solid-js";
import { render } from "solid-js/web";

function Popover(props: ParentProps<AriaOverlayProps>) {
  let ref: HTMLDivElement | undefined;

  // Handle events that should cause the popup to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const { overlayProps } = createOverlay(
    {
      isOpen: props.isOpen,
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isDismissable: true
    },
    () => ref
  );

  // Add a hidden <DismissButton> component at the end of the popover
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <div
        {...overlayProps}
        ref={ref}
        style={{
          position: "absolute",
          width: "100%",
          border: "1px solid gray",
          background: "lightgray",
          "margin-top": "4px"
        }}
      >
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  );
}

function ListBox(props: AriaListBoxProps & { state?: ListState }) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps, state } = createListBox(props, () => ref, props.state);

  return (
    <ListBoxProvider>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          margin: 0,
          padding: 0,
          "list-style": "none",
          "max-height": "150px",
          overflow: "auto"
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

  const { optionProps, isSelected, isFocused } = createListBoxOption(props, () => ref);

  return (
    <li
      {...optionProps}
      ref={ref}
      style={{
        background: isSelected() ? "blueviolet" : isFocused() ? "gray" : "white",
        color: isSelected() ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function Select(props: AriaSelectProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for child elements from useSelect
  const { labelProps, triggerProps, valueProps, menuProps, state } = createSelect(props, () => ref);

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = createButton(triggerProps, () => ref);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div {...labelProps}>{props.label}</div>
      <HiddenSelect state={state} triggerRef={ref} label={props.label} name={props.name} />
      <button {...buttonProps} ref={ref} style={{ height: "30px", "font-size": "14px" }}>
        <span {...valueProps}>{state.selectedItem()?.rendered() ?? "Select an option"}</span>
        <span aria-hidden="true" style={{ "padding-left": "5px" }}>
          ▼
        </span>
      </button>
      <Show when={state.isOpen()}>
        <Popover isOpen={state.isOpen()} onClose={state.close}>
          <ListBox {...menuProps} autofocus state={state} />
        </Popover>
      </Show>
    </div>
  );
}

function App() {
  return (
    <Select label="Favorite Color">
      <Item key="red">Red</Item>
      <Item key="orange">Orange</Item>
      <Item key="yellow">Yellow</Item>
      <Item key="green">Green</Item>
      <Item key="blue">Blue</Item>
      <Item key="purple">Purple</Item>
      <Item key="black">Black</Item>
      <Item key="white">White</Item>
      <Item key="lime">Lime</Item>
      <Item key="fuchsia">Fuchsia</Item>
    </Select>
  );
}
*/

import { ForItems, Item } from "@solid-aria/collection";
import { createFocusRing } from "@solid-aria/focus";
import {
  AriaListBoxOptionProps,
  AriaListBoxProps,
  createListBox,
  createListBoxOption
} from "@solid-aria/listbox";
import { combineProps } from "@solid-primitives/props";
import { ParentProps } from "solid-js";
import { render } from "solid-js/web";

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
          {item => <Option key={item().key}>{item().rendered()}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
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
  return (
    <ListBox label="Choose an option" selectionMode="single" autofocus>
      <Item key="one">One</Item>
      <Item key="two">Two</Item>
      <Item key="three">Three</Item>
    </ListBox>
  );
}

// function App() {
//   return <div>Hello Solid Aria!</div>;
// }

render(() => <App />, document.getElementById("root") as HTMLDivElement);
