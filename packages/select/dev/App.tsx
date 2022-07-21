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
import { ParentProps, Show } from "solid-js";

import { AriaSelectProps, createSelect, HiddenSelect } from "../src";

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps } = createListBoxOption(props, () => ref);

  return (
    <li {...optionProps} ref={ref}>
      {props.children}
    </li>
  );
}

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
      <div {...overlayProps} ref={ref}>
        {props.children}
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  );
}

function ListBox(props: AriaListBoxProps & { state: ListState }) {
  let ref: HTMLUListElement | undefined;

  const { ListBoxProvider, listBoxProps } = createListBox(props, () => ref, props.state);

  return (
    <ListBoxProvider>
      <ul {...listBoxProps} ref={ref} data-testid="listbox">
        <ForItems in={props.state.collection()}>
          {item => <Option key={item().key}>{item().children}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

export function Select(props: AriaSelectProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for child elements from useSelect
  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    state,
    descriptionProps,
    errorMessageProps
  } = createSelect(props, () => ref);

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = createButton(triggerProps, () => ref);

  return (
    <div>
      <div {...labelProps} data-testid="label">
        {props.label}
      </div>
      <HiddenSelect
        autocomplete={props.autocomplete}
        isDisabled={props.isDisabled}
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <button {...buttonProps} ref={ref} autofocus={props.autofocus}>
        <span {...valueProps} data-testid="value">
          {state.selectedItem()?.children ?? "Select an option"}
        </span>
        <span aria-hidden="true">▼</span>
      </button>
      <Show when={props.description}>
        <div {...descriptionProps}>{props.description}</div>
      </Show>
      <Show when={props.errorMessage && props.validationState === "invalid"}>
        <div {...errorMessageProps}>{props.errorMessage}</div>
      </Show>
      <Show when={state.isOpen()}>
        <Popover isOpen={state.isOpen()} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      </Show>
    </div>
  );
}

function App() {
  return (
    <Select label="Favorite Color">
      <Item key="Red">Red</Item>
      <Item key="Orange">Orange</Item>
      <Item key="Yellow">Yellow</Item>
      <Item key="Green">Green</Item>
      <Item key="Blue">Blue</Item>
      <Item key="Purple">Purple</Item>
      <Item key="Black">Black</Item>
      <Item key="White">White</Item>
      <Item key="Lime">Lime</Item>
      <Item key="Fushsia">Fushsia</Item>
    </Select>
  );
}

export default App;
