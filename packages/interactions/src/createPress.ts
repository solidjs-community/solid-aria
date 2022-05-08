import { PointerType, PressEvents } from "@solid-aria/types";
import {
  combineProps,
  createGlobalListeners,
  createSyncRef,
  focusWithoutScrolling
} from "@solid-aria/utils";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  on,
  onCleanup,
  splitProps,
  useContext
} from "solid-js";

import { disableTextSelection, restoreTextSelection } from "./textSelection";
import { isVirtualClick } from "./utils";

export interface CreatePressProps extends PressEvents {
  /**
   * Whether the target is in a controlled press state (e.g. an overlay it triggers is open).
   */
  isPressed?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the press events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether the target should not receive focus on press.
   */
  preventFocusOnPress?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether press events should be canceled when the pointer leaves the target while pressed.
   * By default, this is `false`, which means if the pointer returns back over the target while
   * still pressed, onPressStart will be fired again. If set to `true`, the press is canceled
   * when the pointer leaves the target and onPressStart will not be fired if the pointer returns.
   */
  shouldCancelOnPointerExit?: MaybeAccessor<boolean | undefined>;

  /**
   * Whether text selection should be enabled on the pressable element.
   */
  allowTextSelectionOnPress?: MaybeAccessor<boolean | undefined>;
}

export interface PressResult<T extends HTMLElement> {
  /**
   * Whether the target is currently pressed.
   */
  isPressed: Accessor<boolean>;

  /**
   * Props to spread onto the target element.
   */
  pressProps: Accessor<JSX.HTMLAttributes<T>>;
}

