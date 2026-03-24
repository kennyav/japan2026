"use client";

import { useMemo, useState } from "react";

import { ItineraryItemCreatorShell } from "~/components/travel/itinerary-item-creator-shell";
import {
  IdeaItemModalTrigger,
  type IdeaItemModalSummary,
} from "~/components/travel/idea-item-modal";
import { ItemResponseButtons } from "~/components/travel/item-response-buttons";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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

const TYPE_ORDER = ["activity", "hotel", "transport", "meal", "other"] as const;

const ALL = "__all__";
const NO_LOCATION = "__none__";

type GroupMode = "flat" | "type" | "location";

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

function normalizedLocationLabel(item: TripIdeaBoardItem): string {
  const t = item.location?.trim();
  return t && t.length > 0 ? t : "No location";
}

function sortTypeKeys(types: Set<string>): string[] {
  const order = TYPE_ORDER as readonly string[];
  const known = order.filter((t) => types.has(t));
  const rest = [...types]
    .filter((t) => !order.includes(t))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return [...known, ...rest];
}

function sortLocationKeys(keys: string[]): string[] {
  const noLoc = keys.filter((k) => k === "No location");
  const rest = keys
    .filter((k) => k !== "No location")
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return [...rest, ...noLoc];
}

type CardProps = {
  item: TripIdeaBoardItem;
  tripId: string;
  userId: string;
  profileById: ProfileById;
  tripTravelerCount: number;
  modalEnabled: boolean;
};

function IdeaBoardItemCard({
  item,
  tripId,
  userId,
  profileById,
  tripTravelerCount,
  modalEnabled,
}: CardProps) {
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
              No one&apos;s into it yet—per-person among interested shows once
              people respond.
            </p>
          )}
          {tripTravelerCount > 0 ? (
            <p>
              ~
              {formatMoneyAmount(
                Math.round((totalCost / tripTravelerCount) * 100) / 100,
              )}{" "}
              each if all {tripTravelerCount}{" "}
              {tripTravelerCount === 1 ? "traveler" : "travelers"} on the trip
              split it
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
        <p className="text-xs font-medium text-muted-foreground">Your take</p>
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
}

function ideaGridClassName(variant: "page" | "fullscreen") {
  return variant === "page"
    ? "grid list-none grid-cols-1 gap-5 pl-0 lg:grid-cols-2"
    : "grid list-none grid-cols-1 gap-5 pl-0 lg:grid-cols-1";
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

  const [groupMode, setGroupMode] = useState<GroupMode>("flat");
  const [filterType, setFilterType] = useState<string>(ALL);
  const [filterLocation, setFilterLocation] = useState<string>(ALL);

  const uniqueTypes = useMemo(() => {
    const s = new Set(list.map((i) => i.type).filter(Boolean));
    return sortTypeKeys(s);
  }, [list]);

  const uniqueLocations = useMemo(() => {
    const labels = new Set<string>();
    for (const item of list) {
      labels.add(normalizedLocationLabel(item));
    }
    return sortLocationKeys([...labels]);
  }, [list]);

  const filtered = useMemo(() => {
    return list.filter((item) => {
      if (filterType !== ALL && item.type !== filterType) return false;
      if (filterLocation === ALL) return true;
      const loc = item.location?.trim() ?? "";
      if (filterLocation === NO_LOCATION) return loc.length === 0;
      return loc === filterLocation;
    });
  }, [list, filterType, filterLocation]);

  const groupedByType = useMemo(() => {
    const m = new Map<string, TripIdeaBoardItem[]>();
    for (const item of filtered) {
      const k = item.type || "other";
      const arr = m.get(k) ?? [];
      arr.push(item);
      m.set(k, arr);
    }
    const keys = sortTypeKeys(new Set(m.keys()));
    return keys.map((k) => ({ key: k, items: m.get(k) ?? [] }));
  }, [filtered]);

  const groupedByLocation = useMemo(() => {
    const m = new Map<string, TripIdeaBoardItem[]>();
    for (const item of filtered) {
      const k = normalizedLocationLabel(item);
      const arr = m.get(k) ?? [];
      arr.push(item);
      m.set(k, arr);
    }
    const keys = sortLocationKeys([...m.keys()]);
    return keys.map((k) => ({ key: k, items: m.get(k) ?? [] }));
  }, [filtered]);

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

  const cardProps = {
    tripId,
    userId,
    profileById,
    tripTravelerCount,
    modalEnabled,
  };

  const renderCards = (items: TripIdeaBoardItem[]) => (
    <ul className={ideaGridClassName(variant)}>
      {items.map((item) => (
        <IdeaBoardItemCard key={item.id} item={item} {...cardProps} />
      ))}
    </ul>
  );

  const emptyFilter =
    filtered.length === 0 ? (
      <div className="rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 px-6 py-8 text-center text-sm text-muted-foreground">
        Nothing matches these filters. Try &ldquo;All&rdquo; or a different
        combination.
      </div>
    ) : null;

  const toolbar =
    variant === "page" ? (
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-primary/10 bg-card/50 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
        <div className="space-y-1.5">
          <Label htmlFor="idea-group-by" className="text-xs text-muted-foreground">
            Group by
          </Label>
          <Select
            value={groupMode}
            onValueChange={(v) => setGroupMode(v as GroupMode)}
          >
            <SelectTrigger id="idea-group-by" size="sm" className="w-[min(100%,220px)]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent className="z-[140]">
              <SelectItem value="flat">All together</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="idea-filter-type" className="text-xs text-muted-foreground">
            Type
          </Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="idea-filter-type" size="sm" className="w-[min(100%,200px)]">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="z-[140]">
              <SelectItem value={ALL}>All types</SelectItem>
              {uniqueTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {typeEmoji[t] ? `${typeEmoji[t]} ` : ""}
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="idea-filter-location"
            className="text-xs text-muted-foreground"
          >
            Location
          </Label>
          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger
              id="idea-filter-location"
              size="sm"
              className="w-[min(100%,260px)]"
            >
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent className="z-[140]">
              <SelectItem value={ALL}>All locations</SelectItem>
              <SelectItem value={NO_LOCATION}>No location</SelectItem>
              {uniqueLocations
                .filter((l) => l !== "No location")
                .map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    📍 {loc}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    ) : null;

  if (variant === "fullscreen") {
    return renderCards(list);
  }

  return (
    <div>
      {toolbar}
      {emptyFilter}
      {filtered.length === 0
        ? null
        : groupMode === "flat"
          ? renderCards(filtered)
          : groupMode === "type"
            ? (
                <div className="space-y-10">
                  {groupedByType.map(({ key, items }) =>
                    items.length ? (
                      <section key={key} className="space-y-3">
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {typeEmoji[key] ? `${typeEmoji[key]} ` : ""}
                          <span className="capitalize">{key}</span>
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({items.length})
                          </span>
                        </h3>
                        {renderCards(items)}
                      </section>
                    ) : null,
                  )}
                </div>
              )
            : (
                <div className="space-y-10">
                  {groupedByLocation.map(({ key, items }) =>
                    items.length ? (
                      <section key={key} className="space-y-3">
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {key === "No location" ? "No location" : `📍 ${key}`}
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({items.length})
                          </span>
                        </h3>
                        {renderCards(items)}
                      </section>
                    ) : null,
                  )}
                </div>
              )}
    </div>
  );
}
