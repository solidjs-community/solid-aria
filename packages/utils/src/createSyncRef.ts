import { Accessor, createEffect, onCleanup } from "solid-js";

interface ContextValue<T> {
  ref: Accessor<T | undefined>;
}

/**
 * Syncs ref from context with ref passed to primitve.
 */
export function createSyncRef<T>(context?: ContextValue<T>, ref?: Accessor<T | undefined>) {
  createEffect(() => {
    if (context && ref) {
      context.ref = () => ref();

      onCleanup(() => {
        context.ref = () => undefined;
      });
    }
  });
}
