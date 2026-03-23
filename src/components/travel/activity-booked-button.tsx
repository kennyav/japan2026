"use client";

import { useTransition } from "react";

import { setItemResponse } from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  itemId: string;
  tripId: string;
  /** Current user's response for this item */
  current: "interested" | "booked" | "not_interested" | null;
};

export function ActivityBookedButton({ itemId, tripId, current }: Props) {
  const [isPending, startTransition] = useTransition();
  const isBooked = current === "booked";

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      disabled={isPending}
      className={cn(
        "shrink-0 rounded-full border-2 font-bold",
        isBooked
          ? "border-transparent bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md ring-2 ring-emerald-400/40 ring-offset-2 hover:from-emerald-500/90 hover:to-teal-600/90"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 hover:bg-emerald-500/20 dark:text-emerald-100",
      )}
      onClick={() => {
        startTransition(async () => {
          await setItemResponse(itemId, tripId, "booked");
        });
      }}
    >
      {isBooked ? "✓ Booked" : "Booked"}
    </Button>
  );
}
