"use client";

import { useState, useTransition } from "react";

import { updateItineraryItem } from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

export type EditableItineraryItem = {
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
};

type Props = {
  tripId: string;
  item: EditableItineraryItem;
  onSaved: () => void;
  onCancel: () => void;
};

export function EditItineraryItemForm({
  tripId,
  item,
  onSaved,
  onCancel,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState(item.type);
  const [priceLevel, setPriceLevel] = useState<string>(
    item.price_level != null &&
      Number.isInteger(item.price_level) &&
      item.price_level >= 1 &&
      item.price_level <= 4
      ? String(item.price_level)
      : "",
  );
  const [isPending, startTransition] = useTransition();

  const latKey =
    item.latitude != null && Number.isFinite(item.latitude)
      ? String(item.latitude)
      : "";
  const lngKey =
    item.longitude != null && Number.isFinite(item.longitude)
      ? String(item.longitude)
      : "";

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-muted/20 p-4 shadow-inner">
      <p className="font-display text-sm font-bold text-foreground">
        Edit this idea
      </p>
      <form
        key={`${item.id}-${latKey}-${lngKey}-${item.title.slice(0, 20)}`}
        className="mt-4 space-y-4"
        action={(fd) => {
          fd.set("type", type);
          fd.set("price_level", priceLevel);
          setError(null);
          startTransition(async () => {
            const res = await updateItineraryItem(tripId, item.id, fd);
            if (res && "error" in res) {
              setError(res.error ?? "Could not save changes.");
              return;
            }
            onSaved();
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`edit-type-${item.id}`}>Flavor</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger
                id={`edit-type-${item.id}`}
                className="w-full rounded-xl border-2"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">🎯 Activity</SelectItem>
                <SelectItem value="hotel">🏨 Hotel / stay</SelectItem>
                <SelectItem value="transport">🚇 Transport</SelectItem>
                <SelectItem value="meal">🍜 Food</SelectItem>
                <SelectItem value="other">✨ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
            <Input
              id={`edit-title-${item.id}`}
              name="title"
              required
              defaultValue={item.title}
              className="rounded-xl border-2"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`edit-desc-${item.id}`}>Notes (optional)</Label>
          <Textarea
            id={`edit-desc-${item.id}`}
            name="description"
            rows={2}
            defaultValue={item.description ?? ""}
            className="rounded-xl border-2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`edit-location-${item.id}`}>Where (optional)</Label>
          <Input
            id={`edit-location-${item.id}`}
            name="location"
            defaultValue={item.location ?? ""}
            className="rounded-xl border-2"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`edit-price-level-${item.id}`}>
              Price vibe (optional)
            </Label>
            <Select
              value={priceLevel === "" ? "none" : priceLevel}
              onValueChange={(v) => setPriceLevel(v === "none" ? "" : v)}
            >
              <SelectTrigger
                id={`edit-price-level-${item.id}`}
                className="w-full rounded-xl border-2"
              >
                <SelectValue placeholder="Not set" />
              </SelectTrigger>
              <SelectContent className="z-[60]">
                <SelectItem value="none">Not set</SelectItem>
                <SelectItem value="1">$</SelectItem>
                <SelectItem value="2">$$</SelectItem>
                <SelectItem value="3">$$$</SelectItem>
                <SelectItem value="4">$$$$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-total-${item.id}`}>Total cost (optional)</Label>
            <Input
              id={`edit-total-${item.id}`}
              name="total_cost"
              inputMode="decimal"
              defaultValue={
                item.total_cost != null && Number.isFinite(item.total_cost)
                  ? String(item.total_cost)
                  : ""
              }
              className="rounded-xl border-2"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`edit-link-${item.id}`}>Link (optional)</Label>
          <Input
            id={`edit-link-${item.id}`}
            name="link"
            type="url"
            defaultValue={item.link ?? ""}
            className="rounded-xl border-2"
          />
        </div>
        <div className="rounded-xl border-2 border-primary/15 bg-card/60 p-4 space-y-3">
          <div>
            <p className="font-display text-sm font-semibold text-foreground">
              Globe pin
            </p>
            <p className="text-xs text-muted-foreground">
              Change or clear the map pin. Leave address and coordinates empty
              to remove the pin. If both are set, coordinates win.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-map-address-${item.id}`}>
              Address or place name
            </Label>
            <Textarea
              id={`edit-map-address-${item.id}`}
              name="map_address"
              rows={2}
              className="rounded-xl border-2 resize-y min-h-[4rem]"
              placeholder="Search OpenStreetMap…"
              autoComplete="street-address"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-lat-${item.id}`}>Latitude</Label>
              <Input
                id={`edit-lat-${item.id}`}
                name="latitude"
                inputMode="decimal"
                defaultValue={latKey}
                autoComplete="off"
                className="rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edit-lng-${item.id}`}>Longitude</Label>
              <Input
                id={`edit-lng-${item.id}`}
                name="longitude"
                inputMode="decimal"
                defaultValue={lngKey}
                autoComplete="off"
                className="rounded-xl border-2"
              />
            </div>
          </div>
        </div>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? "Saving…" : "Save changes"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
