"use client";

import { useLinkStatus } from "next/link";
import { Spinner } from "@/components/ui/spinner";

/**
 * Shows a spinner while the parent <Link> navigation is pending.
 * Must be rendered as a descendant of a <Link> component.
 * When not pending, it renders `children` (use it to reserve layout space).
 */
export function LinkLoadingIndicator({
  children = null,
  className = "size-4",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useLinkStatus();
  return pending ? <Spinner className={className} /> : <>{children}</>;
}
