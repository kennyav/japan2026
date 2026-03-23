"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import {
  addItineraryItemComment,
  listItineraryItemComments,
} from "~/app/trips/actions";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export type IdeaItemModalSummary = {
  id: string;
  title: string;
  type: string;
  emoji: string;
  description: string | null;
  location: string | null;
  link: string | null;
};

export type ItemCommentView = {
  id: string;
  body: string;
  createdAt: string;
  authorName: string;
};

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  item: IdeaItemModalSummary;
};

export function IdeaItemDetailModal({
  open,
  onOpenChange,
  tripId,
  item,
}: ModalProps) {
  const [comments, setComments] = useState<ItemCommentView[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    void listItineraryItemComments(tripId, item.id).then((res) => {
      if (res && "error" in res) {
        setLoadError(res.error ?? "Could not load comments.");
        setComments([]);
        return;
      }
      setLoadError(null);
      setComments(res?.comments ?? []);
    });
  }, [tripId, item.id]);

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    refresh();
  }, [open, refresh]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,720px)] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            <span className="mr-2" aria-hidden>
              {item.emoji}
            </span>
            {item.title}
          </DialogTitle>
          <DialogDescription className="capitalize">{item.type}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 overflow-y-auto border-b border-border/50 px-5 py-3 text-sm">
          {item.description ? (
            <p className="leading-relaxed text-muted-foreground">{item.description}</p>
          ) : null}
          {item.location ? (
            <p className="text-muted-foreground">📍 {item.location}</p>
          ) : null}
          {item.link?.trim() ? (
            <a
              href={item.link.trim()}
              className="inline-flex font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Open link ↗
            </a>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 py-4">
          <p className="font-display text-sm font-bold text-foreground">Comments</p>
          {loadError ? (
            <p className="text-destructive text-sm">{loadError}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No comments yet—start the thread.
            </p>
          ) : (
            <ul className="max-h-48 space-y-3 overflow-y-auto pr-1 text-sm">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-foreground">
                    {c.authorName}
                    <span className="ml-2 font-normal text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                    {c.body}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <form
            key={formKey}
            className="mt-auto space-y-2 border-t border-border/40 pt-3"
            action={(fd) => {
              setFormError(null);
              startTransition(async () => {
                const res = await addItineraryItemComment(tripId, item.id, fd);
                if (res && "error" in res) {
                  setFormError(res.error ?? "Could not post.");
                  return;
                }
                setFormKey((k) => k + 1);
                refresh();
              });
            }}
          >
            <Label htmlFor={`idea-comment-${item.id}`}>Add a comment</Label>
            <Textarea
              id={`idea-comment-${item.id}`}
              name="body"
              rows={3}
              required
              maxLength={4000}
              placeholder="Thoughts, questions, links…"
              className="rounded-xl border-2"
              disabled={isPending}
            />
            {formError ? (
              <p className="text-destructive text-sm" role="alert">
                {formError}
              </p>
            ) : null}
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Posting…" : "Post comment"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type TriggerProps = {
  enabled: boolean;
  tripId: string;
  item: IdeaItemModalSummary;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<"li">,
  "children" | "onClick" | "onKeyDown" | "tabIndex"
>;

export function IdeaItemModalTrigger({
  enabled,
  tripId,
  item,
  children,
  className,
  ...liProps
}: TriggerProps) {
  const [open, setOpen] = useState(false);

  const onLiClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!enabled) return;
    const t = e.target as HTMLElement;
    if (
      t.closest(
        "button, a, input, textarea, select, label, [data-stop-item-modal], [role='combobox']",
      )
    ) {
      return;
    }
    setOpen(true);
  };

  const onLiKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (!enabled) return;
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target as HTMLElement;
    if (t !== e.currentTarget && !e.currentTarget.contains(t)) return;
    if (
      t.closest(
        "button, a, input, textarea, select, [data-stop-item-modal], [role='combobox']",
      )
    ) {
      return;
    }
    e.preventDefault();
    setOpen(true);
  };

  const liClass = cn(
    "min-w-0 rounded-2xl border-2 border-primary/10 bg-card p-5 shadow-md transition-shadow hover:shadow-lg",
    enabled &&
      "cursor-pointer hover:border-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className,
  );

  if (!enabled) {
    return (
      <li className={liClass} {...liProps}>
        {children}
      </li>
    );
  }

  return (
    <>
      <li
        className={liClass}
        onClick={onLiClick}
        onKeyDown={onLiKeyDown}
        tabIndex={0}
        aria-label={`Open details and comments for ${item.title}`}
        {...liProps}
      >
        {children}
      </li>
      <IdeaItemDetailModal
        open={open}
        onOpenChange={setOpen}
        tripId={tripId}
        item={item}
      />
    </>
  );
}
