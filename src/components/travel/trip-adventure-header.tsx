"use client";

import Link from "next/link";
import { ChevronDown, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

import { TripMembersPanel, type TripMemberRow } from "./trip-members-section";

type Props = {
  tripTitle: string;
  tripMeta: string;
  tripId: string;
  members: TripMemberRow[];
  isOwner: boolean;
};

function membersSummaryLine(members: TripMemberRow[]): string {
  if (members.length === 0) return "No one yet";
  const names = members.map((m) => m.displayName);
  if (names.length === 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]}, ${names[1]}`;
  return `${names[0]}, ${names[1]} +${names.length - 2}`;
}

export function TripAdventureHeader({
  tripTitle,
  tripMeta,
  tripId,
  members,
  isOwner,
}: Props) {
  const summary = membersSummaryLine(members);

  return (
    <div className="space-y-2">
      <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-full">
        <Link href="/trips">← All trips</Link>
      </Button>
      <p className="font-display text-sm font-semibold text-primary">
        This adventure
      </p>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            {tripTitle}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">{tripMeta}</p>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "group flex w-full shrink-0 items-center gap-2 rounded-2xl border-2 border-primary/15 bg-muted/35 px-3 py-2 text-left text-sm shadow-sm outline-none transition-colors lg:max-w-sm xl:max-w-md",
                "hover:border-primary/25 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "data-[state=open]:border-primary/25 data-[state=open]:bg-muted/45",
              )}
            >
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
                aria-hidden
              />
              <Users className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-foreground">
                  {members.length}{" "}
                  {members.length === 1 ? "traveler" : "travelers"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {summary}
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            className="w-[min(calc(100vw-1.5rem),22rem)] sm:w-[min(calc(100vw-2rem),26rem)]"
            collisionPadding={16}
          >
            <TripMembersPanel
              tripId={tripId}
              members={members}
              isOwner={isOwner}
              className="border-0 shadow-none"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
