"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return "••••••@••••••.•••";
  const ext = domain.split(".").pop();
  return `${name.charAt(0)}••••••@••••••.${ext}`;
}

export function EmailDisplay({
  email,
}: {
  email: string | null | undefined;
}) {
  const [isVisible, setIsVisible] = useState(false);

  if (!email) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <p className="break-all">{isVisible ? email : maskEmail(email)}</p>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="hover:text-foreground transition-colors"
        title={isVisible ? "Ukryj email" : "Pokaż email"}
        aria-label={isVisible ? "Ukryj email" : "Pokaż email"}
      >
        {isVisible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}
