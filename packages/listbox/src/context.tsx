import { createContext, useContext } from "solid-js";

import { ListBoxState } from "./createListBoxState";

export const ListBoxContext = createContext<ListBoxState>();

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxContext.Provider.");
  }

  return context;
}
