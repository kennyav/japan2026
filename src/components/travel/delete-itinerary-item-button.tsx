"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import { deleteItineraryItem } from "~/app/trips/actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

type Props = {
  tripId: string;
  itemId: string;
  itemTitle: string;
};

export function DeleteItineraryItemButton({ tripId, itemId, itemTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete idea: ${itemTitle}`}
        >
          <Trash2 className="size-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this idea?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">&ldquo;{itemTitle}&rdquo;</span>{" "}
            will be removed for everyone. Crew reactions cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const res = await deleteItineraryItem(tripId, itemId);
                if (res && "error" in res) {
                  setError(res.error ?? "Could not delete.");
                  return;
                }
                setOpen(false);
              });
            }}
          >
            {isPending ? "Deleting…" : "Delete idea"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
