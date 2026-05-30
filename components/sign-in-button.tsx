import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SignInButton({
  provider = "google",
  redirectTo = "/dashboard",
  children,
}: {
  provider?: string;
  redirectTo?: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider, { redirectTo });
      }}
    >
      <Button type="submit">{children ?? "Zaloguj się przez Google"}</Button>
    </form>
  );
}
