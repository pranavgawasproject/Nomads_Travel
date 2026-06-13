import React, { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Crown,
  Globe,
  Wifi,
  Shield,
  PartyPopper,
  Thermometer,
  Footprints,
  Moon,
  Wind,
  DollarSign,
  Trophy,
  Search,
  ChevronDown,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Static city data (12 cities, all metrics)
   ────────────────────────────────────────────── */
const cities = [
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    flag: "\u{1F1F9}\u{1F1ED}",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
    scores: {
      overall: 4.2,
      cost: 3.8,
      internet: 3.5,
      safety: 3.2,
      fun: 4.8,
      walkability: 3.0,
      nightlife: 4.7,
      air: 2.8,
    },
    costUSD: 950,
    internetMbps: 45,
    avgTemp: 28,
    visaDifficulty: "Easy",
    airQuality: "Moderate",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "\u{1F1F5}\u{1F1F9}",
    image:
      "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800",
    scores: {
      overall: 4.5,
      cost: 3.2,
      internet: 4.0,
      safety: 4.2,
      fun: 4.3,
      walkability: 4.0,
      nightlife: 4.0,
      air: 4.2,
    },
    costUSD: 2200,
    internetMbps: 85,
    avgTemp: 18,
    visaDifficulty: "Medium",
    airQuality: "Good",
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "\u{1F1EE}\u{1F1E9}",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
    scores: {
      overall: 4.0,
      cost: 4.2,
      internet: 2.8,
      safety: 3.5,
      fun: 4.5,
      walkability: 2.5,
      nightlife: 3.8,
      air: 3.0,
    },
    costUSD: 1100,
    internetMbps: 25,
    avgTemp: 27,
    visaDifficulty: "Easy",
    airQuality: "Moderate",
  },
  {
    id: "medellin",
    name: "Medell\u00EDn",
    country: "Colombia",
    flag: "\u{1F1E8}\u{1F1F4}",
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800",
    scores: {
      overall: 3.9,
      cost: 4.0,
      internet: 3.2,
      safety: 2.8,
      fun: 4.5,
      walkability: 3.5,
      nightlife: 4.5,
      air: 3.5,
    },
    costUSD: 1200,
    internetMbps: 35,
    avgTemp: 22,
    visaDifficulty: "Easy",
    airQuality: "Moderate",
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800",
    scores: {
      overall: 4.3,
      cost: 2.5,
      internet: 4.5,
      safety: 4.0,
      fun: 4.2,
      walkability: 4.5,
      nightlife: 4.8,
      air: 3.8,
    },
    costUSD: 2800,
    internetMbps: 100,
    avgTemp: 10,
    visaDifficulty: "Hard",
    airQuality: "Good",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "\u{1F1EF}\u{1F1F5}",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    scores: {
      overall: 4.4,
      cost: 2.0,
      internet: 4.8,
      safety: 4.8,
      fun: 4.5,
      walkability: 4.8,
      nightlife: 4.2,
      air: 3.5,
    },
    costUSD: 3200,
    internetMbps: 150,
    avgTemp: 16,
    visaDifficulty: "Medium",
    airQuality: "Moderate",
  },
  {
    id: "chiangmai",
    name: "Chiang Mai",
    country: "Thailand",
    flag: "\u{1F1F9}\u{1F1ED}",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
    scores: {
      overall: 4.1,
      cost: 4.5,
      internet: 3.2,
      safety: 3.5,
      fun: 3.8,
      walkability: 2.8,
      nightlife: 3.5,
      air: 2.5,
    },
    costUSD: 750,
    internetMbps: 30,
    avgTemp: 26,
    visaDifficulty: "Easy",
    airQuality: "Poor",
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "\u{1F1EA}\u{1F1F8}",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800",
    scores: {
      overall: 4.3,
      cost: 2.8,
      internet: 4.0,
      safety: 3.8,
      fun: 4.7,
      walkability: 4.5,
      nightlife: 4.5,
      air: 4.0,
    },
    costUSD: 2500,
    internetMbps: 80,
    avgTemp: 17,
    visaDifficulty: "Medium",
    airQuality: "Good",
  },
  {
    id: "mexicocity",
    name: "Mexico City",
    country: "Mexico",
    flag: "\u{1F1F2}\u{1F1FD}",
    image:
      "https://images.unsplash.com/photo-1516482362041-8b87b69ed28d?w=800",
    scores: {
      overall: 3.7,
      cost: 3.8,
      internet: 3.0,
      safety: 2.5,
      fun: 4.3,
      walkability: 3.2,
      nightlife: 4.5,
      air: 2.2,
    },
    costUSD: 1300,
    internetMbps: 28,
    avgTemp: 17,
    visaDifficulty: "Easy",
    airQuality: "Poor",
  },
  {
    id: "budapest",
    name: "Budapest",
    country: "Hungary",
    flag: "\u{1F1ED}\u{1F1FA}",
    image:
      "https://images.unsplash.com/photo-1551867633-194f125bddfa?w=800",
    scores: {
      overall: 4.2,
      cost: 3.5,
      internet: 4.2,
      safety: 4.0,
      fun: 4.0,
      walkability: 4.0,
      nightlife: 4.3,
      air: 3.5,
    },
    costUSD: 1600,
    internetMbps: 90,
    avgTemp: 12,
    visaDifficulty: "Medium",
    airQuality: "Moderate",
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    flag: "\u{1F1E6}\u{1F1EA}",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    scores: {
      overall: 3.8,
      cost: 1.8,
      internet: 4.5,
      safety: 4.8,
      fun: 3.8,
      walkability: 2.5,
      nightlife: 3.5,
      air: 2.0,
    },
    costUSD: 3500,
    internetMbps: 120,
    avgTemp: 33,
    visaDifficulty: "Easy",
    airQuality: "Poor",
  },
  {
    id: "tbilisi",
    name: "Tbilisi",
    country: "Georgia",
    flag: "\u{1F1EC}\u{1F1EA}",
    image:
      "https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=800",
    scores: {
      overall: 3.9,
      cost: 4.5,
      internet: 3.0,
      safety: 4.0,
      fun: 3.5,
      walkability: 3.5,
      nightlife: 3.8,
      air: 3.8,
    },
    costUSD: 900,
    internetMbps: 25,
    avgTemp: 15,
    visaDifficulty: "Easy",
    airQuality: "Good",
  },
];

