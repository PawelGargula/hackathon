import { signIn } from "@/lib/auth";
import { SubmitButton } from "@/components/submit-button";

export function SignInButton({
  provider = "google",
  redirectTo = "/dashboard",
  children,
  className,
}: {
  provider?: string;
  redirectTo?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider, { redirectTo });
      }}
    >
      <SubmitButton className={className} pendingText="Logowanie…">
        {children ?? "Zaloguj się przez Google"}
      </SubmitButton>
    </form>
  );
}
