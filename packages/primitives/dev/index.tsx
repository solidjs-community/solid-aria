import { Show } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { render } from "solid-js/web";

import {
  AriaDialogProps,
  AriaModalProps,
  AriaOverlayProps,
  createButton,
  createDialog,
  createModal,
  createOverlay,
  createOverlayTriggerState,
  createPreventScroll,
  OverlayContainer,
  OverlayProvider
} from "../src";

type ModalDialogProps = AriaDialogProps &
  AriaModalProps &
  AriaOverlayProps & {
    title?: JSX.Element;
    children?: JSX.Element;
  };

function ModalDialog(props: ModalDialogProps) {
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  let ref: HTMLDivElement | undefined;

  const { overlayProps, underlayProps } = createOverlay(props, () => ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  createPreventScroll();

  const { modalProps } = createModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = createDialog(props, () => ref);

  return (
    <div
      style={{
        position: "fixed",
        "z-index": 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        "align-items": "center",
        "justify-content": "center"
      }}
      {...underlayProps()}
    >
      <div
        {...overlayProps()}
        {...dialogProps()}
        {...modalProps()}
        ref={ref}
        style={{
          background: "white",
          color: "black",
          padding: "30px"
        }}
      >
        <h3 {...titleProps()} style={{ "margin-top": 0 }}>
          {props.title}
        </h3>
        {props.children}
      </div>
    </div>
  );
}

function Example() {
  let openButtonRef: HTMLButtonElement | undefined;
  let closeButtonRef: HTMLButtonElement | undefined;

  const state = createOverlayTriggerState({});

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  const { buttonProps: openButtonProps } = createButton(
    {
      onPress: () => state.open()
    },
    () => openButtonRef
  );

  const { buttonProps: closeButtonProps } = createButton(
    {
      onPress: () => state.close()
    },
    () => closeButtonRef
  );

  return (
    <>
      <button {...openButtonProps()} ref={openButtonRef}>
        Open Dialog
      </button>
      <Show when={state.isOpen()}>
        <OverlayContainer>
          <ModalDialog title="Enter your name" isOpen onClose={state.close} isDismissable>
            <p>Lorem ipsum dolor sit amet.</p>
            <button {...closeButtonProps()} ref={closeButtonRef} style={{ "margin-top": "10px" }}>
              Submit
            </button>
          </ModalDialog>
        </OverlayContainer>
      </Show>
    </>
  );
}

function App() {
  return (
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  );
}

// function App() {
//   return <div>Hello Solid Aria!</div>;
// }

render(() => <App />, document.getElementById("root") as HTMLDivElement);
