import { createButton } from "@solid-aria/button";
import { ForItems, Item } from "@solid-aria/collection";
import { FocusScope } from "@solid-aria/focus";
import { createFocus } from "@solid-aria/interactions";
import {
  AriaMenuItemProps,
  AriaMenuProps,
  AriaMenuTriggerProps,
  createMenu,
  createMenuItem,
  createMenuTrigger
} from "@solid-aria/menu";
import { AriaOverlayProps, createOverlay, DismissButton } from "@solid-aria/overlays";
import { ItemKey } from "@solid-aria/types";
import { combineProps } from "@solid-primitives/props";
import { createSignal, FlowProps, JSX, ParentProps } from "solid-js";
import { render, Show } from "solid-js/web";

type MenuButtonProps = FlowProps<AriaMenuTriggerProps & AriaMenuProps & { label: JSX.Element }>;

function MenuButton(props: MenuButtonProps) {
  let ref: HTMLButtonElement | undefined;

  // Get props for the menu trigger and menu elements
  const { menuTriggerProps, menuProps, state } = createMenuTrigger({}, () => ref);

  // Get props for the button based on the trigger props from createMenuTrigger
  const { buttonProps } = createButton(menuTriggerProps, () => ref);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button {...buttonProps} ref={ref} style={{ height: "30px", "font-size": "14px" }}>
        {props.label}
        <span aria-hidden="true" style={{ "padding-left": "5px" }}>
          ▼
        </span>
      </button>
      <Show when={state.isOpen()}>
        <MenuPopup
          {...props}
          {...menuProps}
          autoFocus={state.focusStrategy()}
          onClose={() => state.close()}
        />
      </Show>
    </div>
  );
}

function MenuPopup(props: AriaMenuProps & AriaOverlayProps) {
  let ref: HTMLUListElement | undefined;

  // Get props for the menu element
  const { MenuProvider, menuProps, state } = createMenu(props, () => ref);

  // Handle events that should cause the menu to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  let overlayRef: HTMLDivElement | undefined;
  const { overlayProps } = createOverlay(
    {
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true
    },
    () => overlayRef
  );

  // Wrap in <FocusScope> so that focus is restored back to the
  // trigger when the menu is closed. In addition, add hidden
  // <DismissButton> components at the start and end of the list
  // to allow screen reader users to dismiss the popup easily.
  return (
    <MenuProvider>
      <FocusScope restoreFocus>
        <div {...overlayProps} ref={overlayRef}>
          <DismissButton onDismiss={props.onClose} />
          <ul
            {...menuProps}
            ref={ref}
            style={{
              position: "absolute",
              width: "100%",
              margin: "4px 0 0 0",
              padding: 0,
              "list-style": "none",
              border: "1px solid gray",
              background: "lightgray"
            }}
          >
            <ForItems in={state.collection()}>
              {item => (
                <MenuItem key={item().key} onAction={props.onAction} onClose={props.onClose}>
                  {item().rendered()}
                </MenuItem>
              )}
            </ForItems>
          </ul>
          <DismissButton onDismiss={props.onClose} />
        </div>
      </FocusScope>
    </MenuProvider>
  );
}

function MenuItem(props: ParentProps<AriaMenuItemProps>) {
  let ref: HTMLLIElement | undefined;

  // Get props for the menu item element
  const { menuItemProps } = createMenuItem(props, () => ref);

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  const [isFocused, setIsFocused] = createSignal(false);
  const { focusProps } = createFocus({ onFocusChange: setIsFocused });

  const rootProps = combineProps(menuItemProps, focusProps);

  return (
    <li
      {...rootProps}
      ref={ref}
      style={{
        background: isFocused() ? "gray" : "transparent",
        color: isFocused() ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer"
      }}
    >
      {props.children}
    </li>
  );
}

function App() {
  const onAction = (key: ItemKey) => {
    alert(key);
  };

  return (
    <MenuButton label="Actions" onAction={onAction}>
      <Item key="copy">Copy</Item>
      <Item key="cut">Cut</Item>
      <Item key="paste">Paste</Item>
    </MenuButton>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
