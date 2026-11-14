import { geoConicEqualArea, geoPath, type GeoProjection } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";

import usTopoJson from "../../assets/geo/us-states-10m.json";
import naTopoJson from "../../assets/geo/north-america-context.json";
import schoolsJson from "../../assets/usaaio/2026-round2/schools.json";
import countsJson from "../../assets/usaaio/2026-round2/counts.json";
import { STATE_NAMES } from "@/content/place-names";

export const TIERS = ["Camper", "Gold", "Silver", "Bronze"] as const;
export type Tier = (typeof TIERS)[number];
export type TierCounts = Record<Tier, number>;

type SchoolRecord = {
  city: string | null;
  region: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  note: string | null;
};

export type MapSchool = {
  name: string;
  city: string | null;
  region: string | null;
  country: string | null;
  note: string | null;
  /** Key into MapData.regions ("USA:CA", "Canada:ON"); null when outside the drawn regions. */
  regionId: string | null;
  x: number | null;
  y: number | null;
  inset: "HI" | "AK" | null;
  counts: TierCounts;
  total: number;
};

export type MapRegion = {
  id: string;
  code: string;
  country: "USA" | "Canada";
  d: string;
  bounds: [[number, number], [number, number]];
};

export type MapInset = {
  id: "HI" | "AK";
  box: [number, number, number, number];
  d: string;
};

export type MapData = {
  width: number;
  height: number;
  regions: MapRegion[];
  stateBorders: string;
  mexico: string;
  lakes: string;
  insets: MapInset[];
  presets: { key: "bay" | "socal" | "northeast" | "toronto"; bounds: [[number, number], [number, number]] }[];
  schools: MapSchool[];
};

const W = 975;
const H = 610;

const PRESETS = {
  bay: [[-122.55, 37.15], [-121.5, 37.85]],
  socal: [[-118.9, 32.65], [-116.9, 34.5]],
  northeast: [[-77.8, 38.5], [-70.6, 43.3]],
  toronto: [[-79.75, 43.45], [-79.05, 44.0]],
} as const;

const usTopo = usTopoJson as unknown as Topology<{ states: GeometryCollection<{ name: string }> }>;
const naTopo = naTopoJson as unknown as Topology<{
  provinces: GeometryCollection<{ name: string; postal: string }>;
  mexico: GeometryCollection;
  lakes: GeometryCollection;
}>;

const CODE_BY_NAME = Object.fromEntries(Object.entries(STATE_NAMES).map(([code, n]) => [n.en, code]));

function bounds(path: ReturnType<typeof geoPath>, f: Feature | FeatureCollection) {
  const [[x0, y0], [x1, y1]] = path.bounds(f);
  const r = (n: number) => Math.round(n * 10) / 10;
  return [[r(x0), r(y0)], [r(x1), r(y1)]] as [[number, number], [number, number]];
}

function project(p: GeoProjection, lon: number, lat: number) {
  const xy = p([lon, lat]);
  return xy ? ([Math.round(xy[0] * 10) / 10, Math.round(xy[1] * 10) / 10] as const) : null;
}

