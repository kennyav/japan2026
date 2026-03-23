"use client";

import { useState, useTransition } from "react";

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

import { createItineraryItem } from "~/app/trips/actions";

type Props = { tripId: string };

export function AddItineraryItemForm({ tripId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("activity");
  const [priceLevel, setPriceLevel] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5 rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-accent/40 to-secondary/30 p-6 shadow-inner"
      action={(fd) => {
        fd.set("type", type);
        fd.set("price_level", priceLevel);
        setError(null);
        startTransition(async () => {
          const res = await createItineraryItem(tripId, fd);
          if (res && "error" in res) setError(res.error ?? "Something went wrong");
        });
      }}
    >
      <div>
        <p className="font-display text-lg font-bold text-foreground">
          Toss another idea on the pile
        </p>
        <p className="text-sm text-muted-foreground">
          The messier the better—we&apos;ll sort it later.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item-type">Flavor</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="item-type" className="w-full rounded-xl border-2">
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
          <Label htmlFor="item-title">What is it?</Label>
          <Input
            id="item-title"
            name="title"
            required
            placeholder="Fushimi sunrise hike, etc."
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-desc">Hot takes / notes (optional)</Label>
        <Textarea
          id="item-desc"
          name="description"
          rows={2}
          className="rounded-xl border-2"
          placeholder="Meet at the east gate, bring water, emotional support…"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-location">Where (optional)</Label>
        <Input
          id="item-location"
          name="location"
          placeholder="Neighborhood or station"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item-price-level">Price vibe (optional)</Label>
          <Select
            value={priceLevel === "" ? "none" : priceLevel}
            onValueChange={(v) => setPriceLevel(v === "none" ? "" : v)}
          >
            <SelectTrigger id="item-price-level" className="w-full rounded-xl border-2">
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
          <Label htmlFor="item-total-cost">Total cost (optional)</Label>
          <Input
            id="item-total-cost"
            name="total_cost"
            inputMode="decimal"
            placeholder="e.g. 120"
            autoComplete="off"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">
        Dollar signs are a rough spend hint. Total is in your trip currency; we
        show per-person splits from who’s into it vs. everyone on the trip.
      </p>
      <div className="rounded-xl border-2 border-primary/15 bg-card/50 p-4 space-y-3">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">
            Globe pin (optional)
          </p>
          <p className="text-xs text-muted-foreground">
            Add an address <span className="font-medium">or</span> latitude and
            longitude. If you use both, coordinates win. Address search uses
            OpenStreetMap.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="item-map-address">Address or place name</Label>
          <Textarea
            id="item-map-address"
            name="map_address"
            rows={2}
            className="rounded-xl border-2 resize-y min-h-[4rem]"
            placeholder="e.g. Fushimi Inari Taisha, Kyoto"
            autoComplete="street-address"
          />
        </div>
        <p className="text-[11px] text-muted-foreground leading-snug">
          Or paste coordinates (Google Maps: right-click → first two numbers =
          lat, then lng).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="item-latitude">Latitude</Label>
            <Input
              id="item-latitude"
              name="latitude"
              inputMode="decimal"
              placeholder="e.g. 35.0116"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-longitude">Longitude</Label>
            <Input
              id="item-longitude"
              name="longitude"
              inputMode="decimal"
              placeholder="e.g. 135.7681"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="item-link">Link (optional)</Label>
        <Input
          id="item-link"
          name="link"
          type="url"
          placeholder="Maps, booking, TikTok rabbit hole…"
        />
      </div>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending} size="lg">
        {isPending ? "Adding…" : "Add to the board"}
      </Button>
    </form>
  );
}
