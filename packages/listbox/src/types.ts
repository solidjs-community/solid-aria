export interface ListBoxOptionMetaData {
  /**
   * A ref to the option element.
   */
  ref: HTMLElement;

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