interface EventBase {
  currentTarget: EventTarget;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

interface PressResponderContextValue extends CreatePressProps {
  register: () => void;
  ref: Accessor<HTMLElement | undefined>;
}

export const PressResponderContext = createContext<PressResponderContextValue>();

function usePressResponderContext<RefElement extends HTMLElement>(
  props: CreatePressProps,
  ref?: Accessor<RefElement | undefined>
): CreatePressProps {
  // Consume context from <PressResponder> and merge with props.
  const context = useContext(PressResponderContext);

  if (context) {
    const [, contextProps] = splitProps(context, ["register"]);

    props = combineProps(contextProps, props) as CreatePressProps;

    context.register();
  }

  createSyncRef(context, ref);

  return props;
}

/**
 * Handles press interactions across mouse, touch, keyboard, and screen readers.
 * It normalizes behavior across browsers and platforms, and handles many nuances
 * of dealing with pointer and keyboard events.
 * @param props - Props for the press primitive.
 * @param ref - A ref for the HTML element.
 */
export function createPress<RefElement extends HTMLElement>(
  props: CreatePressProps,
  ref?: Accessor<RefElement | undefined>
): PressResult<RefElement> {
  const [local, domProps] = splitProps(usePressResponderContext(props, ref), [
    "onPress",
    "onPressChange",
    "onPressStart",
    "onPressEnd",
    "onPressUp",
    "isDisabled",
    "isPressed",
    "preventFocusOnPress",
    "shouldCancelOnPointerExit",
    "allowTextSelectionOnPress"
  ]);

  const [isTriggerPressed, setIsTriggerPressed] = createSignal(false);

  const [_isPressed, _setIsPressed] = createSignal(false);
  const [ignoreEmulatedMouseEvents, setIgnoreEmulatedMouseEvents] = createSignal(false);
  const [ignoreClickAfterPress, setIgnoreClickAfterPress] = createSignal(false);
  const [didFirePressStart, setDidFirePressStart] = createSignal(false);
  const [activePointerId, setActivePointerId] = createSignal<any>(null);
  const [target, setTarget] = createSignal<HTMLElement | null>(null);
  const [isOverTarget, setIsOverTarget] = createSignal(false);
  const [pointerType, setPointerType] = createSignal<PointerType | null>(null);

  const { addGlobalListener, removeAllGlobalListeners } = createGlobalListeners();

  const pressProps: Accessor<JSX.HTMLAttributes<RefElement>> = createMemo(() => {
    const triggerPressStart = (originalEvent: EventBase, pointerType: PointerType) => {
      if (access(local.isDisabled) || didFirePressStart()) {
        return;
      }

      local.onPressStart?.({
        type: "pressstart",
        pointerType,
        target: originalEvent.currentTarget as HTMLElement,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });

      local.onPressChange?.(true);

      setDidFirePressStart(true);
      setIsTriggerPressed(true);
    };

    const triggerPressEnd = (
      originalEvent: EventBase,
      pointerType: PointerType,
      wasPressed = true
    ) => {
      if (!didFirePressStart()) {
        return;
      }

      setIgnoreClickAfterPress(true);
      setDidFirePressStart(false);

      local.onPressEnd?.({
        type: "pressend",
        pointerType,
        target: originalEvent.currentTarget as HTMLElement,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });

      local.onPressChange?.(false);
      setIsTriggerPressed(false);

      if (wasPressed && !access(local.isDisabled)) {
        local.onPress?.({
          type: "press",
          pointerType,
          target: originalEvent.currentTarget as HTMLElement,
          shiftKey: originalEvent.shiftKey,
          metaKey: originalEvent.metaKey,
          ctrlKey: originalEvent.ctrlKey,
          altKey: originalEvent.altKey
        });
      }
    };

    const triggerPressUp = (originalEvent: EventBase, pointerType: PointerType) => {
      if (access(local.isDisabled)) {
        return;
      }

      local.onPressUp?.({
        type: "pressup",
        pointerType,
        target: originalEvent.currentTarget as HTMLElement,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey
      });
    };

    const cancel = (e: EventBase) => {
      if (!_isPressed()) {
        return;
      }

      if (isOverTarget()) {
        triggerPressEnd(createEvent(target()!, e), pointerType()!, false);
      }

      _setIsPressed(false);
      setIsOverTarget(false);
      setActivePointerId(null);
      setPointerType(null);

      removeAllGlobalListeners();

      if (!access(local.allowTextSelectionOnPress)) {
        restoreTextSelection(target()!);
      }
    };

    const pressProps: JSX.HTMLAttributes<RefElement> = {
      onKeyDown(e) {
        if (isValidKeyboardEvent(e) && e.currentTarget.contains(e.target as HTMLElement)) {
          if (shouldPreventDefaultKeyboard(e.target as Element)) {
            e.preventDefault();
          }

          e.stopPropagation();

          // If the event is repeating, it may have started on a different element
          // after which focus moved to the current element. Ignore these events and
          // only handle the first key down event.
          if (!_isPressed() && !e.repeat) {
            setTarget(e.currentTarget as HTMLElement);
            _setIsPressed(true);
            triggerPressStart(e, "keyboard");

            // Focus may move before the key up event, so register the event on the document
            // instead of the same element where the key down event occurred.
            addGlobalListener(document, "keyup", globalOnKeyUp, false);
          }
        }
      },
      onKeyUp(e) {
        if (
          isValidKeyboardEvent(e) &&
          !e.repeat &&
          e.currentTarget.contains(e.target as HTMLElement)
        ) {
          triggerPressUp(createEvent(target()!, e), "keyboard");
        }
      },
      onClick(e) {
        if (e && !e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        if (e && e.button === 0) {
          e.stopPropagation();

          if (access(local.isDisabled)) {
            e.preventDefault();
          }

          // If triggered from a screen reader or by using element.click(),
          // trigger as if it were a keyboard click.
          if (
            !ignoreClickAfterPress() &&
            !ignoreEmulatedMouseEvents() &&
            (pointerType() === "virtual" || isVirtualClick(e))
          ) {
            // Ensure the element receives focus (VoiceOver on iOS does not do this)
            if (!access(local.isDisabled) && !access(local.preventFocusOnPress)) {
              focusWithoutScrolling(e.currentTarget);
            }

            triggerPressStart(e, "virtual");
            triggerPressUp(e, "virtual");
            triggerPressEnd(e, "virtual");
          }

          setIgnoreEmulatedMouseEvents(false);
          setIgnoreClickAfterPress(false);
        }
      }
    };

    const globalOnKeyUp = (e: KeyboardEvent) => {
      if (_isPressed() && isValidKeyboardEvent(e)) {
        if (shouldPreventDefaultKeyboard(e.target as Element)) {
          e.preventDefault();
        }

        e.stopPropagation();

        _setIsPressed(false);

        const eventTarget = e.target as HTMLElement;

        triggerPressEnd(
          createEvent(target()!, e as EventBase),
          "keyboard",
          target()?.contains(eventTarget)
        );

        removeAllGlobalListeners();

        // If the target is a link, trigger the click method to open the URL,
        // but defer triggering pressEnd until onClick event handler.
        if (
          (target()?.contains(eventTarget) && isHTMLAnchorLink(target()!)) ||
          target()!.getAttribute("role") === "link"
        ) {
          target()?.click();
        }
      }
    };

    if (typeof PointerEvent !== "undefined") {
      pressProps.onPointerDown = e => {
        // Only handle left clicks, and ignore events that bubbled through portals.
        if (e.button !== 0 || !e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        // iOS safari fires pointer events from VoiceOver with incorrect coordinates/target.
        // Ignore and let the onClick handler take care of it instead.
        // https://bugs.webkit.org/show_bug.cgi?id=222627
        // https://bugs.webkit.org/show_bug.cgi?id=223202
        if (isVirtualPointerEvent(e)) {
          setPointerType("virtual");
          return;
        }

        // Due to browser inconsistencies, especially on mobile browsers, we prevent
        // default on pointer down and handle focusing the pressable element ourselves.
        if (shouldPreventDefault(e.currentTarget as HTMLElement)) {
          e.preventDefault();
        }

        const newPointerType = setPointerType(e.pointerType as PointerType);

        e.stopPropagation();

        if (_isPressed()) {
          return;
        }

        _setIsPressed(true);
        setIsOverTarget(true);
        setActivePointerId(e.pointerId);
        const newTarget = setTarget(e.currentTarget as any);

        if (!access(local.isDisabled) && !access(local.preventFocusOnPress)) {
          focusWithoutScrolling(e.currentTarget);
        }

        if (!access(local.allowTextSelectionOnPress)) {
          disableTextSelection(newTarget);
        }

        triggerPressStart(e, newPointerType);

        addGlobalListener(document, "pointermove", globalOnPointerMove, false);
        addGlobalListener(document, "pointerup", globalOnPointerUp, false);
        addGlobalListener(document, "pointercancel", globalOnPointerCancel, false);
      };

      pressProps.onMouseDown = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        if (e.button === 0) {
          // Chrome and Firefox on touch Windows devices require mouse down events
          // to be canceled in addition to pointer events, or an extra asynchronous
          // focus event will be fired.
          if (shouldPreventDefault(e.currentTarget as HTMLElement)) {
            e.preventDefault();
          }

          e.stopPropagation();
        }
      };

      pressProps.onPointerUp = e => {
        // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
        if (!e.currentTarget.contains(e.target as HTMLElement) || pointerType() === "virtual") {
          return;
        }

        // Only handle left clicks
        // Safari on iOS sometimes fires pointerup events, even
        // when the touch isn't over the target, so double check.
        if (e.button === 0 && isPointOverTarget(e, e.currentTarget)) {
          triggerPressUp(e, pointerType() || (e.pointerType as PointerType));
        }
      };

      // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
      // Use pointer move events instead to implement our own hit testing.
      // See https://bugs.webkit.org/show_bug.cgi?id=199803
      const globalOnPointerMove = (e: PointerEvent) => {
        if (e.pointerId !== activePointerId()) {
          return;
        }

        if (isPointOverTarget(e, target()!)) {
          if (!isOverTarget()) {
            setIsOverTarget(true);
            triggerPressStart(createEvent(target()!, e as EventBase), pointerType()!);
          }
        } else if (isOverTarget()) {
          setIsOverTarget(false);
          triggerPressEnd(createEvent(target()!, e as EventBase), pointerType()!, false);

          if (access(local.shouldCancelOnPointerExit)) {
            cancel(e as EventBase);
          }
        }
      };

      const globalOnPointerUp = (e: PointerEvent) => {
        if (e.pointerId === activePointerId() && _isPressed() && e.button === 0) {
          if (isPointOverTarget(e, target()!)) {
            triggerPressEnd(createEvent(target()!, e as EventBase), pointerType()!);
          } else if (isOverTarget()) {
            triggerPressEnd(createEvent(target()!, e as EventBase), pointerType()!, false);
          }

          _setIsPressed(false);
          setIsOverTarget(false);
          setActivePointerId(null);
          setPointerType(null);

          removeAllGlobalListeners();

          if (!access(local.allowTextSelectionOnPress)) {
            restoreTextSelection(target()!);
          }
        }
      };

      const globalOnPointerCancel = (e: PointerEvent) => {
        cancel(e as EventBase);
      };

      pressProps.onDragStart = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
        cancel(e);
      };
    } else {
      pressProps.onMouseDown = e => {
        // Only handle left clicks
        if (e.button !== 0 || !e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        // Due to browser inconsistencies, especially on mobile browsers, we prevent
        // default on mouse down and handle focusing the pressable element ourselves.
        if (shouldPreventDefault(e.currentTarget as HTMLElement)) {
          e.preventDefault();
        }

        e.stopPropagation();
        if (ignoreEmulatedMouseEvents()) {
          return;
        }

        _setIsPressed(true);
        setIsOverTarget(true);
        setTarget(e.currentTarget as any);
        const newPointerType = setPointerType(isVirtualClick(e) ? "virtual" : "mouse");

        if (!access(local.isDisabled) && !access(local.preventFocusOnPress)) {
          focusWithoutScrolling(e.currentTarget);
        }

        triggerPressStart(e, newPointerType);

        addGlobalListener(document, "mouseup", globalOnMouseUp, false);
      };

      pressProps.onMouseEnter = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        if (_isPressed() && !ignoreEmulatedMouseEvents()) {
          setIsOverTarget(true);
          triggerPressStart(e, pointerType()!);
        }
      };

      pressProps.onMouseLeave = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        if (_isPressed() && !ignoreEmulatedMouseEvents()) {
          setIsOverTarget(false);

          triggerPressEnd(e, pointerType()!, false);

          if (access(local.shouldCancelOnPointerExit)) {
            cancel(e);
          }
        }
      };

      pressProps.onMouseUp = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        if (!ignoreEmulatedMouseEvents() && e.button === 0) {
          triggerPressUp(e, pointerType()!);
        }
      };

      const globalOnMouseUp = (e: MouseEvent) => {
        // Only handle left clicks
        if (e.button !== 0) {
          return;
        }

        _setIsPressed(false);

        removeAllGlobalListeners();

        if (ignoreEmulatedMouseEvents()) {
          setIgnoreEmulatedMouseEvents(false);
          return;
        }

        if (isPointOverTarget(e, target()!)) {
          triggerPressEnd(createEvent(target()!, e as EventBase), pointerType()!);
        } else if (isOverTarget()) {
          triggerPressEnd(createEvent(target()!, e as EventBase), pointerType()!, false);
        }

        setIsOverTarget(false);
      };

      pressProps.onTouchStart = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        const touch = getTouchFromEvent(e);

        if (!touch) {
          return;
        }

        setActivePointerId(touch.identifier);
        setIgnoreEmulatedMouseEvents(true);
        setIsOverTarget(true);
        _setIsPressed(true);
        const newTarget = setTarget(e.currentTarget as any);
        const newPointerType = setPointerType("touch");

        // Due to browser inconsistencies, especially on mobile browsers, we prevent default
        // on the emulated mouse event and handle focusing the pressable element ourselves.
        if (!access(local.isDisabled) && !access(local.preventFocusOnPress)) {
          focusWithoutScrolling(e.currentTarget);
        }

        if (!access(local.allowTextSelectionOnPress)) {
          disableTextSelection(newTarget);
        }

        triggerPressStart(e, newPointerType);

        addGlobalListener(window, "scroll", globalOnScroll, true);
      };

      pressProps.onTouchMove = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        if (!_isPressed()) {
          return;
        }

        const touch = getTouchById(e, activePointerId());

        if (touch && isPointOverTarget(touch, e.currentTarget)) {
          if (!isOverTarget()) {
            setIsOverTarget(true);
            triggerPressStart(e, pointerType()!);
          }
        } else if (isOverTarget()) {
          setIsOverTarget(false);
          triggerPressEnd(e, pointerType()!, false);

          if (access(local.shouldCancelOnPointerExit)) {
            cancel(e);
          }
        }
      };