/* ──────────────────────────────────────────────
   Metric definitions
   ────────────────────────────────────────────── */
const metrics = [
  {
    key: "overall",
    label: "Overall Score",
    icon: Globe,
    type: "score",
    scoreKey: "overall",
  },
  {
    key: "cost",
    label: "Cost of Living",
    icon: DollarSign,
    type: "cost",
    scoreKey: "cost",
    getValue: (c) => c.costUSD,
    formatVal: (v) => `$${v.toLocaleString()}/mo`,
    invertBar: true, // lower cost is "better"
  },
  {
    key: "internet",
    label: "Internet Speed",
    icon: Wifi,
    type: "speed",
    scoreKey: "internet",
    getValue: (c) => c.internetMbps,
    formatVal: (v) => `${v} Mbps`,
  },
  {
    key: "safety",
    label: "Safety",
    icon: Shield,
    type: "score",
    scoreKey: "safety",
  },
  {
    key: "fun",
    label: "Fun / Entertainment",
    icon: PartyPopper,
    type: "score",
    scoreKey: "fun",
  },
  {
    key: "walkability",
    label: "Walkability",
    icon: Footprints,
    type: "score",
    scoreKey: "walkability",
  },
  {
    key: "nightlife",
    label: "Nightlife",
    icon: Moon,
    type: "score",
    scoreKey: "nightlife",
  },
  {
    key: "air",
    label: "Air Quality",
    icon: Wind,
    type: "score",
    scoreKey: "air",
  },
];

/* ──────────────────────────────────────────────
   Helper: colour for a numeric score
   ────────────────────────────────────────────── */
const scoreColor = (v) => {
  if (v >= 4) return "text-emerald-400";
  if (v >= 3) return "text-amber-400";
  return "text-red-400";
};

const scoreBg = (v) => {
  if (v >= 4) return "bg-emerald-400/15 border-emerald-400/30";
  if (v >= 3) return "bg-amber-400/15 border-amber-400/30";
  return "bg-red-400/15 border-red-400/30";
};

const visaColor = (d) => {
  if (d === "Easy") return "text-emerald-400 bg-emerald-400/15 border-emerald-400/30";
  if (d === "Medium") return "text-amber-400 bg-amber-400/15 border-amber-400/30";
  return "text-red-400 bg-red-400/15 border-red-400/30";
};

const airColor = (q) => {
  if (q === "Good") return "text-emerald-400 bg-emerald-400/15 border-emerald-400/30";
  if (q === "Moderate") return "text-amber-400 bg-amber-400/15 border-amber-400/30";
  return "text-red-400 bg-red-400/15 border-red-400/30";
};

