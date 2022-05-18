/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createSignal, ErrorBoundary, Show } from "solid-js";
import { fireEvent, render, screen } from "solid-testing-library";

import { createModal, OverlayContainer, OverlayProvider } from "../src";

function ModalDOM(props: any) {
  const { modalProps } = createModal();
  return (
    <div data-testid={props.modalId || "modal"} {...modalProps}>
      {props.children}
    </div>
  );
}

function Modal(props: any) {
  return (
    <OverlayContainer
      portalContainer={props.container}
      data-testid={props.providerId || "modal-provider"}
    >
      <ModalDOM modalId={props.modalId}>{props.children}</ModalDOM>
    </OverlayContainer>
  );
}

function Example(props: any) {
  return (
    <OverlayProvider data-testid="root-provider">
      This is the root provider.
      <Show when={props.showModal}>
        <Modal container={props.container}>{props.children}</Modal>
      </Show>
    </OverlayProvider>
  );
}

describe("createModal", () => {
  it("should set aria-hidden on parent providers on mount and remove on unmount", async () => {
    render(() => {
      const [showModal, setShowModal] = createSignal(false);

      return (
        <>
          <Example showModal={showModal()} />
          <button data-testid="show-modal-button" onClick={() => setShowModal(true)}>
            Show
          </button>
          <button data-testid="hide-modal-button" onClick={() => setShowModal(false)}>
            Hide
          </button>
        </>
      );
    });

    const showModalButton = screen.getByTestId("show-modal-button");
    const hideModalButton = screen.getByTestId("hide-modal-button");

    const rootProvider = screen.getByTestId("root-provider");

    expect(rootProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(showModalButton);
    await Promise.resolve();

    const modalProvider = screen.getByTestId("modal-provider");

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(hideModalButton);
    await Promise.resolve();

    expect(rootProvider).not.toHaveAttribute("aria-hidden");
  });

  it("should work with nested modals", async () => {
    render(() => {
      const [showModal, setShowModal] = createSignal(false);
      const [showInnerModal, setShowInnerModal] = createSignal(false);

      return (
        <>
          <Example showModal={showModal()}>
            <Show when={showInnerModal()}>
              <Modal providerId="inner-modal-provider" modalId="inner-modal" />
            </Show>
          </Example>
          <button data-testid="show-modal-button" onClick={() => setShowModal(true)}>
            Show
          </button>
          <button data-testid="hide-modal-button" onClick={() => setShowModal(false)}>
            Hide
          </button>
          <button data-testid="show-inner-modal-button" onClick={() => setShowInnerModal(true)}>
            Show inner
          </button>
          <button data-testid="hide-inner-modal-button" onClick={() => setShowInnerModal(false)}>
            Hide inner
          </button>
        </>
      );
    });

    const showModalButton = screen.getByTestId("show-modal-button");
    const hideModalButton = screen.getByTestId("hide-modal-button");
    const showInnerModalButton = screen.getByTestId("show-inner-modal-button");
    const hideInnerModalButton = screen.getByTestId("hide-inner-modal-button");

    const rootProvider = screen.getByTestId("root-provider");

    expect(rootProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(showModalButton);
    await Promise.resolve();

    const modalProvider = screen.getByTestId("modal-provider");

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(showInnerModalButton);
    await Promise.resolve();

    const innerModalProvider = screen.getByTestId("inner-modal-provider");

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).toHaveAttribute("aria-hidden");
    expect(innerModalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(hideInnerModalButton);
    await Promise.resolve();

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(hideModalButton);
    await Promise.resolve();

    expect(rootProvider).not.toHaveAttribute("aria-hidden");
  });

  it("can specify a different container from the default document.body", async () => {
    render(() => {
      const [showModal, setShowModal] = createSignal(false);
      const [showInnerModal, setShowInnerModal] = createSignal(false);

      return (
        <div id="alternateContainer" data-testid="alternate-container">
          <Example
            showModal={showModal()}
            container={document.getElementById("alternateContainer")}
          >
            <Show when={showInnerModal()}>
              <Modal providerId="inner-modal-provider" modalId="inner-modal" />
            </Show>
          </Example>
          <button data-testid="show-modal-button" onClick={() => setShowModal(true)}>
            Show
          </button>
          <button data-testid="hide-modal-button" onClick={() => setShowModal(false)}>
            Hide
          </button>
          <button data-testid="show-inner-modal-button" onClick={() => setShowInnerModal(true)}>
            Show inner
          </button>
          <button data-testid="hide-inner-modal-button" onClick={() => setShowInnerModal(false)}>
            Hide inner
          </button>
        </div>
      );
    });

    const showModalButton = screen.getByTestId("show-modal-button");
    const hideModalButton = screen.getByTestId("hide-modal-button");
    const showInnerModalButton = screen.getByTestId("show-inner-modal-button");
    const hideInnerModalButton = screen.getByTestId("hide-inner-modal-button");

    const rootProvider = screen.getByTestId("root-provider");

    expect(rootProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(showModalButton);
    await Promise.resolve();

    const modalProvider = screen.getByTestId("modal-provider");

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(showInnerModalButton);
    await Promise.resolve();

    const innerModalProvider = screen.getByTestId("inner-modal-provider");

    expect(rootProvider).toHaveAttribute("aria-hidden", "true");
    expect(modalProvider).toHaveAttribute("aria-hidden");
    expect(innerModalProvider).not.toHaveAttribute("aria-hidden");

    fireEvent.click(hideInnerModalButton);
    await Promise.resolve();

    fireEvent.click(hideModalButton);
    await Promise.resolve();

    expect(rootProvider).not.toHaveAttribute("aria-hidden");
  });

  describe("error state", () => {
    it("should throws an error when inside another container", async () => {
      render(() => {
        const [showModal, setShowModal] = createSignal(false);
        const [showInnerModal, setShowInnerModal] = createSignal(false);

        return (
          <div id="alternateContainer" data-testid="alternate-container">
            <ErrorBoundary
              fallback={(error: Error) => <p data-testid="fallback-content">{error.message}</p>}
            >
              <Example
                showModal={showModal()}
                container={document.getElementById("alternateContainer")}
              >
                <div id="nestedContainer" />
                <Show when={showInnerModal()}>
                  <Modal
                    container={document.getElementById("nestedContainer")}
                    providerId="inner-modal-provider"
                    modalId="inner-modal"
                  >
                    Inner
                  </Modal>
                </Show>
              </Example>
            </ErrorBoundary>
            <button data-testid="show-modal-button" onClick={() => setShowModal(true)}>
              Show
            </button>
            <button data-testid="hide-modal-button" onClick={() => setShowModal(false)}>
              Hide
            </button>
            <button data-testid="show-inner-modal-button" onClick={() => setShowInnerModal(true)}>
              Show inner
            </button>
            <button data-testid="hide-inner-modal-button" onClick={() => setShowInnerModal(false)}>
              Hide inner
            </button>
          </div>
        );
      });

      const showModalButton = screen.getByTestId("show-modal-button");
      const showInnerModalButton = screen.getByTestId("show-inner-modal-button");
      let fallbackContent = screen.queryByTestId("fallback-content");

      const rootProvider = screen.getByTestId("root-provider");

      expect(rootProvider).not.toHaveAttribute("aria-hidden");

      fireEvent.click(showModalButton);
      await Promise.resolve();

      const modalProvider = screen.getByTestId("modal-provider");

      expect(rootProvider).toHaveAttribute("aria-hidden", "true");
      expect(modalProvider).not.toHaveAttribute("aria-hidden");
      expect(fallbackContent).not.toBeInTheDocument();

      fireEvent.click(showInnerModalButton);
      await Promise.resolve();

      // Can't test if an exception was throw, so use an ErrorBoundary instead and
      // check if the fallback content is rendered with the error message.
      fallbackContent = screen.queryByTestId("fallback-content");

      expect(fallbackContent).toBeInTheDocument();
      expect(fallbackContent).toHaveTextContent(
        "An OverlayContainer must not be inside another container. Please change the portalContainer prop."
      );
    });
  });
});
