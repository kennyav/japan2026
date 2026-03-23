"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "~/lib/supabase/server";

function formString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
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

  const { error } = await supabase.from("itinerary_items").insert({
    trip_id: tripId,
    type,
    title,
    description: formString(formData, "description").trim() || null,
    location: formString(formData, "location").trim() || null,
    link: formString(formData, "link").trim() || null,
    created_by: user.id,
  });

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
