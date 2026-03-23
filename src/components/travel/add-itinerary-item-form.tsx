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
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-5 rounded-2xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-accent/40 to-secondary/30 p-6 shadow-inner"
      action={(fd) => {
        fd.set("type", type);
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item-location">Where (optional)</Label>
          <Input
            id="item-location"
            name="location"
            placeholder="Neighborhood or station"
          />
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
