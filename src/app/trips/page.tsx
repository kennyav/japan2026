import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { createClient } from "~/lib/supabase/server";

type TripListRow = {
  id: string;
  title: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export default async function TripsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: tripsRaw, error } = await supabase
    .from("trips")
    .select("id, title, destination, start_date, end_date, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto w-full max-w-2xl page-shell">
        <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-display text-lg font-semibold text-destructive">
            Couldn&apos;t load trips
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Double-check Supabase env vars and that migrations ran. Raw message:{" "}
            {error.message}
          </p>
        </div>
      </main>
    );
  }

  const trips = (tripsRaw ?? []) as TripListRow[];

  return (
    <main className="mx-auto w-full max-w-4xl space-y-10 page-shell">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-primary">
            Your adventures
          </p>
          <h1 className="font-display mt-1 text-4xl font-bold text-foreground">
            Trips
          </h1>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Pick a trip to see ideas and tap your vibe. Add a new one if
            we&apos;re plotting another leg.
          </p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/trips/new">+ New trip</Link>
        </Button>
      </div>

      {!trips.length ? (
        <Card className="border-dashed border-2 border-primary/25 bg-accent/30">
          <CardHeader className="text-center pb-4">
            <CardTitle className="font-display text-xl">
              Nothing here yet—perfect time to start
            </CardTitle>
            <CardDescription className="text-base">
              Create a trip, then invite friends in Supabase (we&apos;ll make
              invites easier later). For now, you&apos;re the trailblazer.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <li key={trip.id}>
              <Link href={`/trips/${trip.id}`} className="group block">
                <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="font-display text-xl transition-colors group-hover:text-primary">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {[trip.destination, trip.start_date, trip.end_date]
                        .filter(Boolean)
                        .join(" · ") || "Dates & place TBD—no stress"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
