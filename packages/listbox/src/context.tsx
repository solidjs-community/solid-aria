import { createContext, JSX, onMount, useContext } from "solid-js";
import { ListBoxOptionMetaData } from "./types";

interface ListBoxProviderProps {
  /**
   * Children of the provider.
   */
  children?: JSX.Element;
}

interface ListBoxContextValue {
  /**
   * Register an option to the listbox.
   */
  registerOption: (key: string, metaData: ListBoxOptionMetaData) => void;

  /**
   * Unregister an option from the listbox.
   */
  unregisterOption: (key: string) => void;
}

const ListBoxContext = createContext<ListBoxContextValue>();

export function ListBoxProvider(props: ListBoxProviderProps) {
  const options = new Map<string, ListBoxOptionMetaData>();

  const registerOption = (key: string, metaData: ListBoxOptionMetaData) => {
    options.set(key, metaData);
  };

  const unregisterOption = (key: string) => {
    options.delete(key);
  };

  const context: ListBoxContextValue = {
    registerOption,
    unregisterOption
  };

  return <ListBoxContext.Provider value={context}>{props.children}</ListBoxContext.Provider>;
}

export function useListBoxContext() {
  const context = useContext(ListBoxContext);

  if (!context) {
    throw new Error("[solid-aria]: useListBoxContext should be used in a ListBoxProvider.");
  }

  return context;
}
