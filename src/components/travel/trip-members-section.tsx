"use client";

import { cn } from "~/lib/utils";

import { AddTripMemberForm } from "~/components/travel/add-trip-member-form";

export type TripMemberRow = {
  userId: string;
  role: "owner" | "member";
  displayName: string;
};

type PanelProps = {
  tripId: string;
  members: TripMemberRow[];
  isOwner: boolean;
  className?: string;
};

export function TripMembersPanel({
  tripId,
  members,
  isOwner,
  className,
}: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-primary/10 bg-card p-4 shadow-md sm:p-5",
        className,
      )}
    >
      <h2 className="font-display text-lg font-bold text-foreground sm:text-xl">
        Who&apos;s on this trip
      </h2>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        Owners can invite more people by the Google email they use to sign in.
      </p>
      <ul className="mt-3 space-y-2 sm:mt-4">
        {members.map((m) => (
          <li
            key={m.userId}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm"
          >
            <span className="font-medium text-foreground">{m.displayName}</span>
            <span className="text-muted-foreground capitalize">{m.role}</span>
          </li>
        ))}
      </ul>
      {isOwner ? <AddTripMemberForm tripId={tripId} /> : null}
    </div>
  );
}
