"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export type GlobePin = {
  id: string;
  title: string;
  type: string;
  lat: number;
  lng: number;
  location: string | null;
  link: string | null;
};

const typeEmoji: Record<string, string> = {
  activity: "🎯",
  hotel: "🏨",
  transport: "🚇",
  meal: "🍜",
  other: "✨",
};

const NIGHT_SKY =
  "https://unpkg.com/three-globe/example/img/night-sky.png";

/** Slippy-map tiles: loads higher resolution as you zoom (unlike a single JPEG). */
const BASEMAPS = {
  osm: {
    label: "Street (OpenStreetMap)",
    url: (x: number, y: number, level: number) =>
      `https://tile.openstreetmap.org/${level}/${x}/${y}.png`,
    attribution: "© OpenStreetMap contributors",
  },
  voyager: {
    label: "Voyager (Carto)",
    url: (x: number, y: number, level: number) =>
      `https://b.basemaps.cartocdn.com/rastertiles/voyager/${level}/${x}/${y}.png`,
    attribution: "© OpenStreetMap © CARTO",
  },
  positron: {
    label: "Light (Carto)",
    url: (x: number, y: number, level: number) =>
      `https://b.basemaps.cartocdn.com/light_all/${level}/${x}/${y}.png`,
    attribution: "© OpenStreetMap © CARTO",
  },
} as const;

type BasemapId = keyof typeof BASEMAPS;

type HtmlPinDatum = GlobePin & {
  emoji: string;
};

/** Marker on root element — scene traverse sets CSS2D anchor from data-trip-pin-cx/cy. */
const TRIP_PIN_ROOT_ATTR = "data-trip-globe-pin";
const TRIP_PIN_CX_ATTR = "data-trip-pin-cx";
const TRIP_PIN_CY_ATTR = "data-trip-pin-cy";
/** Inner wrapper: scale/lift updated on the DOM directly so zoom does not recreate HTML markers. */
const TRIP_PIN_INNER_ATTR = "data-trip-globe-inner";

/** Interpolation factor per frame toward target scale/lift while zooming (higher = snappier). */
const PIN_ZOOM_SMOOTH_K = 0.32;

type Css2dLike = {
  isCSS2DObject?: boolean;
  center?: { set: (x: number, y: number) => void };
  element?: HTMLElement;
};

function asTraversableScene(
  scene: unknown,
): { traverse: (cb: (obj: object) => void) => void } | undefined {
  if (
    scene !== null &&
    typeof scene === "object" &&
    "traverse" in scene &&
    typeof (scene as { traverse: unknown }).traverse === "function"
  ) {
    return scene as { traverse: (cb: (obj: object) => void) => void };
  }
  return undefined;
}

/**
 * When the camera pulls back, HTML markers sit slightly low vs the map tiles; nudge up
 * on screen (~½″ at far zoom on typical displays). Tip stays anchored via CSS2D center.
 */
function pinScreenLiftPxForAltitude(altitude: number): number {
  const a = Math.max(0.035, Math.min(10, altitude));
  const t = Math.min(1, Math.max(0, (a - 0.12) / 2));
  const smooth = t * t * (3 - 2 * t);
  return 48 * smooth;
}

function alignTripPinCss2DAnchors(
  scene: { traverse: (cb: (obj: object) => void) => void } | null | undefined,
) {
  if (!scene) return;
  scene.traverse((obj) => {
    const o = obj as Css2dLike;
    if (!o.isCSS2DObject || !o.center?.set) return;
    const el = o.element;
    if (el?.getAttribute(TRIP_PIN_ROOT_ATTR) !== "true") return;
    const cx = Number.parseFloat(el.getAttribute(TRIP_PIN_CX_ATTR) ?? "0.5");
    const cy = Number.parseFloat(el.getAttribute(TRIP_PIN_CY_ATTR) ?? "1");
    o.center.set(
      Number.isFinite(cx) ? cx : 0.5,
      Number.isFinite(cy) ? cy : 1,
    );
  });
}