function build(): MapData {
  const states = (feature(usTopo, usTopo.objects.states) as FeatureCollection<Geometry, { name: string }>).features
    .map((f) => ({ f, code: CODE_BY_NAME[f.properties.name] }))
    .filter((s): s is { f: Feature<Geometry, { name: string }>; code: string } => !!s.code);

  const lower48 = states.filter((s) => s.code !== "AK" && s.code !== "HI");
  const lower48Fc: FeatureCollection = { type: "FeatureCollection", features: lower48.map((s) => s.f) };

  const main = geoConicEqualArea()
    .parallels([29.5, 45.5])
    .rotate([96, 0])
    .fitExtent([[18, 62], [W - 18, H - 14]], lower48Fc);
  main.clipExtent([[-100, -100], [W + 100, H + 100]]);
  const path = geoPath(main).digits(1);

  const provinces = (feature(naTopo, naTopo.objects.provinces) as FeatureCollection<Geometry, { name: string; postal: string }>).features;

  const regions: MapRegion[] = [
    ...lower48.map((s) => ({ id: `USA:${s.code}`, code: s.code, country: "USA" as const, d: path(s.f) ?? "", bounds: bounds(path, s.f) })),
    ...provinces.map((f) => ({
      id: `Canada:${f.properties.postal}`,
      code: f.properties.postal,
      country: "Canada" as const,
      d: path(f) ?? "",
      bounds: bounds(path, f),
    })),
  ].filter((r) => r.d);

  const stateBorders = path(mesh(usTopo, usTopo.objects.states, (a, b) => a !== b)) ?? "";
  const mexico = path(feature(naTopo, naTopo.objects.mexico)) ?? "";
  const lakes = path(feature(naTopo, naTopo.objects.lakes)) ?? "";

  const hiBox: MapInset["box"] = [14, H - 92, 150, 78];
  const akBox: MapInset["box"] = [14, H - 196, 150, 96];
  const hiFeature = states.find((s) => s.code === "HI")!.f;
  const akFeature = states.find((s) => s.code === "AK")!.f;
  const hi = geoConicEqualArea().rotate([157, 0]).center([-3, 19.9]).parallels([8, 18])
    .fitExtent([[hiBox[0] + 8, hiBox[1] + 14], [hiBox[0] + hiBox[2] - 8, hiBox[1] + hiBox[3] - 6]], hiFeature);
  const ak = geoConicEqualArea().rotate([154, 0]).center([-2, 58.5]).parallels([55, 65])
    .fitExtent([[akBox[0] + 8, akBox[1] + 14], [akBox[0] + akBox[2] - 8, akBox[1] + akBox[3] - 6]], akFeature);
  const insets: MapInset[] = [
    { id: "AK", box: akBox, d: geoPath(ak).digits(1)(akFeature) ?? "" },
    { id: "HI", box: hiBox, d: geoPath(hi).digits(1)(hiFeature) ?? "" },
  ];

  const presets = (Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map((key) => {
    const [a, b] = PRESETS[key].map(([lon, lat]) => project(main, lon, lat)!);
    return {
      key,
      bounds: [[Math.min(a[0], b[0]), Math.min(a[1], b[1])], [Math.max(a[0], b[0]), Math.max(a[1], b[1])]] as [[number, number], [number, number]],
    };
  });

  const records = schoolsJson as Record<string, SchoolRecord>;
  const counts = countsJson as Record<string, TierCounts>;
  const regionIds = new Set(regions.map((r) => r.id));

  const schools: MapSchool[] = Object.entries(counts).map(([name, c]) => {
    const s = records[name] ?? { city: null, region: null, country: null, lat: null, lon: null, note: "location unknown" };
    const id = s.country && s.region ? `${s.country}:${s.region}` : null;
    let xy: readonly [number, number] | null = null;
    let inset: MapSchool["inset"] = null;
    if (s.lat != null && s.lon != null && (s.country === "USA" || s.country === "Canada")) {
      if (s.region === "HI") {
        xy = project(hi, s.lon, s.lat);
        inset = "HI";
      } else if (s.region === "AK") {
        xy = project(ak, s.lon, s.lat);
        inset = "AK";
      } else {
        xy = project(main, s.lon, s.lat);
      }
    }
    return {
      name,
      city: s.city,
      region: s.region,
      country: s.country,
      note: s.note,
      regionId: id && (regionIds.has(id) || s.region === "HI" || s.region === "AK") ? id : null,
      x: xy ? xy[0] : null,
      y: xy ? xy[1] : null,
      inset,
      counts: { Camper: c.Camper ?? 0, Gold: c.Gold ?? 0, Silver: c.Silver ?? 0, Bronze: c.Bronze ?? 0 },
      total: TIERS.reduce((n, t) => n + (c[t] ?? 0), 0),
    };
  });

  return { width: W, height: H, regions, stateBorders, mexico, lakes, insets, presets, schools };
}

let cached: MapData | null = null;
export function getMapData(): MapData {
  return (cached ??= build());
}

export function getUsaaioStats() {
  const schools = getMapData().schools;
  const byTier = Object.fromEntries(TIERS.map((t) => [t, schools.reduce((n, s) => n + s.counts[t], 0)])) as TierCounts;
  const winners = schools.reduce((n, s) => n + s.total, 0);
  const states = new Set(schools.filter((s) => s.country === "USA" && s.region).map((s) => s.region)).size;
  const countries = new Set(schools.map((s) => s.country).filter(Boolean)).size;
  return { winners, schools: schools.length, states, countries, byTier };
}
