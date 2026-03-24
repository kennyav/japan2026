"use client";

import { useState, useTransition } from "react";

import { clearItemResponse, setItemResponse } from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  itemId: string;
  tripId: string;
  isBooked: boolean;
};

export function ItemBookedToggle({ itemId, tripId, isBooked }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setError(null);
    startTransition(async () => {
      if (isBooked) {
        const res = await clearItemResponse(itemId, tripId);
        if (res && "error" in res) setError(res.error ?? "Could not clear booking.");
      } else {
        const res = await setItemResponse(itemId, tripId, "booked");
        if (res && "error" in res) setError(res.error ?? "Could not save.");
      }
    });
  }

  return (
    <div data-stop-item-modal className="shrink-0">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        aria-pressed={isBooked}
        className={cn(
          "rounded-full border-2 font-semibold",
          isBooked
            ? "border-transparent bg-emerald-600 text-white shadow-md hover:bg-emerald-600/90"
            : "border-primary/15 bg-card/80 hover:bg-accent",
          isBooked && "ring-2 ring-primary/25 ring-offset-2",
        )}
        onClick={toggle}
      >
        {isBooked ? "✅ Booked" : "Mark booked"}
      </Button>
      {error ? (
        <p className="mt-1.5 max-w-[14rem] text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
