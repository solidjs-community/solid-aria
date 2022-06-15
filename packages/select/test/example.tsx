import { createButton } from "@solid-aria/button";
import { ForItems } from "@solid-aria/collection";
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
          {item => <Option key={item().key}>{item().rendered()}</Option>}
        </ForItems>
      </ul>
    </ListBoxProvider>
  );
}

function Option(props: ParentProps<AriaListBoxOptionProps>) {
  let ref: HTMLLIElement | undefined;

  const { optionProps } = createListBoxOption(props, () => ref);

  return (
    <li {...optionProps} ref={ref}>
      {props.children}
    </li>
  );
}

export function Select(props: AriaSelectProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for child elements from useSelect
  const { labelProps, triggerProps, valueProps, menuProps, state } = createSelect(props, () => ref);

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = createButton(triggerProps, () => ref);

  return (
    <div>
      <div {...labelProps} data-testid="label">
        {props.label}
      </div>
      <HiddenSelect state={state} triggerRef={ref} label={props.label} name={props.name} />
      <button {...buttonProps} ref={ref}>
        <span {...valueProps} data-testid="value">
          {state.selectedItem()?.rendered() ?? "Select an option"}
        </span>
        <span aria-hidden="true">▼</span>
      </button>
      <Show when={state.isOpen()}>
        <Popover isOpen={state.isOpen()} onClose={state.close}>
          <ListBox {...menuProps} autoFocus={state.focusStrategy() || true} state={state} />
        </Popover>
      </Show>
    </div>
  );
}