/** Camera altitude (globe radius multiples): lower = closer; tile detail increases when zoomed in. */
function altitudeForPins(pins: GlobePin[]): number {
  if (pins.length === 0) return 1.65;
  if (pins.length === 1) return 0.09;

  const lats = pins.map((p) => p.lat);
  const lngs = pins.map((p) => p.lng);
  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);
  const midLat = ((latMin + latMax) / 2) * (Math.PI / 180);
  const latSpan = latMax - latMin;
  const lngSpan = (lngMax - lngMin) * Math.cos(midLat);
  const spanDeg = Math.max(latSpan, lngSpan, 1e-6);

  if (spanDeg < 0.008) return 0.06;
  if (spanDeg < 0.02) return 0.085;
  if (spanDeg < 0.04) return 0.11;
  if (spanDeg < 0.08) return 0.16;
  if (spanDeg < 0.2) return 0.28;
  if (spanDeg < 0.6) return 0.55;
  return Math.min(2.15, 0.45 + spanDeg * 1.8);
}

/**
 * Lower camera altitude = zoomed in → larger marker on screen (capped so pins
 * stay a bit smaller when close in and don’t cover the map tiles).
 */
function altitudeToPinScale(altitude: number): number {
  const a = Math.max(0.032, Math.min(12, altitude));
  const raw = 0.33 / Math.pow(a, 0.36);
  return Math.min(1.18, Math.max(0.32, raw));
}

type Props = {
  pins: GlobePin[];
  layout?: "default" | "fill";
  /** Full-screen map: shown next to map style, centered over the globe. */
  onExitFullscreen?: () => void;
  /**
   * When set (full-screen map), assigned to `fly to pin by itinerary id` so the
   * idea list can focus the camera.
   */
  focusPinByIdRef?: MutableRefObject<((itemId: string) => void) | null>;
};

/** Target width for pin art on screen; height follows native aspect ratio. */
const TRIP_PIN_DISPLAY_W_PX = 48;

type PinVisual = {
  src: string;
  nativeW: number;
  nativeH: number;
  /**
   * CSS2D anchor on the marker box (normalized 0–1). Three.js CSS2DObject:
   * x=0 left, x=1 right; y=0 top, y=1 bottom — set on the needle tip / map contact.
   */
  anchorX: number;
  anchorY: number;
  /** Emoji overlay position (% of marker box), head area of the 3D pin. */
  emojiLeftPct: string;
  emojiTopPct: string;
};

/** Remove.bg PNGs — anchors tuned for needle tip at bottom-left / bottom of art. */
const PIN_VISUAL_BY_TYPE: Record<string, PinVisual> = {
  activity: {
    src: "/images/pins/activity.png",
    nativeW: 308,
    nativeH: 398,
    anchorX: 0.1,
    anchorY: 0.96,
    emojiLeftPct: "58%",
    emojiTopPct: "14%",
  },
  hotel: {
    src: "/images/pins/hotel.png",
    nativeW: 520,
    nativeH: 454,
    anchorX: 0.12,
    anchorY: 0.95,
    emojiLeftPct: "52%",
    emojiTopPct: "12%",
  },
  transport: {
    src: "/images/pins/transport.png",
    nativeW: 368,
    nativeH: 470,
    anchorX: 0.1,
    anchorY: 0.96,
    emojiLeftPct: "56%",
    emojiTopPct: "13%",
  },
  meal: {
    src: "/images/pins/meal.png",
    nativeW: 264,
    nativeH: 386,
    anchorX: 0.14,
    anchorY: 0.95,
    emojiLeftPct: "54%",
    emojiTopPct: "15%",
  },
  other: {
    src: "/images/pins/other.png",
    nativeW: 294,
    nativeH: 588,
    anchorX: 0.12,
    anchorY: 0.97,
    emojiLeftPct: "55%",
    emojiTopPct: "10%",
  },
  /** Fallback for unknown types — sphere asset; anchor under the ball. */
  sphere: {
    src: "/images/pins/sphere.png",
    nativeW: 268,
    nativeH: 288,
    anchorX: 0.5,
    anchorY: 0.88,
    emojiLeftPct: "50%",
    emojiTopPct: "38%",
  },
};

function pinVisualForType(type: string): PinVisual {
  const hit = PIN_VISUAL_BY_TYPE[type];
  if (hit) return hit;
  return PIN_VISUAL_BY_TYPE.sphere!;
}

/** CSS transform-origin matches Three CSS2D anchor (y=0 top, y=1 bottom). */
function transformOriginForAnchor(ax: number, ay: number): string {
  const xPct = `${Math.round(ax * 1000) / 10}%`;
  const yPct = `${Math.round(ay * 1000) / 10}%`;
  return `${xPct} ${yPct}`;
}

