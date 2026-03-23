"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { TripGlobeDynamic } from "~/components/travel/trip-globe-dynamic";
import type { GlobePin } from "~/components/travel/trip-globe";

type Props = {
  pins: GlobePin[];
  globeEmpty: ReactNode;
  ideaBoard: ReactNode;
};

export function TripGlobeFullScreenLayout({
  pins,
  globeEmpty,
  ideaBoard,
}: Props) {
  const [full, setFull] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [full]);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);

  const hasPins = pins.length > 0;

  const overlay =
    full && mounted && hasPins
      ? createPortal(
          <div
            className="fixed inset-0 z-[100] overflow-hidden bg-[#020617]"
            role="dialog"
            aria-modal="true"
            aria-label="Full screen trip map"
          >
            <div className="absolute inset-0 z-0 h-full w-full">
              <TripGlobeDynamic pins={pins} layout="fill" />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute right-3 top-3 z-30 rounded-full border border-white/20 bg-slate-950/55 text-foreground shadow-lg backdrop-blur-md hover:bg-slate-950/70"
              onClick={() => setFull(false)}
            >
              <X className="mr-1 size-4" />
              Exit map
            </Button>

            <aside className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-3 pb-4 pt-2 lg:inset-x-auto lg:bottom-4 lg:left-4 lg:top-4 lg:w-[min(400px,40vw)] lg:px-0 lg:pb-4 lg:pt-4">
              <div className="pointer-events-auto mx-auto flex h-[min(46vh,440px)] max-h-[min(50vh,480px)] w-full min-h-0 flex-col gap-3 lg:h-full lg:max-h-none">
                <div className="flex shrink-0 items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
                  <h2 className="font-display text-base font-bold text-foreground sm:text-lg">
                    Idea board
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 rounded-full"
                    onClick={() => setFull(false)}
                    aria-label="Exit full screen map"
                  >
                    <X className="size-4" />
                    <span className="ml-1 hidden sm:inline">Close</span>
                  </Button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {ideaBoard}
                </div>
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Trip globe
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Stays, activities, and stops with a globe pin show up here—use an
              address or coordinates in the form above or under each idea you
              created.
            </p>
          </div>
          {hasPins ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full border-2 shadow-sm"
              onClick={() => setFull(true)}
            >
              <Maximize2 className="mr-2 size-4" />
              Full screen map
            </Button>
          ) : null}
        </div>
        {hasPins ? (
          full ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/25 bg-muted/25 px-6 py-10 text-center text-sm text-muted-foreground">
              <p>The map is open in full screen.</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={() => setFull(false)}
              >
                Back to preview
              </Button>
            </div>
          ) : (
            <TripGlobeDynamic pins={pins} />
          )
        ) : (
          globeEmpty
        )}
      </section>

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Idea board
        </h2>
        {ideaBoard}
      </section>

      {overlay}
    </>
  );
}
