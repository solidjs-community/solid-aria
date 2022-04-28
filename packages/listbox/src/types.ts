export interface ListBoxOptionMetaData {
  /**
   * A unique key for identifiying the option.
   */
  key: string;

  /**
   * A ref to the HTML option element.
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