/* ──────────────────────────────────────────────
   Star visualization
   ────────────────────────────────────────────── */
const StarRow = ({ value, max = 5 }) => {
  const full = Math.floor(value);
  const partial = value - full;
  const empty = max - full - (partial > 0 ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={`f${i}`}
          className="w-4 h-4 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.384c-.784-.57-.381-1.81.587-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
        </svg>
      ))}
      {partial > 0 && (
        <svg
          className="w-4 h-4 text-amber-400"
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id={`pg${partial.toFixed(1).replace(".", "")}`}>
              <stop offset={`${partial * 100}%`} stopColor="currentColor" />
              <stop offset={`${partial * 100}%`} stopColor="#374151" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#pg${partial.toFixed(1).replace(".", "")})`}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.384c-.784-.57-.381-1.81.587-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z"
          />
        </svg>
      )}
      {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
        <svg
          key={`e${i}`}
          className="w-4 h-4 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 00-.363-1.118L2.063 9.384c-.784-.57-.381-1.81.587-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
        </svg>
      ))}
    </span>
  );
};

/* ──────────────────────────────────────────────
   Searchable Dropdown (inline component)
   ────────────────────────────────────────────── */
const CityDropdown = ({ label, cities, selected, onSelect, otherCityId }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return cities.filter(
      (c) =>
        c.id !== otherCityId &&
        (c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q))
    );
  }, [cities, search, otherCityId]);

  const selectedCity = cities.find((c) => c.id === selected);

  return (
    <div className="relative flex-1 min-w-0">
      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="w-full glass-card hover:bg-glass-hover flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 text-left"
      >
        {selectedCity ? (
          <>
            <span className="text-xl shrink-0">{selectedCity.flag}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {selectedCity.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {selectedCity.country}
              </div>
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-500">Select a city...</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full glass-card shadow-glass overflow-hidden animate-slide-down">
          {/* Search input */}
          <div className="p-3 border-b border-glass-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search cities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full input-dark !pl-9 !py-2 text-sm"
              />
            </div>
          </div>

          {/* City list */}
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No cities found
              </div>
            ) : (
              filtered.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    onSelect(city.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-accent/10 ${
                    city.id === selected
                      ? "bg-accent/15 border-l-2 border-accent"
                      : ""
                  }`}
                >
                  <span className="text-lg">{city.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {city.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {city.country}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0">
                    {city.scores.overall.toFixed(1)}{" "}
                    <span className="text-amber-400">★</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────
   Comparison Bar (two segments, left=accent, right=purple)
   ────────────────────────────────────────────── */
const ComparisonBar = ({ valueA, valueB, maxVal, invert = false }) => {
  const pctA = Math.min((valueA / maxVal) * 100, 100);
  const pctB = Math.min((valueB / maxVal) * 100, 100);

  // For inverted metrics (cost), lower is better, so we flip the bar logic visually
  const displayPctA = invert ? ((maxVal - valueA) / maxVal) * 100 : pctA;
  const displayPctB = invert ? ((maxVal - valueB) / maxVal) * 100 : pctB;

  return (
    <div className="flex flex-col gap-1.5">
      {/* City A bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-surface-50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(displayPctA, 2)}%` }}
          />
        </div>
      </div>
      {/* City B bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-surface-50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700 ease-out"
            style={{ width: `${Math.max(displayPctB, 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Winner Badge
   ────────────────────────────────────────────── */
const WinnerBadge = () => (
  <span className="inline-flex items-center gap-0.5 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
    <Crown className="w-3 h-3" />
    <span>W</span>
  </span>
);

/* ──────────────────────────────────────────────
   Main Component
   ────────────────────────────────────────────── */
const AiCompare = () => {
  const [cityAId, setCityAId] = useState("bangkok");
  const [cityBId, setCityBId] = useState("lisbon");

  const cityA = useMemo(() => cities.find((c) => c.id === cityAId), [cityAId]);
  const cityB = useMemo(() => cities.find((c) => c.id === cityBId), [cityBId]);

  // Compute winners per metric
  const verdict = useMemo(() => {
    if (!cityA || !cityB) return null;
    let winsA = 0;
    let winsB = 0;
    let ties = 0;

    metrics.forEach((m) => {
      const vA = m.scoreKey ? cityA.scores[m.scoreKey] : 0;
      const vB = m.scoreKey ? cityB.scores[m.scoreKey] : 0;
      if (m.invertBar) {
        if (vA > vB) winsA++;
        else if (vB > vA) winsB++;
        else ties++;
      } else {
        if (vA > vB) winsA++;
        else if (vB > vA) winsB++;
        else ties++;
      }
    });

    // Also count visa & air quality as tiebreakers
    const visaRank = { Easy: 3, Medium: 2, Hard: 1 };
    if (visaRank[cityA.visaDifficulty] > visaRank[cityB.visaDifficulty])
      winsA++;
    else if (visaRank[cityB.visaDifficulty] > visaRank[cityA.visaDifficulty])
      winsB++;
    else ties++;

    const airRank = { Good: 3, Moderate: 2, Poor: 1 };
    if (airRank[cityA.airQuality] > airRank[cityB.airQuality]) winsA++;
    else if (airRank[cityB.airQuality] > airRank[cityA.airQuality]) winsB++;
    else ties++;

    return { winsA, winsB, ties };
  }, [cityA, cityB]);

  const overallWinner = useMemo(() => {
    if (!verdict) return null;
    if (verdict.winsA > verdict.winsB) return cityA;
    if (verdict.winsB > verdict.winsA) return cityB;
    // Tiebreak by overall score
    if (cityA.scores.overall >= cityB.scores.overall) return cityA;
    return cityB;
  }, [verdict, cityA, cityB]);

  // Determine the winner for a specific score-based metric
  const metricWinner = (scoreKey, invert = false) => {
    if (!cityA || !cityB) return null;
    const vA = cityA.scores[scoreKey];
    const vB = cityB.scores[scoreKey];
    if (invert) {
      if (vA > vB) return "A";
      if (vB > vA) return "B";
      return "tie";
    }
    if (vA > vB) return "A";
    if (vB > vA) return "B";
    return "tie";
  };

  if (!cityA || !cityB) return null;

  return (
    <div className="page-container bg-surface animate-fade-in">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial opacity-40 blur-3xl" />
        </div>

        <div className="section-container relative py-12 md:py-16 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              City Comparison Tool
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Compare Cities</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Find your perfect destination by comparing cities side-by-side
              across cost, internet, safety, nightlife &amp; more.
            </p>
          </div>
        </div>
      </section>

      {/* ── City Selectors ── */}
      <section className="section-container pb-8">
        <div className="glass-card p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 md:gap-6">
            {/* City A */}
            <CityDropdown
              label="City A"
              cities={cities}
              selected={cityAId}
              onSelect={setCityAId}
              otherCityId={cityBId}
            />

            {/* VS badge */}
            <div className="flex items-center justify-center shrink-0 md:pb-1">
              <div className="w-12 h-12 rounded-full bg-surface-50 border border-glass-border flex items-center justify-center">
                <span className="text-xs font-bold text-accent neon-text">
                  VS
                </span>
              </div>
            </div>

            {/* City B */}
            <CityDropdown
              label="City B"
              cities={cities}
              selected={cityBId}
              onSelect={setCityBId}
              otherCityId={cityAId}
            />
          </div>
        </div>
      </section>

      {/* ── City Header Cards ── */}
      <section className="section-container pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* City A Card */}
          <div className="glass-card-hover overflow-hidden group">
            <div className="relative h-36 sm:h-44 overflow-hidden">
              <img
                src={cityA.image}
                alt={cityA.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cityA.flag}</span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        {cityA.name}
                      </h2>
                      <p className="text-xs text-gray-400">{cityA.country}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <StarRow value={cityA.scores.overall} />
                  <span
                    className={`text-sm font-bold mt-0.5 ${scoreColor(
                      cityA.scores.overall
                    )}`}
                  >
                    {cityA.scores.overall.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-px bg-glass-border">
              <div className="bg-surface-50 p-3 text-center">
                <DollarSign className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                <div className="text-xs text-gray-400">Cost</div>
                <div className="text-sm font-semibold text-white">
                  ${cityA.costUSD.toLocaleString()}
                </div>
              </div>
              <div className="bg-surface-50 p-3 text-center">
                <Wifi className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                <div className="text-xs text-gray-400">Internet</div>
                <div className="text-sm font-semibold text-white">
                  {cityA.internetMbps} Mbps
                </div>
              </div>
              <div className="bg-surface-50 p-3 text-center">
                <Thermometer className="w-3.5 h-3.5 text-accent mx-auto mb-1" />
                <div className="text-xs text-gray-400">Temp</div>
                <div className="text-sm font-semibold text-white">
                  {cityA.avgTemp}°C
                </div>
              </div>
            </div>
          </div>

          {/* City B Card */}
          <div className="glass-card-hover overflow-hidden group">
            <div className="relative h-36 sm:h-44 overflow-hidden">
              <img
                src={cityB.image}
                alt={cityB.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cityB.flag}</span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">
                        {cityB.name}
                      </h2>
                      <p className="text-xs text-gray-400">{cityB.country}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <StarRow value={cityB.scores.overall} />
                  <span
                    className={`text-sm font-bold mt-0.5 ${scoreColor(
                      cityB.scores.overall
                    )}`}
                  >
                    {cityB.scores.overall.toFixed(1)} / 5
                  </span>
                </div>
              </div>
            </div>
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-px bg-glass-border">
              <div className="bg-surface-50 p-3 text-center">
                <DollarSign className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Cost</div>
                <div className="text-sm font-semibold text-white">
                  ${cityB.costUSD.toLocaleString()}
                </div>
              </div>
              <div className="bg-surface-50 p-3 text-center">
                <Wifi className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Internet</div>
                <div className="text-sm font-semibold text-white">
                  {cityB.internetMbps} Mbps
                </div>
              </div>
              <div className="bg-surface-50 p-3 text-center">
                <Thermometer className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Temp</div>
                <div className="text-sm font-semibold text-white">
                  {cityB.avgTemp}°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detailed Comparison Table ── */}
      <section className="section-container pb-8">
        <div className="glass-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_1fr] bg-surface-50 border-b border-glass-border">
            <div className="hidden md:block p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Metric
            </div>
            <div className="hidden md:block p-4 text-xs font-semibold text-accent uppercase tracking-wider text-center">
              {cityA.flag} {cityA.name}
            </div>
            <div className="hidden md:block p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20">
              Bar
            </div>
            <div className="hidden md:block p-4 text-xs font-semibold text-purple-400 uppercase tracking-wider text-center">
              {cityB.flag} {cityB.name}
            </div>
          </div>

          {/* Metric Rows */}
          <div className="divide-y divide-glass-border">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              const sA = cityA.scores[m.scoreKey];
              const sB = cityB.scores[m.scoreKey];
              const winner = metricWinner(m.scoreKey, m.invertBar);
              const maxScore = 5;

              // For cost metric, also show dollar value
              const valA =
                m.getValue ? m.getValue(cityA) : sA;
              const valB =
                m.getValue ? m.getValue(cityB) : sB;

              return (
                <div
                  key={m.key}
                  className={`grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_1fr] items-center group hover:bg-glass/50 transition-colors duration-150 ${
                    idx === 0 ? "bg-accent/5" : ""
                  }`}
                >
                  {/* Metric name (mobile: shown as header; desktop: left column) */}
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {m.label}
                    </span>
                  </div>

                  {/* City A value */}
                  <div className="px-4 pb-2 md:p-4 md:pb-4 flex items-center justify-between md:justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden text-xs text-accent font-medium">
                        {cityA.flag}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-bold ${scoreBg(
                          sA
                        )} ${scoreColor(sA)}`}
                      >
                        {m.getValue
                          ? m.formatVal(valA)
                          : sA.toFixed(1)}
                        {winner === "A" && <WinnerBadge />}
                      </span>
                    </div>
                    {/* Mobile: City B inline */}
                    <div className="flex items-center gap-2 md:hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-bold ${scoreBg(
                          sB
                        )} ${scoreColor(sB)}`}
                      >
                        {m.getValue
                          ? m.formatVal(valB)
                          : sB.toFixed(1)}
                        {winner === "B" && <WinnerBadge />}
                      </span>
                      <span className="text-xs text-purple-400 font-medium">
                        {cityB.flag}
                      </span>
                    </div>
                  </div>

                  {/* Comparison bar (desktop only) */}
                  <div className="hidden md:block p-4 w-40 lg:w-52">
                    <ComparisonBar
                      valueA={m.invertBar ? (maxScore - sA) : sA}
                      valueB={m.invertBar ? (maxScore - sB) : sB}
                      maxVal={maxScore}
                    />
                  </div>

                  {/* City B value (desktop only) */}
                  <div className="hidden md:flex p-4 items-center justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-sm font-bold ${scoreBg(
                        sB
                      )} ${scoreColor(sB)}`}
                    >
                      {m.getValue
                        ? m.formatVal(valB)
                        : sB.toFixed(1)}
                      {winner === "B" && <WinnerBadge />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Extra Info: Visa & Air Quality ── */}
      <section className="section-container pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Visa Difficulty */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Visa Difficulty
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-50">
                <span className="text-xl">{cityA.flag}</span>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${visaColor(
                    cityA.visaDifficulty
                  )}`}
                >
                  {cityA.visaDifficulty}
                </span>
                {(() => {
                  const vr = { Easy: 3, Medium: 2, Hard: 1 };
                  const vb = { Easy: 3, Medium: 2, Hard: 1 };
                  return vr[cityA.visaDifficulty] >
                    vb[cityB.visaDifficulty] ? (
                    <WinnerBadge />
                  ) : null;
                })()}
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-50">
                <span className="text-xl">{cityB.flag}</span>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${visaColor(
                    cityB.visaDifficulty
                  )}`}
                >
                  {cityB.visaDifficulty}
                </span>
                {(() => {
                  const vr = { Easy: 3, Medium: 2, Hard: 1 };
                  const vb = { Easy: 3, Medium: 2, Hard: 1 };
                  return vb[cityB.visaDifficulty] >
                    vr[cityA.visaDifficulty] ? (
                    <WinnerBadge />
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          {/* Air Quality */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wind className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Air Quality
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-50">
                <span className="text-xl">{cityA.flag}</span>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${airColor(
                    cityA.airQuality
                  )}`}
                >
                  {cityA.airQuality}
                </span>
                {(() => {
                  const ar = { Good: 3, Moderate: 2, Poor: 1 };
                  const ab = { Good: 3, Moderate: 2, Poor: 1 };
                  return ar[cityA.airQuality] > ab[cityB.airQuality] ? (
                    <WinnerBadge />
                  ) : null;
                })()}
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface-50">
                <span className="text-xl">{cityB.flag}</span>
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-bold ${airColor(
                    cityB.airQuality
                  )}`}
                >
                  {cityB.airQuality}
                </span>
                {(() => {
                  const ar = { Good: 3, Moderate: 2, Poor: 1 };
                  const ab = { Good: 3, Moderate: 2, Poor: 1 };
                  return ab[cityB.airQuality] > ar[cityA.airQuality] ? (
                    <WinnerBadge />
                  ) : null;
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overall Verdict ── */}
      <section className="section-container pb-16">
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative glow behind trophy */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
              <Trophy className="w-7 h-7 text-accent" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">
              Overall Verdict
            </h2>
            <p className="text-sm text-gray-400 mb-6 max-w-md">
              Based on {metrics.length + 2} categories compared, here&apos;s how
              the cities stack up.
            </p>

            {/* Score tally */}
            <div className="flex items-center gap-6 sm:gap-10 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl">{cityA.flag}</span>
                <span className="text-3xl sm:text-4xl font-bold text-accent mt-1">
                  {verdict?.winsA ?? 0}
                </span>
                <span className="text-xs text-gray-500 mt-1">wins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl text-gray-500">=</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-500 mt-1">
                  {verdict?.ties ?? 0}
                </span>
                <span className="text-xs text-gray-500 mt-1">ties</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl">{cityB.flag}</span>
                <span className="text-3xl sm:text-4xl font-bold text-purple-400 mt-1">
                  {verdict?.winsB ?? 0}
                </span>
                <span className="text-xs text-gray-500 mt-1">wins</span>
              </div>
            </div>

            {/* Winner announcement */}
            {overallWinner && (
              <div className="w-full max-w-lg">
                <div
                  className={`p-5 rounded-2xl border ${
                    overallWinner.id === cityAId
                      ? "bg-accent/10 border-accent/30"
                      : "bg-purple-500/10 border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="text-lg sm:text-xl font-bold text-white">
                      {overallWinner.flag} {overallWinner.name} wins!
                    </span>
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-sm text-gray-400">
                    {overallWinner.id === cityAId
                      ? `${cityA.name} outperforms ${cityB.name} in ${verdict?.winsA} out of ${metrics.length + 2} categories, making it the better choice for digital nomads.`
                      : `${cityB.name} outperforms ${cityA.name} in ${verdict?.winsB} out of ${metrics.length + 2} categories, making it the better choice for digital nomads.`}
                  </p>
                </div>

                {/* Quick swap */}
                <button
                  type="button"
                  onClick={() => {
                    setCityAId(cityBId);
                    setCityBId(cityAId);
                  }}
                  className="mt-4 inline-flex items-center gap-2 btn-ghost text-xs !py-2 !px-4"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Swap cities
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiCompare;
