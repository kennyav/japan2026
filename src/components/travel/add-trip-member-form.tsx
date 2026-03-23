"use client";

import { useRef, useState, useTransition } from "react";

import { addTripMemberByEmail } from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Props = { tripId: string };

export function AddTripMemberForm({ tripId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="mt-4 space-y-3 rounded-xl border-2 border-dashed border-primary/20 bg-muted/30 p-4"
      action={(fd) => {
        setError(null);
        setDone(null);
        const raw = fd.get("invite_email");
        const email = typeof raw === "string" ? raw.trim() : "";
        startTransition(async () => {
          const res = await addTripMemberByEmail(tripId, email);
          if (res && "error" in res) {
            setError(res.error ?? "Something went wrong");
            return;
          }
          formRef.current?.reset();
          setDone("Added! They can open this trip after signing in.");
        });
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="invite_email" className="text-sm">
            Invite by Google email
          </Label>
          <Input
            id="invite_email"
            name="invite_email"
            type="email"
            autoComplete="email"
            placeholder="friend@gmail.com"
            required
            disabled={isPending}
          />
        </div>
        <Button type="submit" disabled={isPending} className="shrink-0">
          {isPending ? "Adding…" : "Add to trip"}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        They must have signed in to this app at least once so we can match their
        account.
      </p>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {done ? (
        <p className="text-primary text-sm font-medium" role="status">
          {done}
        </p>
      ) : null}
    </form>
  );
}
