import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { CreateTripForm } from "~/components/travel/create-trip-form";
import { createClient } from "~/lib/supabase/server";

export default async function NewTripPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 page-shell">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/trips">← Trips</Link>
        </Button>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-primary">
          Fresh start
        </p>
        <h1 className="font-display mt-1 text-3xl font-bold text-foreground">
          Spin up a trip
        </h1>
        <p className="mt-2 text-muted-foreground">
          Name it something you&apos;ll smile at in a few months. You can tweak
          later.
        </p>
      </div>
      <CreateTripForm />
    </main>
  );
}
