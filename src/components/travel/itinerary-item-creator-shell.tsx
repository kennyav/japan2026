"use client";

import { useState, type ReactNode } from "react";

import { Button } from "~/components/ui/button";
import { DeleteItineraryItemButton } from "~/components/travel/delete-itinerary-item-button";
import {
  EditItineraryItemForm,
  type EditableItineraryItem,
} from "~/components/travel/edit-itinerary-item-form";
import { ItemCoordinatesForm } from "~/components/travel/item-coordinates-form";

type Props = {
  tripId: string;
  item: EditableItineraryItem;
  /** True when the item already has a valid lat/lng (hide quick-add coordinates UI). */
  hasCoords: boolean;
  children: ReactNode;
};

export function ItineraryItemCreatorShell({
  tripId,
  item,
  hasCoords,
  children,
}: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
        {children}
        <div className="flex shrink-0 gap-2 self-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-2"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Cancel" : "Edit"}
          </Button>
          <DeleteItineraryItemButton
            tripId={tripId}
            itemId={item.id}
            itemTitle={item.title}
          />
        </div>
      </div>
      {!hasCoords ? (
        <ItemCoordinatesForm
          tripId={tripId}
          itemId={item.id}
          initialLatitude={item.latitude}
          initialLongitude={item.longitude}
        />
      ) : null}
      {editing ? (
        <EditItineraryItemForm
          tripId={tripId}
          item={item}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      ) : null}
    </div>
  );
}
