import { combineProps } from "@solid-primitives/props";
import { mergeRefs } from "@solid-primitives/refs";
import { access } from "@solid-primitives/utils";
import { createMemo, JSX, Ref, splitProps } from "solid-js";
import { render, Show } from "solid-js/web";

import {
  AriaOverlayProps,
  createButton,
  createDialog,
  createModal,
  createOverlay,
  createOverlayTrigger,
  DismissButton,
  FocusScope,
  OverlayContainer,
  OverlayProvider
} from "../src";

interface PopoverProps extends AriaOverlayProps {
  ref: Ref<HTMLDivElement | undefined>;
  title?: JSX.Element;
  children?: JSX.Element;
}

function Popover(props: PopoverProps) {
  let ref: HTMLDivElement | undefined;

  const [local, others] = splitProps(props, ["ref", "title", "children", "isOpen", "onClose"]);

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const { overlayProps } = createOverlay(
    {
      onClose: local.onClose,
      isOpen: () => access(local.isOpen),
      isDismissable: true
    },
    () => ref
  );

  // Hide content outside the modal from screen readers.
  const { modalProps } = createModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = createDialog({}, () => ref);

  const rootProps = createMemo(() => {
    return combineProps(overlayProps(), dialogProps(), modalProps(), others);
  });

  return (
    <FocusScope restoreFocus>
      <div
        {...rootProps()}
        ref={mergeRefs(el => (ref = el), local.ref)}
        style={{
          position: "absolute",
          background: "white",
          color: "black",
          padding: "30px",
          "max-width": "300px"
        }}
      >
        <h3 {...titleProps} style={{ "margin-top": 0 }}>
          {props.title}
        </h3>
        {props.children}
        <DismissButton onDismiss={local.onClose} />
      </div>
    </FocusScope>
  );
}

function Example() {
  let triggerRef: HTMLButtonElement | undefined;
  let overlayRef: HTMLDivElement | undefined;

  // Get props for the trigger and overlay.
  const { triggerProps, overlayProps, state } = createOverlayTrigger({ type: "dialog" });

  // Get popover positioning props relative to the trigger
  // const { overlayPositionProps } = createOverlayPosition({
  //   triggerRef: () => triggerRef,
  //   overlayRef: () => overlayRef,
  //   placement: "top",
  //   offset: 5,
  //   isOpen: state.isOpen
  // });

  // createButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // popover closes.
  const { buttonProps } = createButton(
    {
      onPress: () => state.open()
    },
    () => triggerRef
  );

  return (
    <>
      <button {...buttonProps()} {...triggerProps()} ref={triggerRef}>
        Open Popover
      </button>
      <Show when={state.isOpen()}>
        <OverlayContainer>
          <Popover
            {...overlayProps()}
            // {...overlayPositionProps()}
            ref={overlayRef}
            title="Popover title"
            isOpen={state.isOpen()}
            onClose={state.close}
          >
            This is the content of the popover.
          </Popover>
        </OverlayContainer>
      </Show>
    </>
  );
}

function App() {
  return (
    // Application must be wrapped in an OverlayProvider so that it can be
    // hidden from screen readers when an overlay opens.
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  );
  //return <div>Hello Solid Aria!</div>;
}

render(() => <App />, document.getElementById("root") as HTMLDivElement);
