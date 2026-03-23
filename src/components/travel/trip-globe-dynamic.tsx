"use client";

import dynamic from "next/dynamic";
import type { MutableRefObject } from "react";

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

type Props = {
  pins: GlobePin[];
  layout?: "default" | "fill";
  onExitFullscreen?: () => void;
  focusPinByIdRef?: MutableRefObject<((itemId: string) => void) | null>;
};

export function TripGlobeDynamic({
  pins,
  layout = "default",
  onExitFullscreen,
  focusPinByIdRef,
}: Props) {
  return (
    <div
      className={cn(
        layout === "fill" && "flex h-full min-h-0 w-full flex-col",
      )}
    >
      <TripGlobe
        pins={pins}
        layout={layout}
        onExitFullscreen={onExitFullscreen}
        focusPinByIdRef={focusPinByIdRef}
      />
    </div>
  );
}
