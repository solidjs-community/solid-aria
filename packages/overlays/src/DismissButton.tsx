import { AriaLabelingProps, DOMProps } from "@solid-aria/types";
import { mergeAriaLabels } from "@solid-aria/utils";
import { createVisuallyHidden } from "@solid-aria/visually-hidden";
import { splitProps } from "solid-js";

interface DismissButtonProps extends AriaLabelingProps, DOMProps {
  /**
   * Called when the dismiss button is activated.
   */
  onDismiss?: () => void;
}

/**
 * A visually hidden button that can be used to allow screen reader
 * users to dismiss a modal or popup when there is no visual
 * affordance to do so.
 */
export function DismissButton(props: DismissButtonProps) {
  const [local, others] = splitProps(props, ["onDismiss"]);

  const { visuallyHiddenProps } = createVisuallyHidden();

  const { ariaLabelsProps } = mergeAriaLabels(others, "Dismiss");

  const onClick = () => local.onDismiss?.();

  return (
    <div {...visuallyHiddenProps()}>
      <button {...ariaLabelsProps()} tabIndex={-1} onClick={onClick} />
    </div>
  );
}
