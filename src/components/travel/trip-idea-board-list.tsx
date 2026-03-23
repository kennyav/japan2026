"use client";

import { ItineraryItemCreatorShell } from "~/components/travel/itinerary-item-creator-shell";
import {
  IdeaItemModalTrigger,
  type IdeaItemModalSummary,
} from "~/components/travel/idea-item-modal";
import { ItemResponseButtons } from "~/components/travel/item-response-buttons";

type ItemResponse = {
  user_id: string;
  status: "interested" | "booked" | "not_interested";
};

export type TripIdeaBoardItem = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  location: string | null;
  link: string | null;
  latitude: number | null;
  longitude: number | null;
  price_level: number | null;
  total_cost: number | null;
  created_by: string | null;
  item_responses: ItemResponse[] | null;
};

type ProfileById = Record<string, { full_name: string | null }>;

type Props = {
  variant: "page" | "fullscreen";
  list: TripIdeaBoardItem[];
  tripId: string;
  userId: string;
  profileById: ProfileById;
  tripTravelerCount: number;
};

const typeEmoji: Record<string, string> = {
  activity: "🎯",
  hotel: "🏨",
  transport: "🚇",
  meal: "🍜",
  other: "✨",
};

function numOrNull(v: unknown): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatMoneyAmount(n: number): string {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function displayNameForMember(
  userId: string,
  profileById: ProfileById,
): string {
  const raw = profileById[userId]?.full_name;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  return trimmed.length > 0 ? trimmed : "Traveler";
}

function namesInCategory(
  responses: ItemResponse[] | null | undefined,
  status: ItemResponse["status"],
  profileById: ProfileById,
): string[] {
  const names =
    responses
      ?.filter((r) => r.status === status)
      .map((r) => displayNameForMember(r.user_id, profileById)) ?? [];
  return [...names].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

export function TripIdeaBoardList({
  variant,
  list,
  tripId,
  userId,
  profileById,
  tripTravelerCount,
}: Props) {
  const modalEnabled = variant === "page";

  if (!list.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-primary/25 bg-accent/40 px-6 py-10 text-center">
        <p className="text-lg text-muted-foreground">
          Crickets! 🦗 Add the first idea above—ramen, shrine, nap spot,
          whatever.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-5 pl-0 lg:grid-cols-2">
      {list.map((item) => {
        const mine =
          item.item_responses?.find((r) => r.user_id === userId)?.status ?? null;
        const myTakeForButtons =
          mine === "interested" || mine === "not_interested" ? mine : null;
        const namesInterestedRaw = namesInCategory(
          item.item_responses,
          "interested",
          profileById,
        );
        const namesBookedLegacy = namesInCategory(
          item.item_responses,
          "booked",
          profileById,
        );
        const namesInterested = [
          ...namesInterestedRaw,
          ...namesBookedLegacy,
        ].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
        const namesPassing = namesInCategory(
          item.item_responses,
          "not_interested",
          profileById,
        );
        const emoji = typeEmoji[item.type] ?? "✨";
        const hasCoords =
          item.latitude != null &&
          item.longitude != null &&
          Number.isFinite(item.latitude) &&
          Number.isFinite(item.longitude);
        const isCreator = item.created_by === userId;
        const priceLevel = numOrNull(item.price_level);
        const totalCost = numOrNull(item.total_cost);
        const editableItem = {
          id: item.id,
          type: item.type,
          title: item.title,
          description: item.description,
          location: item.location,
          link: item.link,
          latitude: item.latitude,
          longitude: item.longitude,
          price_level: priceLevel,
          total_cost: totalCost,
        };

        const intoItCount = namesInterested.length;

        const costParts: string[] = [];
        if (
          priceLevel != null &&
          Number.isInteger(priceLevel) &&
          priceLevel >= 1 &&
          priceLevel <= 4
        ) {
          costParts.push("$".repeat(priceLevel));
        }
        if (totalCost != null) {
          costParts.push(`Total ${formatMoneyAmount(totalCost)}`);
        }

        const itemBody = (
          <div className="min-w-0 flex-1">
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
              {emoji} {item.type}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 gap-y-2">
              <h3 className="font-display text-xl font-bold text-foreground">
                {item.title}
              </h3>
            </div>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            ) : null}
            {costParts.length > 0 ? (
              <p className="mt-2 text-sm font-medium text-foreground">
                {costParts.join(" · ")}
              </p>
            ) : null}
            {totalCost != null ? (
              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {intoItCount > 0 ? (
                  <p>
                    ~
                    {formatMoneyAmount(
                      Math.round((totalCost / intoItCount) * 100) / 100,
                    )}{" "}
                    each if {intoItCount}{" "}
                    {intoItCount === 1 ? "person is" : "people are"} into it
                  </p>
                ) : (
                  <p>
                    No one&apos;s into it yet—per-person among interested shows
                    once people respond.
                  </p>
                )}
                {tripTravelerCount > 0 ? (
                  <p>
                    ~
                    {formatMoneyAmount(
                      Math.round((totalCost / tripTravelerCount) * 100) / 100,
                    )}{" "}
                    each if all {tripTravelerCount}{" "}
                    {tripTravelerCount === 1 ? "traveler" : "travelers"} on the
                    trip split it
                  </p>
                ) : null}
              </div>
            ) : null}
            {item.location ? (
              <p className="mt-1 text-sm text-muted-foreground">
                📍 {item.location}
              </p>
            ) : null}
            {hasCoords ? (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                🌐 {item.latitude!.toFixed(4)}, {item.longitude!.toFixed(4)}
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
        );

        const modalSummary: IdeaItemModalSummary = {
          id: item.id,
          title: item.title,
          type: item.type,
          emoji,
          description: item.description,
          location: item.location,
          link: item.link,
        };

        const liExtras = hasCoords
          ? ({ "data-globe-focus-item": item.id } as const)
          : {};

        return (
          <IdeaItemModalTrigger
            key={item.id}
            enabled={modalEnabled}
            tripId={tripId}
            item={modalSummary}
            {...liExtras}
          >
            <div data-globe-focus-hit="">
              {isCreator ? (
                <ItineraryItemCreatorShell
                  tripId={tripId}
                  item={editableItem}
                  hasCoords={hasCoords}
                >
                  {itemBody}
                </ItineraryItemCreatorShell>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
                  {itemBody}
                </div>
              )}
            </div>
            <div
              data-stop-item-modal
              className="mt-5 space-y-3 border-t border-primary/10 pt-4"
            >
              <p className="text-xs font-medium text-muted-foreground">
                Your take
              </p>
              <ItemResponseButtons
                itemId={item.id}
                tripId={tripId}
                current={myTakeForButtons}
              />
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Into it: </span>
                  {namesInterested.length ? namesInterested.join(", ") : "—"}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Passing: </span>
                  {namesPassing.length ? namesPassing.join(", ") : "—"}
                </p>
              </div>
            </div>
          </IdeaItemModalTrigger>
        );
      })}
    </ul>
  );
}
