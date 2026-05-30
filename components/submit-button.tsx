"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type ButtonProps = React.ComponentProps<typeof Button>;

/**
 * Submit button that automatically reflects the pending state of its parent
 * server-action <form> via `useFormStatus`. While submitting it shows a spinner,
 * disables itself, and optionally swaps the label for `pendingText`.
 *
 * Pass the leading icon via `icon` (not inside children) so it can be replaced
 * by the spinner during submission.
 */
export function SubmitButton({
  children,
  icon,
  pendingText,
  disabled,
  ...props
}: ButtonProps & {
  icon?: React.ReactNode;
  pendingText?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={disabled || pending} aria-busy={pending} {...props}>
      {pending ? <Spinner className="size-4" /> : icon}
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}
