import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "~/components/ui/button";
import { ActivityBookedButton } from "~/components/travel/activity-booked-button";
import { AddItineraryItemForm } from "~/components/travel/add-itinerary-item-form";
import { ItemResponseButtons } from "~/components/travel/item-response-buttons";
import {
  TripMembersSection,
  type TripMemberRow,
} from "~/components/travel/trip-members-section";
import { createClient } from "~/lib/supabase/server";

type ItemResponse = {
  user_id: string;
  status: "interested" | "booked" | "not_interested";
};

type ItineraryItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  location: string | null;
  link: string | null;
  item_responses: ItemResponse[] | null;
};

const typeEmoji: Record<string, string> = {
  activity: "🎯",
  hotel: "🏨",
  transport: "🚇",
  meal: "🍜",
  other: "✨",
};

type PageProps = { params: Promise<{ tripId: string }> };

type TripMemberDbRow = {
  user_id: string;
  role: string;
  joined_at: string;
};

type ProfileDbRow = {
  id: string;
  full_name: string | null;
};

export default async function TripDetailPage({ params }: PageProps) {
  const { tripId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, title, destination, start_date, end_date")
    .eq("id", tripId)
    .maybeSingle();

  if (tripError || !trip) notFound();

  const { data: memberRows } = await supabase
    .from("trip_members")
    .select("user_id, role, joined_at")
    .eq("trip_id", tripId)
    .order("joined_at", { ascending: true });

  const memberList = (memberRows ?? []) as TripMemberDbRow[];
  const ids = memberList.map((m) => m.user_id);
  const profileById: Record<string, { full_name: string | null }> = {};
  if (ids.length) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", ids);
    for (const p of (profs ?? []) as ProfileDbRow[]) {
      profileById[p.id] = { full_name: p.full_name };
    }
  }

  const members: TripMemberRow[] = memberList.map((m) => ({
    userId: m.user_id,
    role: m.role === "owner" ? "owner" : "member",
    displayName:
      profileById[m.user_id]?.full_name?.trim() ?? "Traveler",
  }));

  const isOwner = memberList.some(
    (m) => m.user_id === user.id && m.role === "owner",
  );

  const { data: items, error: itemsError } = await supabase
    .from("itinerary_items")
    .select("id, type, title, description, location, link, item_responses(user_id, status)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    return (
      <main className="mx-auto w-full max-w-2xl page-shell">
        <p className="text-destructive text-sm">{itemsError.message}</p>
      </main>
    );
  }

  const list = (items ?? []) as ItineraryItem[];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-12 page-shell">
      <div className="space-y-2">
        <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-full">
          <Link href="/trips">← All trips</Link>
        </Button>
        <p className="font-display text-sm font-semibold text-primary">
          This adventure
        </p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          {trip.title}
        </h1>
        <p className="text-muted-foreground">
          {[trip.destination, trip.start_date, trip.end_date]
            .filter(Boolean)
            .join(" · ") || "Drop dates & place whenever—no pressure"}
        </p>
      </div>

      <TripMembersSection tripId={tripId} members={members} isOwner={isOwner} />

      <AddItineraryItemForm tripId={tripId} />

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Idea board
        </h2>
        {!list.length ? (
          <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-accent/40 px-6 py-10 text-center">
            <p className="text-lg text-muted-foreground">
              Crickets! 🦗 Add the first idea above—ramen, shrine, nap spot,
              whatever.
            </p>
          </div>
        ) : (
          <ul className="space-y-5">
            {list.map((item) => {
              const mine =
                item.item_responses?.find((r) => r.user_id === user.id)?.status ??
                null;
              const counts = { interested: 0, booked: 0, not_interested: 0 };
              for (const r of item.item_responses ?? []) {
                counts[r.status] += 1;
              }
              const emoji = typeEmoji[item.type] ?? "✨";
              const isActivity = item.type === "activity";
              return (
                <li
                  key={item.id}
                  className="rounded-2xl border-2 border-primary/10 bg-card p-5 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
                        {emoji} {item.type}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 gap-y-2">
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {item.title}
                        </h3>
                        {isActivity ? (
                          <ActivityBookedButton
                            itemId={item.id}
                            tripId={tripId}
                            current={mine}
                          />
                        ) : null}
                      </div>
                      {item.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      ) : null}
                      {item.location ? (
                        <p className="mt-1 text-sm text-muted-foreground">
                          📍 {item.location}
                        </p>
                      ) : null}
                      {item.link ? (
                        <a
                          href={item.link}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open link ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 border-t border-primary/10 pt-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Your take
                    </p>
                    <ItemResponseButtons
                      itemId={item.id}
                      tripId={tripId}
                      current={mine}
                    />
                    <p className="text-xs text-muted-foreground">
                      Crew: {counts.interested} into it · {counts.booked} booked
                      · {counts.not_interested} passing
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
