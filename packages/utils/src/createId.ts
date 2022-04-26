import { Accessor, createSignal, createUniqueId, onMount } from "solid-js";

/**
 * Create a universal id that is stable across server/browser.
 * @param prefix An optional prefix for the generated id.
 * @returns The generated id.
 */
export function createId(prefix = "solid-aria"): string {
  return `${prefix}-${createUniqueId()}`;
}

/**
 * Create a universal id that is stable across server/browser.
 * The id will be removed if not attached to an element on mount.
 * @param prefix An optional prefix for the generated id.
 * @returns An accessor for the generated id.
 */
export function createSlotId(prefix?: string): Accessor<string | undefined> {
  const [id, setId] = createSignal<string | undefined>(createId(prefix));

  onMount(() => {
    const _id = id();

    if (_id && !document.getElementById(_id)) {
      setId(undefined);
    }
  });

  return id;
}