      pressProps.onTouchEnd = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        if (!_isPressed()) {
          return;
        }

        const touch = getTouchById(e, activePointerId());

        if (touch && isPointOverTarget(touch, e.currentTarget)) {
          triggerPressUp(e, pointerType()!);
          triggerPressEnd(e, pointerType()!);
        } else if (isOverTarget()) {
          triggerPressEnd(e, pointerType()!, false);
        }

        _setIsPressed(false);
        setActivePointerId(null);
        setIsOverTarget(false);
        setIgnoreEmulatedMouseEvents(true);

        if (!access(local.allowTextSelectionOnPress)) {
          restoreTextSelection(target()!);
        }

        removeAllGlobalListeners();
      };

      pressProps.onTouchCancel = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        e.stopPropagation();

        if (_isPressed()) {
          cancel(e);
        }
      };

      const globalOnScroll = (e: Event) => {
        if (_isPressed() && (e.target as HTMLElement).contains(target())) {
          cancel({
            currentTarget: target()!,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            altKey: false
          });
        }
      };

      pressProps.onDragStart = e => {
        if (!e.currentTarget.contains(e.target as HTMLElement)) {
          return;
        }

        cancel(e);
      };
    }

    return combineProps(domProps, pressProps);
  });

  const isPressed = createMemo(() => access(local.isPressed) ?? isTriggerPressed());

  createEffect(
    on(
      () => access(local.allowTextSelectionOnPress),
      newValue => {
        onCleanup(() => {
          if (!newValue) {
            restoreTextSelection(target() ?? undefined);
          }
        });
      }
    )
  );

  return { pressProps, isPressed };
}

