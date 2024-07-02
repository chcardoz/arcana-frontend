import { Button } from "@/components/ui/Button";
import { type Provider } from "@supabase/supabase-js";
import { Github } from "lucide-react";
import { oAuthSignIn } from "./actions";

type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};

export function OAuthButton() {
  const providers: OAuthProvider[] = [
    {
      name: "github",
      displayName: "GitHub",
      icon: <Github className="size-5" />,
    },
  ];

  return (
    <>
      {providers.map((provider, index) => (
        <form id="oauth-signin-form" key={index}>
          <Button
            className="flex w-full items-center justify-center gap-2"
            variant="outline"
            key={index}
            formAction={oAuthSignIn}
          >
            <input type="hidden" name="provider" value={provider.name} />
            {provider.icon}
            Login with {provider.displayName}
          </Button>
        </form>
      ))}
    </>
  );
}
