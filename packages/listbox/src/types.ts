import { Key } from "@solid-aria/types";

export interface ListBoxOptionMetaData {
  /**
   * A unique key for the option.
   */
  key: Key;

  /**
   * The value of the option.
   */
  value: string;

  /**
   * A string value for this node, used for features like typeahead.
   */
  textValue: string;

  /**
   * Whether the option is disabled.
   */
  isDisabled: boolean;
}
