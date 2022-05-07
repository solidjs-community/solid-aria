import { HoverEvents, HoverPointerType, PointerType } from "@solid-aria/types";
import { access, MaybeAccessor } from "@solid-primitives/utils";
import { Accessor, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

export interface CreateHoverProps extends HoverEvents {
  /**
   * Whether the hover events should be disabled.
   */
  isDisabled?: MaybeAccessor<boolean | undefined>;
}

export interface HoverElementProps {
  onPointerEnter?: (event: PointerEvent) => void;

  onPointerLeave?: (event: PointerEvent) => void;

  onTouchStart?: () => void;

  onMouseEnter?: (event: MouseEvent) => void;

  onMouseLeave?: (event: MouseEvent) => void;
}

export interface HoverResult {
  /**
   * Props to spread on the target element.
   */
  hoverProps: Accessor<HoverElementProps>;

  /**
   * Whether the target element is hovered.
   */
  isHovered: Accessor<boolean>;
}

// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function setGlobalIgnoreEmulatedMouseEvents() {
  globalIgnoreEmulatedMouseEvents = true;

  // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter
  // with pointerType="mouse" immediately after onPointerUp and before onFocus. On other
  // devices that don't have this quirk, we don't want to ignore a mouse hover sometime in
  // the distant future because a user previously touched the element.
  setTimeout(() => {
    globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

function handleGlobalPointerEvent(e: PointerEvent) {
  if (e.pointerType === "touch") {
    setGlobalIgnoreEmulatedMouseEvents();
  }
}

function setupGlobalTouchEvents() {
  if (typeof document === "undefined") {
    return;
  }

  if (typeof PointerEvent !== "undefined") {
    document.addEventListener("pointerup", handleGlobalPointerEvent);
  } else {
    document.addEventListener("touchend", setGlobalIgnoreEmulatedMouseEvents);
  }

  hoverCount++;

  return () => {
    hoverCount--;

    if (hoverCount > 0) {
      return;
    }

    if (typeof PointerEvent !== "undefined") {
      document.removeEventListener("pointerup", handleGlobalPointerEvent);
    } else {
      document.removeEventListener("touchend", setGlobalIgnoreEmulatedMouseEvents);
    }
  };
}

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export function createHover(props: CreateHoverProps): HoverResult {
  const [isHovered, setIsHovered] = createSignal(false);
  const [ignoreEmulatedMouseEvents, setIgnoreEmulatedMouseEvents] = createSignal(false);
  const [pointerType, setPointerType] = createSignal("");
  const [target, setTarget] = createSignal<HTMLElement | null>(null);

  const triggerHoverStart = (event: Event, pointerType: PointerType) => {
    setPointerType(pointerType);

    const eventCurrentTarget = event.currentTarget as HTMLElement | null;
    const eventTarget = event.target as HTMLElement | null;

    if (
      access(props.isDisabled) ||
      pointerType === "touch" ||
      isHovered() ||
      !eventCurrentTarget?.contains(eventTarget)
    ) {
      return;
    }

    setTarget(eventCurrentTarget);

    props.onHoverStart?.({
      type: "hoverstart",
      target: eventCurrentTarget,
      pointerType: pointerType as HoverPointerType
    });

    props.onHoverChange?.(true);

    setIsHovered(true);
  };

  const triggerHoverEnd = (event: Event, pointerType: PointerType) => {
    setPointerType("");
    setTarget(null);

    if (pointerType === "touch" || !isHovered() || !event.currentTarget) {
      return;
    }

    props.onHoverEnd?.({
      type: "hoverend",
      target: event.currentTarget as HTMLElement,
      pointerType: pointerType as HoverPointerType
    });

    props.onHoverChange?.(false);

    setIsHovered(false);
  };

  const onPointerEnter = (event: PointerEvent) => {
    if (globalIgnoreEmulatedMouseEvents && event.pointerType === "mouse") {
      return;
    }

    triggerHoverStart(event, event.pointerType as PointerType);
  };

  const onPointerLeave = (event: PointerEvent) => {
    const eventCurrentTarget = event.currentTarget as HTMLElement | null;
    const eventTarget = event.target as HTMLElement | null;

    if (access(props.isDisabled) || !eventCurrentTarget?.contains(eventTarget)) {
      return;
    }

    triggerHoverEnd(event, event.pointerType as PointerType);
  };

  const onTouchStart = () => {
    setIgnoreEmulatedMouseEvents(true);
  };

  const onMouseEnter = (event: MouseEvent) => {
    if (!ignoreEmulatedMouseEvents() && !globalIgnoreEmulatedMouseEvents) {
      triggerHoverStart(event, "mouse");
    }

    setIgnoreEmulatedMouseEvents(false);
  };

  const onMouseLeave = (event: MouseEvent) => {
    const eventCurrentTarget = event.currentTarget as HTMLElement | null;
    const eventTarget = event.target as HTMLElement | null;

    if (access(props.isDisabled) || !eventCurrentTarget?.contains(eventTarget)) {
      return;
    }

    triggerHoverEnd(event, "mouse");
  };

  const hoverProps = createMemo(() => {
    if (typeof PointerEvent !== "undefined") {
      return { onPointerEnter, onPointerLeave };
    } else {
      return { onTouchStart, onMouseEnter, onMouseLeave };
    }
  });

  onMount(() => {
    const cleanupFn = setupGlobalTouchEvents();

    onCleanup(() => cleanupFn?.());
  });

  createEffect(
    on(
      () => access(props.isDisabled),
      newValue => {
        // Call the triggerHoverEnd as soon as isDisabled changes to true
        // Safe to call triggerHoverEnd, it will early return if we aren't currently hovering
        if (newValue) {
          triggerHoverEnd({ currentTarget: target() } as Event, pointerType() as PointerType);
        }
      }
    )
  );

  return {
    hoverProps,
    isHovered
  };
}
