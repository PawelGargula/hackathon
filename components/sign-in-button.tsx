import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

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
      <Button type="submit" className={className}>
        {children ?? "Zaloguj się przez Google"}
      </Button>
    </form>
  );
}
