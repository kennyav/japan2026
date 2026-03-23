import { notFound, redirect } from "next/navigation";
import { AddIdeaCollapsible } from "~/components/travel/add-idea-collapsible";
import type { TripMemberRow } from "~/components/travel/trip-members-section";
import {
  TripIdeaBoardList,
  type TripIdeaBoardItem,
} from "~/components/travel/trip-idea-board-list";
import { TripAdventureHeader } from "~/components/travel/trip-adventure-header";
import { TripGlobeFullScreenLayout } from "~/components/travel/trip-globe-fullscreen-layout";
import { createClient } from "~/lib/supabase/server";

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
    .select(
      "id, type, title, description, location, link, latitude, longitude, price_level, total_cost, created_by, item_responses(user_id, status)",
    )
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    return (
      <main className="mx-auto w-full max-w-screen-2xl page-shell-wide">
        <p className="text-destructive text-sm">{itemsError.message}</p>
      </main>
    );
  }

  const list = (items ?? []) as TripIdeaBoardItem[];
  const tripTravelerCount = memberList.length;

  const globePins = list
    .filter(
      (
        item,
      ): item is TripIdeaBoardItem & {
        latitude: number;
        longitude: number;
      } =>
        item.latitude != null &&
        item.longitude != null &&
        Number.isFinite(item.latitude) &&
        Number.isFinite(item.longitude),
    )
    .map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      lat: item.latitude,
      lng: item.longitude,
      location: item.location,
      link: item.link,
    }));

  const ideaBoardShared = {
    list,
    tripId,
    userId: user.id,
    profileById,
    tripTravelerCount,
  };

  return (
    <main className="mx-auto w-full max-w-screen-2xl space-y-12 page-shell-wide">
      <TripAdventureHeader
        tripTitle={typeof trip.title === "string" ? trip.title : ""}
        tripMeta={
          [trip.destination, trip.start_date, trip.end_date]
            .filter((x): x is string => typeof x === "string" && x.length > 0)
            .join(" · ") || "Drop dates & place whenever—no pressure"
        }
        tripId={tripId}
        members={members}
        isOwner={isOwner}
      />

      <AddIdeaCollapsible tripId={tripId} />

      <TripGlobeFullScreenLayout
        pins={globePins}
        globeEmpty={
          <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-accent/30 px-6 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No pins yet—add an address or coordinates under &ldquo;Globe
              pin&rdquo; when creating an idea, or use &ldquo;Globe
              coordinates&rdquo; on an idea you added.
            </p>
          </div>
        }
        ideaBoard={<TripIdeaBoardList variant="page" {...ideaBoardShared} />}
        ideaBoardOverlay={
          <TripIdeaBoardList variant="fullscreen" {...ideaBoardShared} />
        }
      />
    </main>
  );
}
