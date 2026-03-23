"use client";

import { useTransition } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { setItemResponse } from "~/app/trips/actions";

type Status = "interested" | "booked" | "not_interested";

type Props = {
  itemId: string;
  tripId: string;
  current: Status | null;
};

const choices: { status: Status; label: string; activeClass: string }[] = [
  {
    status: "interested",
    label: "🙌 Into it",
    activeClass:
      "border-transparent bg-gradient-to-r from-rose-400 to-orange-400 text-white shadow-md hover:from-rose-400/90 hover:to-orange-400/90",
  },
  {
    status: "booked",
    label: "✅ Booked",
    activeClass:
      "border-transparent bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md hover:from-emerald-400/90 hover:to-teal-500/90",
  },
  {
    status: "not_interested",
    label: "🙅 Hard pass",
    activeClass:
      "border-transparent bg-slate-500 text-white shadow-md hover:bg-slate-500/90",
  },
];

export function ItemResponseButtons({ itemId, tripId, current }: Props) {
  const [isPending, startTransition] = useTransition();

  function pick(status: Status) {
    startTransition(async () => {
      await setItemResponse(itemId, tripId, status);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {choices.map(({ status, label, activeClass }) => {
        const isOn = current === status;
        return (
          <Button
            key={status}
            type="button"
            size="sm"
            variant="outline"
            disabled={isPending}
            className={cn(
              "rounded-full border-2 font-semibold",
              isOn
                ? activeClass
                : "border-primary/15 bg-card/80 hover:bg-accent",
              isOn && "ring-2 ring-primary/25 ring-offset-2",
            )}
            onClick={() => pick(status)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
