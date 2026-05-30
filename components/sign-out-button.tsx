import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <SubmitButton
        variant="outline"
        size="sm"
        icon={<LogOut />}
        pendingText="Wylogowuję…"
      >
        Wyloguj
      </SubmitButton>
    </form>
  );
}
