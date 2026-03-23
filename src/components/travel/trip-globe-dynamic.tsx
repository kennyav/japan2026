"use client";

import dynamic from "next/dynamic";

import { cn } from "~/lib/utils";

import type { GlobePin } from "./trip-globe";

const TripGlobe = dynamic(
  () =>
    import("./trip-globe").then((m) => ({
      default: m.TripGlobe,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[280px] w-full flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-muted/30 text-sm text-muted-foreground">
        Spinning up the globe…
      </div>
    ),
  },
);

type Props = { pins: GlobePin[]; layout?: "default" | "fill" };

export function TripGlobeDynamic({ pins, layout = "default" }: Props) {
  return (
    <div
      className={cn(
        layout === "fill" && "flex h-full min-h-0 w-full flex-col",
      )}
    >
      <TripGlobe pins={pins} layout={layout} />
    </div>
  );
}
