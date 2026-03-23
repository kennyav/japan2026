"use client";

import { useState, useTransition } from "react";

import { updateItineraryItemCoordinates } from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type Props = {
  tripId: string;
  itemId: string;
  initialLatitude: number | null;
  initialLongitude: number | null;
};

export function ItemCoordinatesForm({
  tripId,
  itemId,
  initialLatitude,
  initialLongitude,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const latKey =
    initialLatitude != null && Number.isFinite(initialLatitude)
      ? String(initialLatitude)
      : "";
  const lngKey =
    initialLongitude != null && Number.isFinite(initialLongitude)
      ? String(initialLongitude)
      : "";

  return (
    <div className="mt-4 rounded-xl border border-primary/15 bg-muted/30 p-4">
      <p className="font-display text-xs font-semibold uppercase tracking-wide text-primary">
        Globe coordinates
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Use an address or coordinates. Leave everything blank and save to remove
        the pin. If both address and coordinates are filled, coordinates are
        used.
      </p>
      <form
        key={`${itemId}-${latKey}-${lngKey}`}
        className="mt-3 space-y-3"
        action={(fd) => {
          setError(null);
          startTransition(async () => {
            const res = await updateItineraryItemCoordinates(
              tripId,
              itemId,
              fd,
            );
            if (res && "error" in res) {
              setError(res.error ?? "Could not save coordinates.");
            }
          });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor={`addr-${itemId}`} className="text-xs">
            Address or place name
          </Label>
          <Textarea
            id={`addr-${itemId}`}
            name="map_address"
            rows={2}
            placeholder="Search OpenStreetMap…"
            className="rounded-lg border-2 text-sm resize-y min-h-[3.25rem]"
            autoComplete="street-address"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div className="space-y-1.5">
            <Label htmlFor={`lat-${itemId}`} className="text-xs">
              Latitude
            </Label>
            <Input
              id={`lat-${itemId}`}
              name="latitude"
              inputMode="decimal"
              placeholder="35.0116"
              defaultValue={latKey}
              autoComplete="off"
              className="rounded-lg border-2 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`lng-${itemId}`} className="text-xs">
              Longitude
            </Label>
            <Input
              id={`lng-${itemId}`}
              name="longitude"
              inputMode="decimal"
              placeholder="135.7681"
              defaultValue={lngKey}
              autoComplete="off"
              className="rounded-lg border-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              size="sm"
              variant="secondary"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Saving…" : "Save pin"}
            </Button>
          </div>
        </div>
      </form>
      {error ? (
        <p className="mt-2 text-destructive text-xs" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
