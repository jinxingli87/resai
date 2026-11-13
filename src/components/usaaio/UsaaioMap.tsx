"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { select } from "d3-selection";
import "d3-transition";
import { zoom as d3zoom, zoomIdentity, zoomTransform, type ZoomBehavior } from "d3-zoom";
import { forceCollide, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";
import { arc as d3arc, pie as d3pie } from "d3-shape";
import { Minus, Plus, RotateCcw, Search, X } from "lucide-react";

import type { MapData, MapSchool, Tier, TierCounts } from "@/lib/usaaio-data";
import { placeLabel, regionName, SCHOOL_NOTES } from "@/content/place-names";
import { cn } from "@/lib/utils";

const TIERS: Tier[] = ["Camper", "Gold", "Silver", "Bronze"];
type TierFilter = Tier | "All";
const TIER_COLORS: Record<Tier, string> = { Camper: "#6d28d9", Gold: "#e0a800", Silver: "#8e9aab", Bronze: "#b8733d" };
const ALL_COLOR = "#c2410c";
const MAX_ZOOM = 40;
const DODGE_MIN_ZOOM = 2.5;
const MAX_R = 24;

type Bounds = [[number, number], [number, number]];
type Tip = { x: number; y: number; w: number; h: number; kind: "school" | "region"; id: string; pinned: boolean };

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

const glyphScale = (k: number) => Math.min(1.6, Math.pow(k, 0.13));
const countFor = (s: { counts: TierCounts; total: number }, t: TierFilter) => (t === "All" ? s.total : s.counts[t]);
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pieGen = d3pie<{ tier: Tier; value: number }>().sort(null).value((d) => d.value);
const arcGen = d3arc<{ startAngle: number; endAngle: number }>().innerRadius(0);

export function UsaaioMap({ data }: { data: MapData }) {
  const t = useTranslations("map");
  const locale = useLocale() as "en" | "zh";
  const { width: W, height: H } = data;

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [tier, setTier] = useState<TierFilter>("All");
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  const [settledK, setSettledK] = useState(1);
  const [focus, setFocus] = useState<string | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [flashed, setFlashed] = useState<string | null>(null);
  const [showAllRegions, setShowAllRegions] = useState(false);
  const [showAllSchools, setShowAllSchools] = useState(false);
  const [query, setQuery] = useState("");

  const byName = useMemo(() => new Map(data.schools.map((s) => [s.name, s])), [data.schools]);
  const regionById = useMemo(() => new Map(data.regions.map((r) => [r.id, r])), [data.regions]);
  const maxTotal = useMemo(() => Math.max(...data.schools.map((s) => s.total)), [data.schools]);
  const radius = useCallback((n: number) => MAX_R * Math.sqrt(n / maxTotal), [maxTotal]);

  const nameOfRegion = useCallback(
    (id: string) => {
      const [country, code] = id.split(":");
      return regionName(country, code, locale) ?? id;
    },
    [locale],
  );

  // ---------- derived data ----------
  const active = useMemo(() => data.schools.filter((s) => countFor(s, tier) > 0), [data.schools, tier]);
  const onMain = useMemo(() => active.filter((s) => s.x != null && !s.inset), [active]);
  const onInset = useMemo(() => active.filter((s) => s.inset), [active]);
  const offMap = useMemo(
    () => active.filter((s) => s.x == null).sort((a, b) => (a.country ?? "~").localeCompare(b.country ?? "~") || countFor(b, tier) - countFor(a, tier)),
    [active, tier],
  );

  const regionStats = useMemo(() => {
    const m = new Map<string, { id: string; total: number; schools: number; counts: TierCounts }>();
    for (const s of active) {
      if (!s.regionId) continue;
      const e = m.get(s.regionId) ?? { id: s.regionId, total: 0, schools: 0, counts: { Camper: 0, Gold: 0, Silver: 0, Bronze: 0 } };
      e.total += countFor(s, tier);
      e.schools += 1;
      for (const x of TIERS) if (tier === "All" || x === tier) e.counts[x] += s.counts[x];
      m.set(s.regionId, e);
    }
    return m;
  }, [active, tier]);

  const maxRegion = Math.max(1, ...[...regionStats.values()].map((r) => r.total));
  const base = tier === "All" ? ALL_COLOR : TIER_COLORS[tier];
  const top = mix("#ffffff", base, 0.5);
  const fillFor = (total: number) => mix("#f1f5f9", top, 0.25 + 0.75 * Math.sqrt(total / maxRegion));

  const tierTotals = useMemo(() => {
    const o = { All: 0, Camper: 0, Gold: 0, Silver: 0, Bronze: 0 } as Record<TierFilter, number>;
    for (const s of data.schools) {
      o.All += s.total;
      for (const x of TIERS) o[x] += s.counts[x];
    }
    return o;
  }, [data.schools]);

  const kpis = useMemo(() => {
    const winners = active.reduce((n, s) => n + countFor(s, tier), 0);
    const states = new Set(active.filter((s) => s.country === "USA").map((s) => s.region)).size;
    const outside = active.filter((s) => s.country && s.country !== "USA").reduce((n, s) => n + countFor(s, tier), 0);
    return { winners, schools: active.length, states, outside };
  }, [active, tier]);

  // ---------- zoom ----------
  useEffect(() => {
    const svg = select(svgRef.current!);
    const z = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_ZOOM])
      .translateExtent([[-80, -80], [W + 80, H + 80]])
      .filter((e: MouseEvent | WheelEvent | TouchEvent) =>
        e.type === "wheel" ? e.ctrlKey || e.metaKey : !(e as MouseEvent).ctrlKey && !(e as MouseEvent).button,
      )
      .on("zoom", (e) => {
        setView({ k: e.transform.k, x: e.transform.x, y: e.transform.y });
        if (e.sourceEvent) setTip(null);
      })
      .on("end", (e) => setSettledK(e.transform.k));
    svg.call(z).on("dblclick.zoom", null);
    zoomRef.current = z;
    return () => {
      svg.on(".zoom", null);
    };
  }, [W, H]);

  const animate = useCallback((fn: (z: ZoomBehavior<SVGSVGElement, unknown>) => (sel: never) => void, ms = 750) => {
    const svg = select(svgRef.current!);
    const z = zoomRef.current!;
    return svg
      .transition()
      .duration(reducedMotion() ? 0 : ms)
      .call(fn(z) as never)
      .end()
      .catch(() => {});
  }, []);

  const zoomTo = useCallback(
    ([[x0, y0], [x1, y1]]: Bounds, maxK = MAX_ZOOM) => {
      const k = Math.min(maxK, 0.88 / Math.max((x1 - x0) / W, (y1 - y0) / H));
      const tr = zoomIdentity.translate(W / 2, H / 2).scale(k).translate(-(x0 + x1) / 2, -(y0 + y1) / 2);
      return animate((z) => (sel) => z.transform(sel, tr));
    },
    [W, H, animate],
  );
  const zoomBy = (f: number) => animate((z) => (sel) => z.scaleBy(sel, f), 300);
  const resetZoom = () => animate((z) => (sel) => z.transform(sel, zoomIdentity));

  // ---------- dodge overlapping glyphs at regional zoom ----------
  const offsets = useMemo(() => {
    const m = new Map<string, { dx: number; dy: number }>();
    if (settledK < DODGE_MIN_ZOOM) return m;
    const gs = glyphScale(settledK);
    type N = SimulationNodeDatum & { name: string; tx: number; ty: number; r: number };
    const nodes: N[] = onMain.map((s) => ({
      name: s.name,
      tx: s.x! * settledK,
      ty: s.y! * settledK,
      x: s.x! * settledK,
      y: s.y! * settledK,
      r: radius(countFor(s, tier)) * gs + 1.5,
    }));
    const sim = forceSimulation(nodes)
      .force("x", forceX<N>((n) => n.tx).strength(0.25))
      .force("y", forceY<N>((n) => n.ty).strength(0.25))
      .force("collide", forceCollide<N>((n) => n.r).iterations(4))
      .stop();
    for (let i = 0; i < 160; i++) sim.tick();
    for (const n of nodes) {
      const dx = n.x! - n.tx;
      const dy = n.y! - n.ty;
      if (Math.hypot(dx, dy) > 0.5) m.set(n.name, { dx, dy });
    }
    return m;
  }, [onMain, settledK, tier, radius]);

  // ---------- tooltips ----------
  const localPoint = (clientX: number, clientY: number) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top, w: r.width, h: r.height };
  };

  const hover = (e: React.PointerEvent, kind: Tip["kind"], id: string) => {
    if (e.pointerType !== "mouse" || tip?.pinned) return;
    setTip({ ...localPoint(e.clientX, e.clientY), kind, id, pinned: false });
  };
  const leave = () => setTip((cur) => (cur?.pinned ? cur : null));

  const svgToLocal = (sx: number, sy: number, useZoom = true) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const wrap = wrapRef.current!.getBoundingClientRect();
    const scale = rect.width / W;
    const tr = useZoom ? zoomTransform(svg) : zoomIdentity;
    return {
      x: (sx * tr.k + tr.x) * scale + rect.left - wrap.left,
      y: (sy * tr.k + tr.y) * scale + rect.top - wrap.top,
      w: wrap.width,
      h: wrap.height,
    };
  };

  // ---------- focus ----------
  const focusRegion = (id: string | null) => {
    setFocus(id);
    setTip(null);
    const r = id ? regionById.get(id) : null;
    if (r) zoomTo(r.bounds, 10);
    else resetZoom();
  };

  const focusSchool = async (name: string) => {
    const s = byName.get(name);
    if (!s) return;
    if (countFor(s, tier) === 0) setTier("All");
    setTip(null);
    if (s.x == null) {
      const el = document.getElementById(`offmap-${slugify(s.name)}`);
      el?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      setFlashed(s.name);
      setTimeout(() => setFlashed(null), 1800);
      return;
    }
    if (s.inset) {
      await resetZoom();
      setTip({ ...svgToLocal(s.x, s.y!, false), kind: "school", id: s.name, pinned: true });
      return;
    }
    await zoomTo([[s.x - 12, s.y! - 12], [s.x + 12, s.y! + 12]], 16);
    await new Promise((r) => setTimeout(r, 380));
    const o = offsets.get(s.name);
    const k = zoomTransform(svgRef.current!).k;
    setHighlight(s.name);
    setTip({ ...svgToLocal(s.x + (o ? o.dx / k : 0), s.y! + (o ? o.dy / k : 0)), kind: "school", id: s.name, pinned: true });
    setTimeout(() => setHighlight(null), 2500);
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const hit = data.schools.find((s) => s.name.toLowerCase() === q) ?? data.schools.find((s) => s.name.toLowerCase().includes(q));
    if (hit) focusSchool(hit.name);
  };

  // ---------- lists ----------
  const regionList = useMemo(() => [...regionStats.values()].sort((a, b) => b.total - a.total || a.id.localeCompare(b.id)), [regionStats]);
  const schoolList = useMemo(() => [...active].sort((a, b) => countFor(b, tier) - countFor(a, tier) || a.name.localeCompare(b.name)), [active, tier]);
  const shownRegions = showAllRegions ? regionList : regionList.slice(0, 8);
  const shownSchools = showAllSchools ? schoolList : schoolList.slice(0, 12);
  const focusSchools = focus ? schoolList.filter((s) => s.regionId === focus) : [];

  const tiersShown = tier === "All" ? TIERS : [tier];
  const tierLabel = (x: TierFilter) => t(`tiers.${x}`);

  const k = view.k;
  const gs = glyphScale(k);
  const insetOpacity = k > 1.4 ? 0 : 1;

  const renderGlyph = (s: MapSchool, scale: number, offset?: { dx: number; dy: number }) => {
    const n = countFor(s, tier);
    const r = radius(n);
    const slices = pieGen(TIERS.map((x) => ({ tier: x, value: tier === "All" || x === tier ? s.counts[x] : 0 })));
    const dimmed = focus && s.regionId !== focus;
    return (
      <g
        key={s.name}
        transform={`translate(${s.x},${s.y}) scale(${scale})`}
        className={cn("cursor-pointer transition-opacity", dimmed && "opacity-25")}
        onPointerMove={(e) => hover(e, "school", s.name)}
        onPointerLeave={leave}
        onClick={(e) => {
          e.stopPropagation();
          setTip({ ...localPoint(e.clientX, e.clientY), kind: "school", id: s.name, pinned: true });
        }}
        role="img"
        aria-label={`${s.name}: ${n}`}
      >
        <g style={{ transform: offset ? `translate(${offset.dx / gs}px, ${offset.dy / gs}px)` : undefined, transition: "transform 350ms ease" }}>
          {slices.map((sl) =>
            sl.data.value > 0 ? <path key={sl.data.tier} d={arcGen.outerRadius(r)(sl) ?? ""} fill={TIER_COLORS[sl.data.tier]} /> : null,
          )}
          <circle
            r={r}
            fill="none"
            stroke={highlight === s.name ? "#0f172a" : "#fff"}
            strokeWidth={highlight === s.name ? 3 : 1.25}
          />
          {n >= 2 && (
            <text textAnchor="middle" dy="0.35em" fontSize={Math.max(9, r * 0.75)} fontWeight={700} fill="#fff" pointerEvents="none" style={{ paintOrder: "stroke", stroke: "rgba(15,23,42,.35)", strokeWidth: 2 }}>
              {n}
            </text>
          )}
        </g>
      </g>
    );
  };

  const tipSchool = tip?.kind === "school" ? byName.get(tip.id) : null;
  const tipRegion = tip?.kind === "region" ? regionStats.get(tip.id) : null;
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label={t("tierFilter")} className="flex flex-wrap gap-2">
          {(["All", ...TIERS] as TierFilter[]).map((x) => (
            <button
              key={x}
              role="tab"
              aria-selected={tier === x}
              onClick={() => setTier(x)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                tier === x ? "border-ink bg-ink text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
              )}
            >
              <span className="size-2.5 rounded-full" style={{ background: x === "All" ? ALL_COLOR : TIER_COLORS[x] }} />
              {tierLabel(x)}
              <span className={cn("tabular-nums", tier === x ? "text-white/70" : "text-slate-400")}>{tierTotals[x]}</span>
            </button>
          ))}
        </div>
        <form onSubmit={onSearch} className="relative w-full lg:w-80" role="search">
          <label htmlFor="school-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="school-search"
            list="school-options"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (byName.has(e.target.value)) focusSchool(e.target.value);
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-slate-200 bg-white py-2 pr-4 pl-9 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
          <datalist id="school-options">
            {data.schools.map((s) => (
              <option key={s.name} value={s.name} />
            ))}
          </datalist>
        </form>
      </div>

      {/* KPIs */}
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [kpis.winners, tier === "All" ? t("kpi.winners") : t("kpi.tierWinners", { tier: tierLabel(tier) })],
          [kpis.schools, t("kpi.schools")],
          [kpis.states, t("kpi.states")],
          [kpis.outside, t("kpi.outside")],
        ].map(([v, l]) => (
          <div key={String(l)} className="rounded-2xl border border-slate-200 bg-white p-4">
            <dd className="text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">{v}</dd>
            <dt className="mt-1 text-sm text-slate-500">{l}</dt>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div ref={wrapRef} className="relative">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="block h-auto w-full touch-none select-none"
              role="group"
              aria-label={t("mapLabel")}
              onClick={() => {
                if (tip?.pinned) setTip(null);
                else if (focus) focusRegion(null);
              }}
            >
              <rect width={W} height={H} fill="#f8fafc" />
              <g transform={`translate(${view.x},${view.y}) scale(${k})`}>
                <path d={data.mexico} fill="#eef0f3" stroke="#d5dbe2" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
                {data.regions.map((r) => {
                  const st = regionStats.get(r.id);
                  const canada = r.country === "Canada";
                  return (
                    <path
                      key={r.id}
                      d={r.d}
                      fill={st ? fillFor(st.total) : canada ? "#eef1f4" : "#e5e9ee"}
                      stroke={canada ? "#d0d7df" : "#fff"}
                      strokeWidth={canada ? 0.6 : 0.8}
                      vectorEffect="non-scaling-stroke"
                      className="cursor-pointer transition-[fill] duration-300 hover:brightness-95"
                      onPointerMove={(e) => hover(e, "region", r.id)}
                      onPointerLeave={leave}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusRegion(focus === r.id ? null : r.id);
                      }}
                    />
                  );
                })}
                <path d={data.stateBorders} fill="none" stroke="#fff" strokeWidth={1} vectorEffect="non-scaling-stroke" pointerEvents="none" />
                <path d={data.lakes} fill="#dbe7f3" stroke="#c6d6e6" strokeWidth={0.5} vectorEffect="non-scaling-stroke" pointerEvents="none" />
                {focus && regionById.get(focus) && (
                  <path d={regionById.get(focus)!.d} fill="none" stroke="#0f172a" strokeWidth={2} vectorEffect="non-scaling-stroke" pointerEvents="none" />
                )}
                <g pointerEvents="none">
                  {onMain.map((s) => {
                    const o = offsets.get(s.name);
                    if (!o || Math.hypot(o.dx, o.dy) <= radius(countFor(s, tier)) * gs * 0.6) return null;
                    return (
                      <g key={s.name}>
                        <line x1={s.x!} y1={s.y!} x2={s.x! + o.dx / k} y2={s.y! + o.dy / k} stroke="#475569" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                        <circle cx={s.x!} cy={s.y!} r={2 / k} fill="#475569" />
                      </g>
                    );
                  })}
                </g>
                {onMain.map((s) => renderGlyph(s, gs / k, offsets.get(s.name)))}
              </g>

              {/* Insets stay fixed while the main map zooms */}
              <g style={{ opacity: insetOpacity, transition: "opacity 200ms" }} pointerEvents={insetOpacity ? "auto" : "none"}>
                {data.insets.map((inset) => {
                  const [x, y, w, h] = inset.box;
                  const id = `USA:${inset.id}`;
                  const st = regionStats.get(id);
                  return (
                    <g key={inset.id}>
                      <rect x={x} y={y} width={w} height={h} rx={6} fill="#fff" fillOpacity={0.9} stroke="#cbd5e1" />
                      <text x={x + 8} y={y + 12} fontSize={9} fill="#64748b" fontWeight={600}>
                        {nameOfRegion(id)}
                      </text>
                      <path
                        d={inset.d}
                        fill={st ? fillFor(st.total) : "#e5e9ee"}
                        stroke="#fff"
                        strokeWidth={0.6}
                        onPointerMove={(e) => hover(e, "region", id)}
                        onPointerLeave={leave}
                      />
                    </g>
                  );
                })}
                {onInset.map((s) => renderGlyph(s, 1))}
              </g>
            </svg>

            {/* Zoom controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <ZoomButton label={t("zoomIn")} onClick={() => zoomBy(1.8)}>
                <Plus className="size-4" aria-hidden />
              </ZoomButton>
              <ZoomButton label={t("zoomOut")} onClick={() => zoomBy(1 / 1.8)}>
                <Minus className="size-4" aria-hidden />
              </ZoomButton>
              <ZoomButton
                label={t("reset")}
                onClick={() => {
                  setFocus(null);
                  setTip(null);
                  resetZoom();
                }}
              >
                <RotateCcw className="size-4" aria-hidden />
              </ZoomButton>
            </div>

            {/* Tooltip */}
            {tip && (tipSchool || tip.kind === "region") && (
              <div
                className="pointer-events-auto absolute z-10 w-64 rounded-xl border border-slate-200 bg-white/95 p-3 text-sm shadow-lg backdrop-blur"
                style={{
                  left: Math.max(4, tip.x + 270 > tip.w ? tip.x - 270 : tip.x + 14),
                  top: tip.y > tip.h * 0.55 ? undefined : tip.y + 14,
                  bottom: tip.y > tip.h * 0.55 ? tip.h - tip.y + 14 : undefined,
                }}
                role="status"
              >
                {tip.pinned && (
                  <button onClick={() => setTip(null)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600" aria-label={t("close")}>
                    <X className="size-4" />
                  </button>
                )}
                {tipSchool ? (
                  <>
                    <div className="pr-5 font-semibold text-ink">{tipSchool.name}</div>
                    <div className="text-xs text-slate-500">{placeLabel(tipSchool, locale)}</div>
                    {tipSchool.note && tipSchool.note !== "location unknown" && (
                      <div className="mt-1 text-xs text-amber-700">{SCHOOL_NOTES[tipSchool.note]?.[locale] ?? tipSchool.note}</div>
                    )}
                    <div className="mt-2">
                      {tier === "All"
                        ? t("winnersCount", { count: countFor(tipSchool, tier) })
                        : t("tierWinnersCount", { count: countFor(tipSchool, tier), tier: tierLabel(tier) })}
                    </div>
                    <Chips counts={tipSchool.counts} tiers={tiersShown} label={tierLabel} />
                    {tier !== "All" && tipSchool.total > countFor(tipSchool, tier) && (
                      <div className="mt-1.5 text-xs text-slate-500">{t("acrossAll", { count: tipSchool.total })}</div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-ink">{nameOfRegion(tip.id)}</div>
                    {tipRegion ? (
                      <>
                        <div className="mt-1">{t("regionSummary", { winners: tipRegion.total, schools: tipRegion.schools })}</div>
                        <Chips counts={tipRegion.counts} tiers={tiersShown} label={tierLabel} />
                        <div className="mt-1.5 text-xs text-slate-500">{t("clickToZoom")}</div>
                      </>
                    ) : (
                      <div className="mt-1 text-slate-500">{t("noWinners")}</div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Region presets + legend */}
          <div className="flex flex-col gap-4 border-t border-slate-100 p-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase">{t("jumpTo")}</div>
              <div className="flex flex-wrap gap-1.5">
                {data.presets.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => {
                      setFocus(null);
                      zoomTo(p.bounds);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:border-brand-500 hover:text-brand-700"
                  >
                    {t(`presets.${p.key}`)}
                  </button>
                ))}
              </div>
            </div>
            <Legend tiers={tiersShown} label={tierLabel} radius={radius} maxTotal={maxTotal} base={tier === "All" ? "#cbd5e1" : TIER_COLORS[tier]} title={t("legendSize")} mixTitle={tier === "All" ? t("legendMix") : t("legendTier")} />
          </div>
          <p className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500">{t("zoomHint")}</p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {focus ? (
            <Panel
              title={nameOfRegion(focus)}
              action={
                <button onClick={() => focusRegion(null)} className="text-sm font-medium text-brand-700 hover:underline">
                  {t("clear")}
                </button>
              }
            >
              <p className="-mt-1 mb-3 text-sm text-slate-500">
                {t("regionSummary", { winners: focusSchools.reduce((n, s) => n + countFor(s, tier), 0), schools: focusSchools.length })}
              </p>
              {focusSchools.length ? (
                <BarList items={focusSchools.map((s) => ({ key: s.name, name: s.name, sub: s.city ?? "", counts: s.counts, total: countFor(s, tier), onClick: () => focusSchool(s.name) }))} tiers={tiersShown} />
              ) : (
                <p className="text-sm text-slate-500">{t("noWinners")}</p>
              )}
            </Panel>
          ) : (
            <Panel title={t("byTier")}>
              <ul className="space-y-2.5">
                {TIERS.map((x) => (
                  <li key={x}>
                    <button onClick={() => setTier(tier === x ? "All" : x)} className={cn("grid w-full grid-cols-[88px_1fr_32px] items-center gap-3 text-left text-sm", tier !== "All" && tier !== x && "opacity-40")}>
                      <span className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: TIER_COLORS[x] }} />
                        {tierLabel(x)}
                      </span>
                      <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <span className="block h-full rounded-full" style={{ width: `${(tierTotals[x] / Math.max(...TIERS.map((y) => tierTotals[y]))) * 100}%`, background: TIER_COLORS[x] }} />
                      </span>
                      <span className="text-right font-medium tabular-nums">{tierTotals[x]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title={t("topRegions")}>
            <BarList
              items={shownRegions.map((r) => ({ key: r.id, name: nameOfRegion(r.id), sub: t("schoolsCount", { count: r.schools }), counts: r.counts, total: r.total, onClick: () => focusRegion(r.id) }))}
              tiers={tiersShown}
            />
            {regionList.length > 8 && (
              <button onClick={() => setShowAllRegions((v) => !v)} className="mt-3 text-sm font-medium text-brand-700 hover:underline">
                {showAllRegions ? t("showFewer") : t("showAllRegions", { count: regionList.length })}
              </button>
            )}
          </Panel>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title={t("topSchools")}>
          <div className="columns-1 gap-8 md:columns-2">
            <BarList
              items={shownSchools.map((s) => ({ key: s.name, name: s.name, sub: placeLabel(s, locale), counts: s.counts, total: countFor(s, tier), onClick: () => focusSchool(s.name) }))}
              tiers={tiersShown}
              max={shownSchools.length ? countFor(shownSchools[0], tier) : 1}
            />
          </div>
          {schoolList.length > 12 && (
            <button onClick={() => setShowAllSchools((v) => !v)} className="mt-3 text-sm font-medium text-brand-700 hover:underline">
              {showAllSchools ? t("showFewer") : t("showAllSchools", { count: schoolList.length })}
            </button>
          )}
        </Panel>

        <Panel title={t("outside")}>
          <p className="-mt-1 mb-3 text-sm text-slate-500">{t("outsideNote")}</p>
          {offMap.length ? (
            <ul className="space-y-2">
              {offMap.map((s) => (
                <li
                  key={s.name}
                  id={`offmap-${slugify(s.name)}`}
                  className={cn("flex items-start justify-between gap-3 rounded-lg p-2 text-sm transition-colors duration-700", flashed === s.name ? "bg-amber-100" : "bg-transparent")}
                >
                  <span>
                    <span className="font-medium text-ink">{s.name}</span>
                    <span className="block text-xs text-slate-500">{placeLabel(s, locale)}</span>
                    {!s.country && <span className="block text-xs text-amber-700">{t("unknownNote")}</span>}
                  </span>
                  <span className="font-semibold tabular-nums">{countFor(s, tier)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">{t("noneInTier")}</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-white/95 text-slate-700 shadow-sm hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Chips({ counts, tiers, label }: { counts: TierCounts; tiers: Tier[]; label: (t: Tier) => string }) {
  const shown = tiers.filter((x) => counts[x] > 0);
  if (!shown.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {shown.map((x) => (
        <span key={x} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs">
          <span className="size-2 rounded-full" style={{ background: TIER_COLORS[x] }} />
          {label(x)} {counts[x]}
        </span>
      ))}
    </div>
  );
}

function BarList({
  items,
  tiers,
  max,
}: {
  items: { key: string; name: string; sub: string; counts: TierCounts; total: number; onClick: () => void }[];
  tiers: Tier[];
  max?: number;
}) {
  const m = max ?? Math.max(1, ...items.map((i) => i.total));
  return (
    <ol className="space-y-1">
      {items.map((i) => (
        <li key={i.key} className="break-inside-avoid">
          <button onClick={i.onClick} className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
            <span className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-medium text-ink" title={i.name}>
                {i.name}
              </span>
              <span className="font-semibold tabular-nums">{i.total}</span>
            </span>
            {i.sub && <span className="block truncate text-xs text-slate-500">{i.sub}</span>}
            <span className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
              {tiers.map((x) => (
                <span key={x} style={{ width: `${(i.counts[x] / m) * 100}%`, background: TIER_COLORS[x] }} />
              ))}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function Legend({
  tiers,
  label,
  radius,
  maxTotal,
  base,
  title,
  mixTitle,
}: {
  tiers: Tier[];
  label: (t: Tier) => string;
  radius: (n: number) => number;
  maxTotal: number;
  base: string;
  title: string;
  mixTitle: string;
}) {
  const sizes = [1, 2, 5, maxTotal];
  const maxR = radius(maxTotal);
  const widths = sizes.map((n) => Math.max(2 * radius(n), 14));
  const gap = 12;
  let x = 1;
  return (
    <div className="flex flex-wrap items-end gap-6">
      <div>
        <div className="mb-1 text-xs text-slate-500">{title}</div>
        <svg width={widths.reduce((a, b) => a + b, 0) + gap * (sizes.length - 1) + 2} height={maxR * 2 + 14} aria-hidden>
          {sizes.map((n, i) => {
            const r = radius(n);
            const cx = x + widths[i] / 2;
            x += widths[i] + gap;
            return (
              <g key={n}>
                <circle cx={cx} cy={maxR * 2 - r} r={r} fill={base} fillOpacity={0.5} stroke="#94a3b8" />
                <text x={cx} y={maxR * 2 + 11} textAnchor="middle" fontSize={10} fill="#64748b">
                  {n}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div>
        <div className="mb-1.5 text-xs text-slate-500">{mixTitle}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-700">
          {tiers.map((x) => (
            <span key={x} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: TIER_COLORS[x] }} />
              {label(x)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
