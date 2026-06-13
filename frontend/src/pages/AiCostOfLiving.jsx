import React, { useState, useMemo, useCallback } from "react";
import {
  DollarSign,
  Home,
  Wifi,
  Utensils,
  Car,
  Music,
  Heart,
  FileText,
  MoreHorizontal,
  Lightbulb,
  Calculator,
  Globe,
  ChevronDown,
  Search,
  TrendingUp,
  PieChart,
} from "lucide-react";

/* ══════════════════════════════════════════════════════════════════════════
   STATIC DATA — 10 nomad cities with monthly cost breakdown
   ══════════════════════════════════════════════════════════════════════════ */

const costData = [
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    costs: { housing: 450, coworking: 120, food: 300, transport: 50, internet: 25, entertainment: 100, health: 80, visa: 30, misc: 95 },
    tips: ["Eat at local street food stalls to save 60% on food", "Use Grab moto-taxi instead of regular taxis", "Stay in Ari or Ekkamai for cheaper rent with great vibes"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    costs: { housing: 950, coworking: 180, food: 450, transport: 45, internet: 35, entertainment: 150, health: 120, visa: 50, misc: 220 },
    tips: ["Live in Almada for half the rent with river views", "Get a NHR tax regime for potential tax savings", "Use the monthly metro pass for unlimited transport"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    costs: { housing: 500, coworking: 150, food: 250, transport: 80, internet: 30, entertainment: 120, health: 60, visa: 50, misc: 60 },
    tips: ["Rent a villa in Canggu long-term for best value", "Use GoJek for affordable transport and food delivery", "Get a social visa (B211A) for 6-month stays"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "medellin",
    name: "Medellín",
    country: "Colombia",
    flag: "🇨🇴",
    costs: { housing: 550, coworking: 130, food: 280, transport: 40, internet: 25, entertainment: 100, health: 70, visa: 40, misc: 65 },
    tips: ["Stay in Laureles instead of Poblado for cheaper rent", "Use the Metro system - it is clean and affordable", "Eat at corrientazo restaurants for $2-3 meals"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    flag: "🇩🇪",
    costs: { housing: 1100, coworking: 200, food: 500, transport: 86, internet: 35, entertainment: 200, health: 200, visa: 80, misc: 399 },
    tips: ["Apply for the freelance visa for long-term stays", "Shop at Lidl or Aldi for affordable groceries", "Use the BVG monthly ticket for all public transport"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    costs: { housing: 1200, coworking: 200, food: 500, transport: 80, internet: 40, entertainment: 200, health: 150, visa: 60, misc: 270 },
    tips: ["Live in share houses for affordable social living", "Eat at conveyor belt sushi and ramen shops", "Get a JR Pass for affordable train travel"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    costs: { housing: 1050, coworking: 170, food: 420, transport: 50, internet: 35, entertainment: 180, health: 130, visa: 60, misc: 205 },
    tips: ["Consider Gràcia or Poblenou for better value", "Use the T-Casual card for discounted metro rides", "Eat menú del día for affordable lunch deals"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "budapest",
    name: "Budapest",
    country: "Hungary",
    flag: "🇭🇺",
    costs: { housing: 600, coworking: 150, food: 300, transport: 35, internet: 20, entertainment: 120, health: 90, visa: 50, misc: 135 },
    tips: ["Live in District 8 or 9 for affordable central living", "Eat at étkezdekek (local canteens) for cheap meals", "Use Bubi bike sharing for daily commuting"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    costs: { housing: 1500, coworking: 250, food: 600, transport: 100, internet: 80, entertainment: 300, health: 250, visa: 100, misc: 320 },
    tips: ["Consider Sharjah for much cheaper rent nearby", "Use the metro and avoid taxis during peak hours", "Look for happy hour deals at upscale restaurants"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
  {
    id: "chiangmai",
    name: "Chiang Mai",
    country: "Thailand",
    flag: "🇹🇭",
    costs: { housing: 300, coworking: 100, food: 200, transport: 30, internet: 20, entertainment: 80, health: 50, visa: 30, misc: 40 },
    tips: ["Nimman area has the best coworking and cafe scene", "Rent a scooter for affordable daily transport", "Eat at university area food courts for 40 baht meals"],
    currency: { EUR: 0.92, GBP: 0.79 },
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

const COST_KEYS = ["housing", "coworking", "food", "transport", "internet", "entertainment", "health", "visa", "misc"];

const COST_META = {
  housing: { label: "Housing", icon: Home, color: "#06b6d4" },
  coworking: { label: "Coworking", icon: Globe, color: "#8b5cf6" },
  food: { label: "Food", icon: Utensils, color: "#f59e0b" },
  transport: { label: "Transport", icon: Car, color: "#10b981" },
  internet: { label: "Internet", icon: Wifi, color: "#3b82f6" },
  entertainment: { label: "Entertainment", icon: Music, color: "#ec4899" },
  health: { label: "Health Insurance", icon: Heart, color: "#ef4444" },
  visa: { label: "Visa & Permits", icon: FileText, color: "#f97316" },
  misc: { label: "Miscellaneous", icon: MoreHorizontal, color: "#6366f1" },
};

const CURRENCIES = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
};

const VIEW_DIVISORS = { monthly: 1, weekly: 4.33, daily: 30 };

const getCityTotal = (city) => COST_KEYS.reduce((sum, k) => sum + city.costs[k], 0);

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

const AiCostOfLiving = () => {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [viewMode, setViewMode] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sliderValues, setSliderValues] = useState({});

  /* ── Derived state ── */
  const selectedCity = useMemo(
    () => costData.find((c) => c.id === selectedCityId) || null,
    [selectedCityId]
  );

  const convertedAmount = useCallback(
    (usdAmount) => {
      const rate = CURRENCIES[currency]?.rate || 1;
      const divisor = VIEW_DIVISORS[viewMode] || 1;
      return (usdAmount * rate) / divisor;
    },
    [currency, viewMode]
  );

  const formatAmount = useCallback(
    (usdAmount) => {
      const val = convertedAmount(usdAmount);
      const symbol = CURRENCIES[currency]?.symbol || "$";
      return `${symbol}${Math.round(val).toLocaleString()}`;
    },
    [convertedAmount, currency]
  );

  /* Format without viewMode divisor — always shows the "raw" converted amount */
  const formatMonthly = useCallback(
    (usdAmount) => {
      const rate = CURRENCIES[currency]?.rate || 1;
      const symbol = CURRENCIES[currency]?.symbol || "$";
      return `${symbol}${Math.round(usdAmount * rate).toLocaleString()}`;
    },
    [currency]
  );

  /* Adjusted costs: slider multiplies the default (0.5x–2x) */
  const adjustedCosts = useMemo(() => {
    if (!selectedCity) return {};
    const result = {};
    COST_KEYS.forEach((key) => {
      const multiplier = sliderValues[key] ?? 1;
      result[key] = Math.round(selectedCity.costs[key] * multiplier);
    });
    return result;
  }, [selectedCity, sliderValues]);

  const adjustedTotal = useMemo(
    () => COST_KEYS.reduce((sum, k) => sum + (adjustedCosts[k] || 0), 0),
    [adjustedCosts]
  );

  const defaultTotal = useMemo(
    () => (selectedCity ? getCityTotal(selectedCity) : 0),
    [selectedCity]
  );

  /* ── Donut chart data ── */
  const donutSegments = useMemo(() => {
    if (!selectedCity || adjustedTotal === 0) return [];
    let cumulative = 0;
    return COST_KEYS.map((key) => {
      const pct = ((adjustedCosts[key] || 0) / adjustedTotal) * 100;
      const segment = {
        key,
        pct,
        start: cumulative,
        color: COST_META[key].color,
      };
      cumulative += pct;
      return segment;
    });
  }, [selectedCity, adjustedCosts, adjustedTotal]);

  /* ── Filtered cities for dropdown ── */
  const filteredCities = useMemo(
    () =>
      costData.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.country.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  /* ── Handlers ── */
  const handleSelectCity = useCallback((cityId) => {
    setSelectedCityId(cityId);
    setSliderValues({});
    setIsDropdownOpen(false);
    setSearchQuery("");
  }, []);

  const handleSliderChange = useCallback((key, value) => {
    setSliderValues((prev) => ({ ...prev, [key]: parseFloat(value) }));
  }, []);

  const resetSliders = useCallback(() => setSliderValues({}), []);

  /* ── Sort cities by total cost for the card grid ── */
  const sortedCities = useMemo(
    () => [...costData].sort((a, b) => getCityTotal(a) - getCityTotal(b)),
    []
  );

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */

  return (
    <div className="page-container">
      {/* ──────────────── HERO ──────────────── */}
      <section className="section-container py-12 md:py-16 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-muted border border-accent/20 text-accent text-sm font-medium mb-6">
            <Calculator size={16} />
            Cost of Living Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Cost of Living</span>{" "}
            <span className="text-white">Calculator</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Plan your nomad budget with real cost data. Adjust each category to match your lifestyle and see exactly how far your money goes.
          </p>
        </div>

        {/* ── Top Controls: Currency + View Toggle ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Currency selector */}
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400 mr-1">Currency:</span>
            {Object.keys(CURRENCIES).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currency === cur
                    ? "bg-accent text-surface shadow-glow-sm"
                    : "bg-glass border border-glass-border text-gray-300 hover:text-white hover:border-accent/40"
                }`}
              >
                {cur}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-400" />
            {Object.keys(VIEW_DIVISORS).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  viewMode === mode
                    ? "bg-accent text-surface shadow-glow-sm"
                    : "bg-glass border border-glass-border text-gray-300 hover:text-white hover:border-accent/40"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CITY CARDS GRID ──────────────── */}
      <section className="section-container pb-8 animate-slide-up">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe size={20} className="text-accent" />
          Select a City
        </h2>

        {/* Searchable dropdown for mobile / quick pick */}
        <div className="relative mb-6">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full sm:w-80 input-dark flex items-center justify-between gap-2 text-left"
          >
            <span className="flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              {selectedCity ? (
                <>
                  <span>{selectedCity.flag}</span>
                  <span className="text-white">{selectedCity.name}, {selectedCity.country}</span>
                </>
              ) : (
                <span className="text-gray-500">Search city...</span>
              )}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 top-full mt-2 w-full sm:w-80 glass-card p-2 max-h-72 overflow-y-auto animate-slide-down">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full input-dark mb-2 text-sm"
                autoFocus
              />
              {filteredCities.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No cities found</p>
              )}
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    selectedCityId === city.id
                      ? "bg-accent/15 border border-accent/30 text-white"
                      : "hover:bg-glass-hover text-gray-300"
                  }`}
                >
                  <span className="text-xl">{city.flag}</span>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-gray-500 text-sm">, {city.country}</span>
                  <span className="ml-auto text-accent font-semibold text-sm">
                    {formatAmount(getCityTotal(city))}/{viewMode === "daily" ? "day" : viewMode === "weekly" ? "wk" : "mo"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sortedCities.map((city) => {
            const total = getCityTotal(city);
            const isSelected = selectedCityId === city.id;
            return (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city.id)}
                className={`glass-card p-4 text-center transition-all duration-300 hover:scale-[1.03] ${
                  isSelected
                    ? "border-accent/60 shadow-glow-sm bg-accent/10"
                    : "hover:border-accent/30"
                }`}
              >
                <span className="text-2xl block mb-1">{city.flag}</span>
                <p className="text-white font-semibold text-sm">{city.name}</p>
                <p className="text-gray-500 text-xs mb-2">{city.country}</p>
                <p className="text-accent font-bold text-sm">
                  {formatAmount(total)}
                  <span className="text-gray-500 font-normal text-xs">/{viewMode === "daily" ? "day" : viewMode === "weekly" ? "wk" : "mo"}</span>
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ──────────────── DETAILED BREAKDOWN ──────────────── */}
      {selectedCity && (
        <section className="section-container pb-12 animate-fade-in">
          {/* City header */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCity.flag}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCity.name}</h2>
                  <p className="text-gray-400">{selectedCity.country}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Your {viewMode} budget
                </p>
                <p className="text-3xl font-bold text-accent neon-text">
                  {formatAmount(adjustedTotal)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Average: {formatAmount(defaultTotal)}
                </p>
              </div>
            </div>

            {/* Budget comparison bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span>Your budget</span>
                <span>City average</span>
              </div>
              <div className="relative h-3 bg-surface-50 rounded-full overflow-hidden">
                {/* Average marker (the full width = max of either) */}
                <div
                  className="absolute top-0 left-0 h-full bg-accent/20 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((defaultTotal / Math.max(adjustedTotal, defaultTotal)) * 100, 100)}%`,
                  }}
                />
                {/* Your budget bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-neon-cyan rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((adjustedTotal / Math.max(adjustedTotal, defaultTotal)) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs mt-1.5">
                <span className="text-accent font-medium">{formatAmount(adjustedTotal)}</span>
                <span className="text-gray-500">{formatAmount(defaultTotal)}</span>
              </div>
              {adjustedTotal !== defaultTotal && (
                <p className={`text-xs mt-2 font-medium ${adjustedTotal > defaultTotal ? "text-red-400" : "text-emerald-400"}`}>
                  {adjustedTotal > defaultTotal
                    ? `${formatAmount(adjustedTotal - defaultTotal)} above average`
                    : `${formatAmount(defaultTotal - adjustedTotal)} below average`}
                </p>
              )}
            </div>
          </div>

          {/* Main layout: breakdown + donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Cost sliders */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <PieChart size={18} className="text-accent" />
                  Cost Breakdown
                </h3>
                <button onClick={resetSliders} className="btn-ghost text-xs px-3 py-1.5">
                  Reset Sliders
                </button>
              </div>

              {COST_KEYS.map((key) => {
                const meta = COST_META[key];
                const Icon = meta.icon;
                const defaultVal = selectedCity.costs[key];
                const currentVal = adjustedCosts[key];
                const multiplier = sliderValues[key] ?? 1;
                const pct = adjustedTotal > 0 ? ((currentVal / adjustedTotal) * 100).toFixed(1) : 0;

                return (
                  <div key={key} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${meta.color}20` }}
                        >
                          <Icon size={16} style={{ color: meta.color }} />
                        </div>
                        <span className="text-sm font-medium text-white">{meta.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold text-sm">{formatAmount(currentVal)}</span>
                        <span className="text-gray-500 text-xs ml-1.5">({pct}%)</span>
                      </div>
                    </div>

                    {/* Slider row */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-500 w-7 text-right">0.5x</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={multiplier}
                          onChange={(e) => handleSliderChange(key, e.target.value)}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${meta.color} 0%, ${meta.color} ${((multiplier - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.08) ${((multiplier - 0.5) / 1.5) * 100}%, rgba(255,255,255,0.08) 100%)`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 w-7">2x</span>
                      <span className="text-xs text-accent font-mono w-10 text-right">
                        {multiplier.toFixed(1)}x
                      </span>
                    </div>

                    {/* Default reference */}
                    <p className="text-[10px] text-gray-600 mt-1">
                      Default: {formatAmount(defaultVal)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Donut chart + tips */}
            <div className="space-y-6">
              {/* Donut Chart */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4 text-center">Budget Distribution</h3>
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {donutSegments.map((seg) => (
                        <circle
                          key={seg.key}
                          cx="18"
                          cy="18"
                          r="15.91549430918954"
                          fill="transparent"
                          stroke={seg.color}
                          strokeWidth="3"
                          strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                          strokeDashoffset={-seg.start}
                          className="transition-all duration-500"
                        />
                      ))}
                      {/* Inner circle for donut hole */}
                      <circle
                        cx="18"
                        cy="18"
                        r="12.91549430918954"
                        fill="#0f1117"
                        className="transition-all duration-500"
                      />
                    </svg>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-white">{formatAmount(adjustedTotal)}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">/{viewMode}</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-5">
                  {COST_KEYS.map((key) => {
                    const meta = COST_META[key];
                    return (
                      <div key={key} className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span className="text-[11px] text-gray-400 truncate">{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Money-saving Tips */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-400" />
                  Money-Saving Tips
                </h3>
                <div className="space-y-3">
                  {selectedCity.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                    >
                      <span className="text-amber-400 font-bold text-sm mt-0.5 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-gray-300 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick summary card */}
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-accent" />
                  Quick Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Monthly</span>
                    <span className="text-white font-semibold">{formatMonthly(adjustedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Weekly</span>
                    <span className="text-white font-semibold">{formatMonthly(adjustedTotal / 4.33)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Daily</span>
                    <span className="text-white font-semibold">{formatMonthly(adjustedTotal / 30)}</span>
                  </div>
                  <hr className="border-glass-border my-1" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Biggest expense</span>
                    <span className="text-white font-semibold">
                      {COST_META[COST_KEYS.reduce((a, b) => (adjustedCosts[a] >= adjustedCosts[b] ? a : b))].label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">vs City Average</span>
                    <span
                      className={`font-semibold ${
                        adjustedTotal > defaultTotal ? "text-red-400" : adjustedTotal < defaultTotal ? "text-emerald-400" : "text-gray-300"
                      }`}
                    >
                      {adjustedTotal === defaultTotal
                        ? "Same"
                        : `${formatMonthly(Math.abs(adjustedTotal - defaultTotal))} ${adjustedTotal > defaultTotal ? "more" : "less"}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Click-away handler for dropdown ── */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDropdownOpen(false);
            setSearchQuery("");
          }}
        />
      )}
    </div>
  );
};

export default AiCostOfLiving;
