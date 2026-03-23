"use client";

import { ChevronDown, Lightbulb } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { cn } from "~/lib/utils";

import { AddItineraryItemForm } from "~/components/travel/add-itinerary-item-form";

type Props = { tripId: string };

export function AddIdeaCollapsible({ tripId }: Props) {
  return (
    <Collapsible defaultOpen={false} className="group">
      <CollapsibleTrigger
        type="button"
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-r from-accent/25 to-secondary/15 px-4 py-3 text-left shadow-sm outline-none transition-colors",
          "hover:border-primary/35 hover:from-accent/35 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "data-[state=open]:border-primary/30 data-[state=open]:from-accent/30",
        )}
      >
        <Lightbulb className="size-5 shrink-0 text-primary" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="font-display block font-bold text-foreground">
            Add another idea
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Expand to add a place or activity to the board
          </span>
        </span>
        <ChevronDown
          className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-none">
        <div className="pt-4">
          <AddItineraryItemForm tripId={tripId} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
