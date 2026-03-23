/**
 * Forward geocoding via OpenStreetMap Nominatim (free, no API key).
 * https://nominatim.org/release-docs/latest/api/Search/ — use sparingly; set
 * GEOCODING_CONTACT_EMAIL in env for a proper User-Agent when possible.
 */

const SEARCH_URL = "https://nominatim.openstreetmap.org/search";

type NominatimHit = {
  lat: string;
  lon: string;
  display_name?: string;
};

function userAgent(): string {
  const contact = process.env.GEOCODING_CONTACT_EMAIL?.trim();
  if (contact) return `Japan2026/1.0 (contact: ${contact})`;
  return "Japan2026/1.0 (+https://www.openstreetmap.org/copyright)";
}

export type GeocodeResult =
  | { ok: true; lat: number; lng: number; displayName: string }
  | { ok: false; error: "not_found" | "unavailable" };

export async function geocodePlaceQuery(query: string): Promise<GeocodeResult> {
  const q = query.trim();
  if (!q) return { ok: false, error: "not_found" };

  const url = new URL(SEARCH_URL);
  url.searchParams.set("q", q);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": userAgent(),
      },
    });
    if (!res.ok) return { ok: false, error: "unavailable" };

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data) || data.length === 0) {
      return { ok: false, error: "not_found" };
    }

    const hit = data[0] as NominatimHit;
    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { ok: false, error: "unavailable" };
    }

    const trimmedName = hit.display_name?.trim();
    return {
      ok: true,
      lat,
      lng,
      displayName:
        trimmedName && trimmedName.length > 0 ? trimmedName : q,
    };
  } catch {
    return { ok: false, error: "unavailable" };
  } finally {
    clearTimeout(t);
  }
}
