"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { geocodePlaceQuery } from "~/lib/geocoding/nominatim";
import { createClient } from "~/lib/supabase/server";

function formString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function parseOptionalLatLngFields(latRaw: string, lngRaw: string):
  | { ok: true; lat: number | null; lng: number | null }
  | { ok: false; error: string } {
  const latStr = latRaw.trim();
  const lngStr = lngRaw.trim();
  if (!latStr && !lngStr) return { ok: true, lat: null, lng: null };
  if (!latStr || !lngStr) {
    return {
      ok: false,
      error:
        "Enter both latitude and longitude, or leave both blank to skip the globe pin.",
    };
  }

  const lat = Number(latStr);
  const lng = Number(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: "Latitude and longitude must be valid numbers." };
  }
  if (lat < -90 || lat > 90) {
    return { ok: false, error: "Latitude must be between -90 and 90." };
  }
  if (lng < -180 || lng > 180) {
    return { ok: false, error: "Longitude must be between -180 and 180." };
  }

  return { ok: true, lat, lng };
}

async function resolveGlobePinFromForm(formData: FormData): Promise<
  | {
      ok: true;
      lat: number | null;
      lng: number | null;
      displayNameFromGeocode?: string;
    }
  | { ok: false; error: string }
> {
  const latStr = formString(formData, "latitude").trim();
  const lngStr = formString(formData, "longitude").trim();
  const address = formString(formData, "map_address").trim();

  const hasCoord = Boolean(latStr || lngStr);
  if (hasCoord) {
    const coords = parseOptionalLatLngFields(latStr, lngStr);
    if (!coords.ok) return { ok: false, error: coords.error };
    return { ok: true, lat: coords.lat, lng: coords.lng };
  }

  if (address) {
    const geo = await geocodePlaceQuery(address);
    if (!geo.ok) {
      if (geo.error === "not_found") {
        return {
          ok: false,
          error:
            "No match for that place—try a fuller address or city, or use latitude and longitude.",
        };
      }
      return {
        ok: false,
        error:
          "Address lookup failed. Try again in a moment, or use coordinates instead.",
      };
    }
    return {
      ok: true,
      lat: geo.lat,
      lng: geo.lng,
      displayNameFromGeocode: geo.displayName,
    };
  }

  return { ok: true, lat: null, lng: null };
}

export async function createTrip(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = formString(formData, "title").trim();
  if (!title) return { error: "Add a trip name." };

  const destination = formString(formData, "destination").trim();
  const startRaw = formString(formData, "start_date").trim();
  const endRaw = formString(formData, "end_date").trim();

  const { data, error } = await supabase
    .from("trips")
    .insert({
      title,
      destination: destination || null,
      start_date: startRaw || null,
      end_date: endRaw || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/trips");
  redirect(`/trips/${data.id}`);
}

export async function createItineraryItem(tripId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = formString(formData, "title").trim();
  if (!title) return { error: "Add a title." };

  const typeRaw = formString(formData, "type") || "activity";
  const allowed = [
    "activity",
    "hotel",
    "transport",
    "meal",
    "other",
  ] as const;
  const type = allowed.includes(typeRaw as (typeof allowed)[number])
    ? typeRaw
    : "activity";

  const pin = await resolveGlobePinFromForm(formData);
  if (!pin.ok) return { error: pin.error };

  let location = formString(formData, "location").trim() || null;
  if (!location && pin.displayNameFromGeocode) {
    location =
      pin.displayNameFromGeocode.length > 400
        ? `${pin.displayNameFromGeocode.slice(0, 397)}…`
        : pin.displayNameFromGeocode;
  }

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: tripId,
    type,
    title,
    description: formString(formData, "description").trim() || null,
    location,
    link: formString(formData, "link").trim() || null,
    latitude: pin.lat,
    longitude: pin.lng,
    created_by: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath(`/trips/${tripId}`);
  return { ok: true as const };
}

export async function updateItineraryItemCoordinates(
  tripId: string,
  itemId: string,
  formData: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const pin = await resolveGlobePinFromForm(formData);
  if (!pin.ok) return { error: pin.error };

  const { error } = await supabase
    .from("itinerary_items")
    .update({
      latitude: pin.lat,
      longitude: pin.lng,
    })
    .eq("id", itemId)
    .eq("trip_id", tripId);

  if (error) return { error: error.message };

  revalidatePath(`/trips/${tripId}`);
  return { ok: true as const };
}

export async function deleteItineraryItem(tripId: string, itemId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("itinerary_items")
    .delete()
    .eq("id", itemId)
    .eq("trip_id", tripId);

  if (error) return { error: error.message };

  revalidatePath(`/trips/${tripId}`);
  return { ok: true as const };
}

export async function setItemResponse(
  itemId: string,
  tripId: string,
  status: "interested" | "booked" | "not_interested",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("item_responses").upsert(
    {
      item_id: itemId,
      user_id: user.id,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "item_id,user_id" },
  );

  if (error) return { error: error.message };

  revalidatePath(`/trips/${tripId}`);
  return { ok: true as const };
}

type RpcMemberResult = { ok: boolean; error?: string };

export async function addTripMemberByEmail(tripId: string, emailRaw: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = emailRaw.trim();
  if (!email) return { error: "Enter an email address." };

  const rpcResult = await supabase.rpc("add_trip_member_by_email", {
    p_trip_id: tripId,
    p_email: email,
  });

  if (rpcResult.error) return { error: rpcResult.error.message };

  const res = rpcResult.data as unknown as RpcMemberResult | null;
  if (!res?.ok) {
    const code = res?.error ?? "unknown";
    const messages: Record<string, string> = {
      not_authenticated: "Sign in again and retry.",
      not_owner: "Only trip owners can add people.",
      empty_email: "Enter an email address.",
      user_not_found:
        "No account with that email yet—they need to sign in with Google once first.",
      already_member: "That person is already on this trip.",
    };
    return { error: messages[code] ?? "Could not add member." };
  }

  revalidatePath(`/trips/${tripId}`);
  return { ok: true as const };
}