function isHTMLAnchorLink(target: HTMLElement): boolean {
  return target.tagName === "A" && target.hasAttribute("href");
}

function isValidKeyboardEvent(event: KeyboardEvent): boolean {
  const { key, code, target } = event;
  const element = target as HTMLElement;
  const { tagName, isContentEditable } = element;
  const role = element.getAttribute("role");

  // Accessibility for keyboards. Space and Enter only.
  // "Spacebar" is for IE 11
  return (
    (key === "Enter" || key === " " || key === "Spacebar" || code === "Space") &&
    tagName !== "INPUT" &&
    tagName !== "TEXTAREA" &&
    isContentEditable !== true &&
    // A link with a valid href should be handled natively,
    // unless it also has role='button' and was triggered using Space.
    (!isHTMLAnchorLink(element) || (role === "button" && key !== "Enter")) &&
    // An element with role='link' should only trigger with Enter key
    !(role === "link" && key !== "Enter")
  );
}

function getTouchFromEvent(event: TouchEvent): Touch | null {
  const { targetTouches } = event;
  if (targetTouches.length > 0) {
    return targetTouches[0];
  }
  return null;
}

function getTouchById(event: TouchEvent, pointerId: null | number): null | Touch {
  const changedTouches = event.changedTouches;
  for (let i = 0; i < changedTouches.length; i++) {
    const touch = changedTouches[i];
    if (touch.identifier === pointerId) {
      return touch;
    }
  }
  return null;
}

