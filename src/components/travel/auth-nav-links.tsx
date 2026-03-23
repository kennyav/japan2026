"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { createClient } from "~/lib/supabase/client";

export function AuthNavLinks() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  if (email === undefined) {
    return (
      <span className="text-muted-foreground text-sm" aria-hidden>
        …
      </span>
    );
  }

  if (!email) {
    return (
      <Button asChild variant="ghost" size="sm" className="rounded-full">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline md:max-w-[180px]">
        Hey, {email.split("@")[0]}
      </span>
      <form action="/auth/signout" method="post">
        <Button type="submit" variant="outline" size="sm" className="rounded-full">
          Sign out
        </Button>
      </form>
    </div>
  );
}
