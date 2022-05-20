/*
 * Copyright 2022 Solid Aria Working Group.
 * MIT License
 *
 * Portions of this file are based on code from react-spectrum.
 * Copyright 2020 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  splitProps,
  useContext
} from "solid-js";
import { Portal } from "solid-js/web";

interface ModalContextValue {
  parent: Accessor<ModalContextValue | null>;
  modalCount: Accessor<number>;
  addModal: () => void;
  removeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

interface ModalProviderProps extends JSX.HTMLAttributes<any> {
  children?: JSX.Element;
}

/**
 * Each ModalProvider tracks how many modals are open in its subtree. On mount, the modals
 * trigger `addModal` to increment the count, and trigger `removeModal` on unmount to decrement it.
 * This is done recursively so that all parent providers are incremented and decremented.
 * If the modal count is greater than zero, we add `aria-hidden` to this provider to hide its
 * subtree from screen readers. This is done using a context in order to account for things
 * like portals.
 */
export function ModalProvider(props: ModalProviderProps) {
  const parent = createMemo(() => useContext(ModalContext)); // Not sure if `createMemo` is needed.

  const [modalCount, setModalCount] = createSignal(0);

  const addModal = () => {
    setModalCount(prev => prev + 1);
    parent()?.addModal();
  };

  const removeModal = () => {
    setModalCount(prev => prev - 1);
    parent()?.removeModal();
  };

  const context: ModalContextValue = {
    parent,
    modalCount,
    addModal,
    removeModal
  };

  return <ModalContext.Provider value={context}>{props.children}</ModalContext.Provider>;
}

interface ModalProviderAria {
  /**
   * Props to be spread on the container element.
   */
  modalProviderProps: Accessor<JSX.AriaAttributes>;
}

/**
 * Used to determine if the tree should be aria-hidden based on how many
 * modals are open.
 */
export function createModalProvider(): ModalProviderAria {
  const context = useContext(ModalContext);

  const modalProviderProps: Accessor<JSX.AriaAttributes> = createMemo(() => ({
    "aria-hidden": context && context.modalCount() > 0 ? true : undefined
  }));

  return { modalProviderProps };
}

/**
 * Creates a root node that will be aria-hidden if there are other modals open.
 */
function OverlayContainerDOM(props: ModalProviderProps) {
  const { modalProviderProps } = createModalProvider();

  return <div data-overlay-container {...props} {...modalProviderProps()} />;
}

/**
 * An OverlayProvider acts as a container for the top-level application.
 * Any application that uses modal dialogs or other overlays should
 * be wrapped in a `<OverlayProvider>`. This is used to ensure that
 * the main content of the application is hidden from screen readers
 * if a modal or other overlay is opened. Only the top-most modal or
 * overlay should be accessible at once.
 */
export function OverlayProvider(props: ModalProviderProps) {
  return (
    <ModalProvider>
      <OverlayContainerDOM {...props} />
    </ModalProvider>
  );
}

interface OverlayContainerProps extends ModalProviderProps {
  /**
   * The container element in which the overlay portal will be placed.
   * @default document.body
   */
  portalContainer?: HTMLElement;
}

/**
 * A container for overlays like modals and popovers. Renders the overlay
 * into a Portal which is placed at the end of the document body.
 * Also ensures that the overlay is hidden from screen readers if a
 * nested modal is opened. Only the top-most modal or overlay should
 * be accessible at once.
 */
export function OverlayContainer(props: OverlayContainerProps) {
  const [local, others] = splitProps(props, ["portalContainer"]);

  const portalContainer = createMemo(() => local.portalContainer ?? document.body);

  createEffect(() => {
    if (portalContainer().closest("[data-overlay-container]")) {
      throw new Error(
        "An OverlayContainer must not be inside another container. Please change the portalContainer prop."
      );
    }
  });

  return (
    <Portal mount={portalContainer()}>
      <OverlayProvider {...others} />
    </Portal>
  );
}

export interface AriaModalProps {
  isDisabled?: boolean;
}

interface ModalElementProps extends JSX.HTMLAttributes<HTMLElement> {
  /**
   * Data attribute marks the dom node as a modal for the aria-modal-polyfill.
   */
  "data-ismodal": boolean;
}

export interface ModalAria {
  /**
   * Props for the modal content element.
   */
  modalProps: Accessor<ModalElementProps>;
}

/**
 * Hides content outside the current `<OverlayContainer>` from screen readers
 * on mount and restores it on unmount. Typically used by modal dialogs and
 * other types of overlays to ensure that only the top-most modal is
 * accessible at once.
 */
export function createModal(props?: AriaModalProps): ModalAria {
  // Add aria-hidden to all parent providers on mount, and restore on unmount.
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal is not contained within a provider");
  }

  const modalProps = createMemo(() => ({
    "data-ismodal": !props?.isDisabled
  }));

  createEffect(() => {
    if (props?.isDisabled || !context.parent()) {
      return;
    }

    // The immediate context is from the provider containing this modal, so we only
    // want to trigger aria-hidden on its parents not on the modal provider itself.
    context.parent()?.addModal();

    onCleanup(() => context.parent()?.removeModal());
  });

  return { modalProps };
}
