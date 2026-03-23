"use client";

import { useState, useTransition } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { createTrip } from "~/app/trips/actions";

export function CreateTripForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Give it a name</CardTitle>
        <CardDescription>
          This is just the label—go unhinged or keep it practical. Your call.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-5"
          action={(fd) => {
            setError(null);
            startTransition(async () => {
              const res = await createTrip(fd);
              if (res && "error" in res) setError(res.error ?? "Something went wrong");
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="title">Trip name</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="e.g. Tokyo chaos week / Kyoto chill arc"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">Where-ish (optional)</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="City, region, or 'TBD and thriving'"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start (optional)</Label>
              <Input id="start_date" name="start_date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End (optional)</Label>
              <Input id="end_date" name="end_date" type="date" />
            </div>
          </div>
          {error ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={isPending} size="lg">
            {isPending ? "Cooking it up…" : "Create trip 🎉"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
