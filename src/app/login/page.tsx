"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { createClient } from "~/lib/supabase/client";

function LoginInner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setMessage(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/trips`,
      },
    });
    if (oauthError) {
      setMessage(oauthError.message);
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden border-2 border-primary/20 bg-card/90 shadow-xl shadow-primary/10 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-primary/15 via-secondary/50 to-accent/40 px-1 py-3 text-center">
        <span className="font-display text-3xl" aria-hidden>
          🎒
        </span>
      </div>
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-display text-2xl font-bold">
          You&apos;re almost here
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Google sign-in so we know who&apos;s hyped for which idea—no spam, no
          mystery accounts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            Oops—sign-in glitched. Give it another shot?
          </p>
        ) : null}
        {message ? (
          <p className="text-destructive text-sm" role="alert">
            {message}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full shadow-md"
          disabled={loading}
          onClick={() => void signInWithGoogle()}
        >
          {loading ? "Redirecting you…" : "Continue with Google"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-primary/10 bg-muted/30 pt-4">
        <Button asChild variant="link" className="text-muted-foreground">
          <Link href="/">← Back to home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="container flex min-h-[65vh] items-center justify-center page-shell">
      <Suspense
        fallback={
          <p className="font-display text-muted-foreground text-sm">Loading…</p>
        }
      >
        <LoginInner />
      </Suspense>
    </main>
  );
}