export function TripGlobe({
  pins,
  layout = "default",
  onExitFullscreen,
  focusPinByIdRef,
}: Props) {
  const isFill = layout === "fill";
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 600, h: 480 });
  const [selected, setSelected] = useState<GlobePin | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>("osm");
  const selectPinRef = useRef<((p: GlobePin) => void) | null>(null);
  const smoothPinVisualRef = useRef({ scale: 1, lift: 0 });
  const pinSmoothRafRef = useRef<number | null>(null);
  const pinsRef = useRef(pins);
  pinsRef.current = pins;

  selectPinRef.current = (p) => setSelected(p);

  const tileUrl = BASEMAPS[basemap].url;
  const attribution = BASEMAPS[basemap].attribution;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      if (isFill) {
        const w = Math.max(200, Math.floor(cr.width));
        const h = Math.max(200, Math.floor(cr.height));
        setDims({ w, h });
      } else {
        const w = Math.max(320, Math.floor(cr.width));
        const h = Math.max(320, Math.min(680, Math.floor(cr.width * 0.72)));
        setDims({ w, h });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isFill]);

  const applyPinVisualToDom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scale, lift } = smoothPinVisualRef.current;
    const t = `translateY(-${lift}px) scale(${scale})`;
    el.querySelectorAll(`[${TRIP_PIN_INNER_ATTR}]`).forEach((node) => {
      (node as HTMLElement).style.transform = t;
    });
  }, []);

  const snapPinVisualToGlobe = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    const alt = g.pointOfView()?.altitude ?? 1;
    smoothPinVisualRef.current.scale = altitudeToPinScale(alt);
    smoothPinVisualRef.current.lift = pinScreenLiftPxForAltitude(alt);
    applyPinVisualToDom();
    alignTripPinCss2DAnchors(asTraversableScene(g.scene?.()));
  }, [applyPinVisualToDom]);

  const runPinSmoothStep = useCallback(() => {
    pinSmoothRafRef.current = null;
    const g = globeRef.current;
    const el = containerRef.current;
    if (!g || !el) return;
    const alt = g.pointOfView()?.altitude ?? 1;
    const targetS = altitudeToPinScale(alt);
    const targetL = pinScreenLiftPxForAltitude(alt);
    const cur = smoothPinVisualRef.current;
    const k = PIN_ZOOM_SMOOTH_K;
    cur.scale += (targetS - cur.scale) * k;
    cur.lift += (targetL - cur.lift) * k;
    applyPinVisualToDom();
    alignTripPinCss2DAnchors(asTraversableScene(g.scene?.()));

    const settled =
      Math.abs(targetS - cur.scale) < 0.006 &&
      Math.abs(targetL - cur.lift) < 0.22;
    if (!settled) {
      pinSmoothRafRef.current = requestAnimationFrame(runPinSmoothStep);
    }
  }, [applyPinVisualToDom]);

  const kickPinSmooth = useCallback(() => {
    if (pinSmoothRafRef.current != null) return;
    pinSmoothRafRef.current = requestAnimationFrame(runPinSmoothStep);
  }, [runPinSmoothStep]);

  const htmlElementsData: HtmlPinDatum[] = useMemo(
    () =>
      pins.map((p) => ({
        ...p,
        emoji: typeEmoji[p.type] ?? "✨",
      })),
    [pins],
  );

  const buildHtmlElement = useCallback((d: object) => {
    const pin = d as HtmlPinDatum;
    const pv = pinVisualForType(pin.type);
    const displayH =
      (pv.nativeH / pv.nativeW) * TRIP_PIN_DISPLAY_W_PX;

    // Root: CSS2DRenderer overwrites element.style.transform every frame — no transform here.
    const root = document.createElement("div");
    root.setAttribute(TRIP_PIN_ROOT_ATTR, "true");
    root.setAttribute(TRIP_PIN_CX_ATTR, String(pv.anchorX));
    root.setAttribute(TRIP_PIN_CY_ATTR, String(pv.anchorY));
    root.style.cssText = [
      "pointer-events:auto",
      "cursor:pointer",
      "user-select:none",
      "-webkit-user-select:none",
    ].join(";");

    const inner = document.createElement("div");
    inner.setAttribute(TRIP_PIN_INNER_ATTR, "true");
    const vis = smoothPinVisualRef.current;
    inner.style.cssText = [
      "display:block",
      `transform:translateY(-${vis.lift}px) scale(${vis.scale})`,
      `transform-origin:${transformOriginForAnchor(pv.anchorX, pv.anchorY)}`,
      "will-change:transform",
    ].join(";");

    const marker = document.createElement("div");
    marker.style.cssText = [
      "position:relative",
      `width:${TRIP_PIN_DISPLAY_W_PX}px`,
      `min-height:${displayH}px`,
      "flex-shrink:0",
      "line-height:0",
    ].join(";");

    const img = document.createElement("img");
    img.src = pv.src;
    img.alt = "";
    img.draggable = false;
    img.setAttribute("aria-hidden", "true");
    img.style.cssText = [
      "display:block",
      `width:${TRIP_PIN_DISPLAY_W_PX}px`,
      "height:auto",
      "vertical-align:top",
      "pointer-events:none",
    ].join(";");

    marker.appendChild(img);

    const emoji = document.createElement("span");
    emoji.textContent = pin.emoji;
    emoji.style.cssText = [
      "position:absolute",
      `left:${pv.emojiLeftPct}`,
      `top:${pv.emojiTopPct}`,
      "transform:translate(-50%,-50%)",
      "font-size:10px",
      "line-height:1",
      "pointer-events:none",
      "user-select:none",
      "-webkit-user-select:none",
      "filter:drop-shadow(0 1px 1px rgb(0 0 0 / 0.4))",
    ].join(";");
    emoji.setAttribute("aria-hidden", "true");

    marker.appendChild(emoji);
    inner.appendChild(marker);
    root.appendChild(inner);
    root.title = pin.title;

    root.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
    root.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      selectPinRef.current?.({
        id: pin.id,
        title: pin.title,
        type: pin.type,
        lat: pin.lat,
        lng: pin.lng,
        location: pin.location,
        link: pin.link,
      });
    });

    return root;
  }, []);

  const frameCamera = useCallback(() => {
    const g = globeRef.current;
    if (!g) return;
    if (pins.length) {
      const lat = pins.reduce((s, p) => s + p.lat, 0) / pins.length;
      const lng = pins.reduce((s, p) => s + p.lng, 0) / pins.length;
      const alt = altitudeForPins(pins);
      g.pointOfView({ lat, lng, altitude: alt }, 0);
    } else {
      g.pointOfView({ lat: 36.2, lng: 138, altitude: 1.65 }, 0);
    }
    snapPinVisualToGlobe();
  }, [pins, snapPinVisualToGlobe]);

  const onGlobeReady = useCallback(() => {
    frameCamera();
    requestAnimationFrame(() => {
      snapPinVisualToGlobe();
    });
  }, [frameCamera, snapPinVisualToGlobe]);

  useEffect(() => {
    frameCamera();
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        snapPinVisualToGlobe();
      });
    });
    return () => cancelAnimationFrame(id);
  }, [pins, basemap, frameCamera, snapPinVisualToGlobe]);

  useEffect(() => {
    return () => {
      if (pinSmoothRafRef.current != null) {
        cancelAnimationFrame(pinSmoothRafRef.current);
        pinSmoothRafRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!focusPinByIdRef) return;
    focusPinByIdRef.current = (itemId: string) => {
      const pin = pinsRef.current.find((p) => p.id === itemId);
      if (!pin) return;
      const g = globeRef.current;
      if (!g) return;
      const altBase =
        pinsRef.current.length <= 1
          ? altitudeForPins(pinsRef.current)
          : 0.1;
      /** List fly-to: 2× closer than the usual single-pin framing (lower altitude = zoomed in). */
      const alt = Math.max(0.03, altBase / 10);
      g.pointOfView({ lat: pin.lat, lng: pin.lng, altitude: alt }, 1400);
      selectPinRef.current?.(pin);
      kickPinSmooth();
    };
    return () => {
      focusPinByIdRef.current = null;
    };
  }, [focusPinByIdRef, kickPinSmooth]);

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isFill && "h-full min-h-0 w-full gap-2",
      )}
    >
      {!isFill ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <Label htmlFor="globe-basemap" className="text-xs">
              Map style
            </Label>
            <Select
              value={basemap}
              onValueChange={(v) => setBasemap(v as BasemapId)}
            >
              <SelectTrigger
                id="globe-basemap"
                className="h-9 w-full rounded-xl border-2 sm:w-[min(100%,280px)]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="osm">{BASEMAPS.osm.label}</SelectItem>
                <SelectItem value="voyager">{BASEMAPS.voyager.label}</SelectItem>
                <SelectItem value="positron">{BASEMAPS.positron.label}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-[11px] leading-snug text-muted-foreground sm:max-w-xs sm:text-right">
            Map pins scale with zoom; the tip marks the coordinates—click for
            details.
          </p>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-primary/15 bg-[#020617] shadow-lg",
          isFill && "min-h-0 flex-1 rounded-none border-0 shadow-none",
        )}
        style={isFill ? { minHeight: 0 } : { minHeight: dims.h }}
      >
        <Globe
          key={basemap}
          ref={globeRef}
          width={dims.w}
          height={dims.h}
          backgroundColor="rgba(2,6,23,0.92)"
          backgroundImageUrl={NIGHT_SKY}
          globeImageUrl={null}
          globeTileEngineUrl={tileUrl}
          // Supported by globe.gl / three-globe; not declared on react-globe.gl types.
          {...{ globeTileEngineMaxLevel: 19 }}
          globeCurvatureResolution={2}
          showGraticules={false}
          atmosphereColor="#5b8def"
          atmosphereAltitude={0.12}
          htmlElementsData={htmlElementsData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0}
          htmlElement={buildHtmlElement}
          htmlTransitionDuration={0}
          onZoom={kickPinSmooth}
          onGlobeReady={onGlobeReady}
        />
        {isFill ? (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center px-3">
            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/95 px-2.5 py-1.5 shadow-xl backdrop-blur-md">
              <div className="flex min-w-0 items-center gap-2">
                <Label htmlFor="globe-basemap-fill" className="sr-only">
                  Map style
                </Label>
                <Select
                  value={basemap}
                  onValueChange={(v) => setBasemap(v as BasemapId)}
                >
                  <SelectTrigger
                    id="globe-basemap-fill"
                    className="h-8 w-[min(100vw-10rem,240px)] shrink-0 rounded-lg border-2 text-xs sm:w-52"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    className="z-[110]"
                    position="popper"
                    sideOffset={4}
                  >
                    <SelectItem value="osm">{BASEMAPS.osm.label}</SelectItem>
                    <SelectItem value="voyager">
                      {BASEMAPS.voyager.label}
                    </SelectItem>
                    <SelectItem value="positron">
                      {BASEMAPS.positron.label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {onExitFullscreen ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="shrink-0 rounded-full border border-white/20 bg-slate-950/55 shadow-md backdrop-blur-md hover:bg-slate-950/70"
                  onClick={onExitFullscreen}
                >
                  <X className="mr-1 size-4" />
                  Exit map
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
        {selected && isFill ? (
          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 z-30 mx-auto max-w-md rounded-xl border border-primary/20 bg-card/95 px-4 py-3 text-sm shadow-xl backdrop-blur-md">
            <p className="font-display font-semibold text-foreground">
              {typeEmoji[selected.type] ?? "✨"} {selected.title}
            </p>
            <p className="text-muted-foreground capitalize">{selected.type}</p>
            {selected.location ? (
              <p className="mt-1 text-muted-foreground">{selected.location}</p>
            ) : null}
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
            </p>
            {selected.link?.trim() ? (
              <a
                href={selected.link.trim()}
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Open website ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <p
        className={cn(
          "text-center text-[11px] leading-relaxed text-muted-foreground",
          isFill && "shrink-0 px-1 text-left text-[10px]",
        )}
      >
        Map data: {attribution}.{" "}
        <a
          href="https://wiki.openstreetmap.org/wiki/Tile_usage_policy"
          className="underline underline-offset-2 hover:text-foreground"
          target="_blank"
          rel="noreferrer"
        >
          Tile policy
        </a>
      </p>

      {selected && !isFill ? (
        <div className="rounded-xl border border-primary/15 bg-card/90 px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
          <p className="font-display font-semibold text-foreground">
            {typeEmoji[selected.type] ?? "✨"} {selected.title}
          </p>
          <p className="text-muted-foreground capitalize">{selected.type}</p>
          {selected.location ? (
            <p className="mt-1 text-muted-foreground">{selected.location}</p>
          ) : null}
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
          </p>
          {selected.link?.trim() ? (
            <a
              href={selected.link.trim()}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Open website ↗
            </a>
          ) : null}
        </div>
      ) : !selected && !isFill ? (
        <p className="text-center text-xs text-muted-foreground">
          Click a pin for details. Drag to rotate, scroll to zoom.
        </p>
      ) : null}
    </div>
  );
}