function createEvent(target: HTMLElement, e: EventBase): EventBase {
  return {
    currentTarget: target,
    shiftKey: e.shiftKey,
    ctrlKey: e.ctrlKey,
    metaKey: e.metaKey,
    altKey: e.altKey
  };
}

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface EventPoint {
  clientX: number;
  clientY: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
}

function getPointClientRect(point: EventPoint): Rect {
  const offsetX = (point.width && point.width / 2) || point.radiusX || 0;
  const offsetY = (point.height && point.height / 2) || point.radiusY || 0;

  return {
    top: point.clientY - offsetY,
    right: point.clientX + offsetX,
    bottom: point.clientY + offsetY,
    left: point.clientX - offsetX
  };
}

function areRectanglesOverlapping(a: Rect, b: Rect) {
  // check if they cannot overlap on x axis
  if (a.left > b.right || b.left > a.right) {
    return false;
  }
  // check if they cannot overlap on y axis
  if (a.top > b.bottom || b.top > a.bottom) {
    return false;
  }
  return true;
}

function isPointOverTarget(point: EventPoint, target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const pointRect = getPointClientRect(point);
  return areRectanglesOverlapping(rect, pointRect);
}

function shouldPreventDefault(target: HTMLElement) {
  // We cannot prevent default if the target is a draggable element.
  return !target.draggable;
}

function shouldPreventDefaultKeyboard(target: Element) {
  return !(
    (target.tagName === "INPUT" || target.tagName === "BUTTON") &&
    (target as HTMLButtonElement | HTMLInputElement).type === "submit"
  );
}

function isVirtualPointerEvent(event: PointerEvent) {
  // If the pointer size is zero, then we assume it's from a screen reader.
  // Android TalkBack double tap will sometimes return a event with width and height of 1
  // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
  // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
  // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216
  return (
    (event.width === 0 && event.height === 0) ||
    (event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0)
  );
}
