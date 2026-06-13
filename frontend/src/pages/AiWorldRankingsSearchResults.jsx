import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbSearch,
  TbWorld,
  TbWifi,
  TbCoin,
  TbClock,
  TbMapPin,
  TbChevronDown,
  TbSparkles,
  TbArrowRight,
  TbAdjustments,
} from "react-icons/tb";
import { getCities, getVisaInfo } from "../services/supabaseService";

const AI_WORLD_RANKINGS_TYPING_SEEN_KEY = "roamiq-ai-world-rankings-typing-seen-v2";

/* ── Ranking Categories ── */
const rankingCategories = [
  { id: "all", label: "All", emoji: "🌍" },
  { id: "cheapest", label: "Cheapest", emoji: "💰" },
  { id: "best-wifi", label: "Best WiFi", emoji: "📶" },
  { id: "longest-visa", label: "Longest Visa", emoji: "🛂" },
  { id: "best-weather", label: "Best Weather", emoji: "☀️" },
  { id: "best-nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "best-startups", label: "Startups", emoji: "💼" },
  { id: "safest", label: "Safest", emoji: "🛡️" },
  { id: "best-community", label: "Community", emoji: "❤️" },
];

const filters = [
  { id: "budget", label: "Budget", icon: TbCoin },
  { id: "internet", label: "Internet", icon: TbWifi },
  { id: "visa", label: "Visa Duration", icon: TbClock },
  { id: "timezone", label: "Time Zone", icon: TbWorld },
  { id: "continent", label: "Continent", icon: TbMapPin },
];

const filterOptions = {
  budget: ["Under $500/mo", "$500 - $1,000/mo", "$1,000 - $2,000/mo", "$2,000+/mo"],
  internet: ["Under 25 Mbps", "25 - 50 Mbps", "50 - 100 Mbps", "100+ Mbps"],
  visa: ["Up to 30 days", "31 - 90 days", "3 - 6 months", "6+ months"],
  timezone: ["Americas", "Europe/Africa", "Asia", "Oceania"],
  continent: ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"],
};

/* ── Gradient palette ── */
const gradients = [
  "from-emerald-500/30 to-teal-600/30",
  "from-amber-500/30 to-orange-600/30",
  "from-green-500/30 to-emerald-600/30",
  "from-yellow-500/30 to-amber-600/30",
  "from-cyan-500/30 to-blue-600/30",
  "from-pink-500/30 to-rose-600/30",
  "from-violet-500/30 to-purple-600/30",
  "from-red-500/30 to-orange-600/30",
  "from-teal-500/30 to-cyan-600/30",
  "from-indigo-500/30 to-blue-600/30",
  "from-lime-500/30 to-green-600/30",
  "from-fuchsia-500/30 to-pink-600/30",
];

/* ── Auto-generate tags from city data ── */
function generateTags(city) {
  const tags = [];
  const cost = city.costUSD || 0;
  const internet = city.internetMbps || 0;
  const scores = city.scores || {};

  if (cost > 0 && cost <= 800) tags.push("Very Affordable");
  else if (cost > 0 && cost <= 1200) tags.push("Affordable");
  else if (cost > 2000) tags.push("Premium");

  if (internet >= 80) tags.push("Fast WiFi");
  if (scores.safety >= 4) tags.push("Safe");
  if (scores.nightlife >= 4) tags.push("Nightlife");
  if (scores.fun >= 4) tags.push("Fun");
  if (scores.walkability >= 4) tags.push("Walkable");
  if (city.visaDifficulty === "Easy") tags.push("Easy Visa");
  if (city.visaDifficulty === "Hard") tags.push("Strict Visa");
  if (scores.internet >= 4) tags.push("Great Internet");
  if (scores.air >= 4) tags.push("Clean Air");

  // Limit to 3 tags
  return tags.slice(0, 3);
}

/* ── Map city + visa data to destination card format ── */
function mapCityToCard(city, visaMap, index) {
  const budgetNum = city.costUSD || 0;
  const internetNum = city.internetMbps || 0;
  const visaDays = visaMap[city.id] || visaMap[city.name] || 90;
  const avgTemp = city.avgTemp || 0;
  const overallScore = city.scores?.overall || 0;

  // Convert 0-5 scale to 0-100 for display
  const score = overallScore <= 5 ? Math.round(overallScore * 20) : Math.round(overallScore);

  return {
    id: city.id,
    city: city.name,
    country: city.country,
    continent: city.continent || "",
    flag: city.flag || "",
    score,
    tags: city.tags?.length ? city.tags : generateTags(city),
    budget: budgetNum ? `$${budgetNum}/mo` : "N/A",
    budgetNum,
    internet: internetNum ? `${internetNum} Mbps` : "N/A",
    internetNum,
    visa: visaDays ? `${visaDays} days` : "N/A",
    visaNum: visaDays,
    weather: avgTemp ? `${avgTemp}\u00B0C avg` : "N/A",
    weatherNum: avgTemp,
    ranks: {}, // Computed after all cities are loaded
    gradient: gradients[index % gradients.length],
    // Keep raw scores for sorting by category
    rawScores: city.scores || {},
  };
}

/* ── Compute ranks for each category across all destinations ── */
function computeRanks(destinations) {
  const categories = {
    cheapest: (d) => d.budgetNum > 0 ? d.budgetNum : 99999,   // lower = better
    "best-wifi": (d) => -d.internetNum,                         // higher = better
    "longest-visa": (d) => -d.visaNum,                          // higher = better
    "best-weather": (d) => {
      // Ideal temperature around 22°C
      const t = d.weatherNum;
      return t > 0 ? Math.abs(t - 22) : 999;
    },
    "best-nightlife": (d) => -(d.rawScores?.nightlife || 0),
    "best-startups": (d) => -(d.rawScores?.internet || 0),      // Use internet as proxy
    safest: (d) => -(d.rawScores?.safety || 0),
    "best-community": (d) => -(d.rawScores?.fun || 0),          // Use fun as proxy
  };

  const result = destinations.map((d) => ({ ...d, ranks: {} }));

  for (const [cat, sortFn] of Object.entries(categories)) {
    const sorted = [...result].sort((a, b) => sortFn(a) - sortFn(b));
    sorted.forEach((d, i) => {
      const match = result.find((r) => r.id === d.id);
      if (match) match.ranks[cat] = i + 1;
    });
  }

  return result;
}

/* ── Component ── */

const AiWorldRankings = () => {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [typedHeading, setTypedHeading] = useState("");
  const [headingKey, setHeadingKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cities + visa info from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cities, visaData] = await Promise.all([
          getCities(),
          getVisaInfo(),
        ]);

        // Build a lookup map: city_id → tourist_days (and city_name → tourist_days)
        const visaMap = {};
        if (Array.isArray(visaData)) {
          visaData.forEach((v) => {
            if (v.city_id) visaMap[v.city_id] = v.touristDays || 90;
            if (v.country) visaMap[v.country] = v.touristDays || 90;
          });
        }

        // Also match visa info by country name
        const visaByCountry = {};
        if (Array.isArray(visaData)) {
          visaData.forEach((v) => {
            if (v.country) visaByCountry[v.country] = v.touristDays || 90;
          });
        }

        if (cities && cities.length > 0) {
          const cards = cities.map((city, i) => {
            // Try to find visa days by city_id, then by country name
            const visaDays = visaMap[city.id] || visaByCountry[city.country] || 90;
            return mapCityToCard(city, { ...visaMap, [city.id]: visaDays, [city.name]: visaDays, [city.country]: visaDays }, i);
          });
          const ranked = computeRanks(cards);
          console.log(`[WorldRankings] ✅ Loaded ${ranked.length} cities from Supabase`);
          setDestinations(ranked);
        } else {
          console.warn("[WorldRankings] No cities from Supabase, showing empty state");
          setDestinations([]);
        }
      } catch (err) {
        console.error("[WorldRankings] Failed to load data:", err);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const headingText = activeCategory === "all"
    ? "Discover the best destinations ranked for your lifestyle"
    : `Top cities ranked by ${rankingCategories.find(c => c.id === activeCategory)?.label || "category"}`;

  useEffect(() => {
    const hasSeenTyping =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AI_WORLD_RANKINGS_TYPING_SEEN_KEY) === "true";

    if (hasSeenTyping) {
      setTypedHeading(headingText);
      return;
    }
    setTypedHeading("");

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      currentIndex += 1;
      setTypedHeading(headingText.slice(0, currentIndex));
      if (currentIndex >= headingText.length) {
        clearInterval(typingInterval);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(AI_WORLD_RANKINGS_TYPING_SEEN_KEY, "true");
        }
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [headingKey, activeCategory]);

  const handleFilterClick = (filterId) => {
    setActiveFilter((prev) => (prev === filterId ? null : filterId));
  };

  const handleOptionSelect = (filterId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [filterId]: prev[filterId] === option ? undefined : option,
    }));
    setActiveFilter(null);
  };

  const removeFilter = (filterId) => {
    setSelectedOptions((prev) => {
      const next = { ...prev };
      delete next[filterId];
      return next;
    });
  };

  const filteredDestinations = useMemo(() => {
    let results = [...destinations];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (d) =>
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          (d.continent || "").toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Budget filter
    if (selectedOptions.budget) {
      const b = selectedOptions.budget;
      if (b === "Under $500/mo") results = results.filter((d) => d.budgetNum > 0 && d.budgetNum < 500);
      else if (b === "$500 - $1,000/mo") results = results.filter((d) => d.budgetNum >= 500 && d.budgetNum <= 1000);
      else if (b === "$1,000 - $2,000/mo") results = results.filter((d) => d.budgetNum >= 1000 && d.budgetNum <= 2000);
      else if (b === "$2,000+/mo") results = results.filter((d) => d.budgetNum >= 2000);
    }

    // Internet filter
    if (selectedOptions.internet) {
      const opt = selectedOptions.internet;
      if (opt === "Under 25 Mbps") results = results.filter((d) => d.internetNum > 0 && d.internetNum < 25);
      else if (opt === "25 - 50 Mbps") results = results.filter((d) => d.internetNum >= 25 && d.internetNum <= 50);
      else if (opt === "50 - 100 Mbps") results = results.filter((d) => d.internetNum >= 50 && d.internetNum <= 100);
      else if (opt === "100+ Mbps") results = results.filter((d) => d.internetNum >= 100);
    }

    // Visa filter
    if (selectedOptions.visa) {
      const opt = selectedOptions.visa;
      if (opt === "Up to 30 days") results = results.filter((d) => d.visaNum > 0 && d.visaNum <= 30);
      else if (opt === "31 - 90 days") results = results.filter((d) => d.visaNum >= 31 && d.visaNum <= 90);
      else if (opt === "3 - 6 months") results = results.filter((d) => d.visaNum >= 90 && d.visaNum <= 180);
      else if (opt === "6+ months") results = results.filter((d) => d.visaNum >= 180);
    }

    // Continent filter
    if (selectedOptions.continent) {
      results = results.filter((d) => d.continent === selectedOptions.continent);
    }

    // Sort by category or custom sort
    if (activeCategory !== "all") {
      results.sort((a, b) => (a.ranks[activeCategory] || 99) - (b.ranks[activeCategory] || 99));
    } else if (sortBy === "score") {
      results.sort((a, b) => b.score - a.score);
    } else if (sortBy === "budget-low") {
      results.sort((a, b) => a.budgetNum - b.budgetNum);
    } else if (sortBy === "budget-high") {
      results.sort((a, b) => b.budgetNum - a.budgetNum);
    }

    return results;
  }, [destinations, searchQuery, sortBy, selectedOptions, activeCategory]);

  const handleDestinationClick = (destination) => {
    const country = destination.country.toLowerCase();
    const location = destination.city.toLowerCase();
    const continent = (destination.continent || "").toLowerCase();

    navigate(
      `/ai-verticals?country=${encodeURIComponent(country)}&state=${encodeURIComponent(location)}`,
      {
        state: {
          breadcrumbFilters: { continent, country, location },
        },
      }
    );
  };

  const activeFilterCount = Object.values(selectedOptions).filter(Boolean).length;

  return (
    <div className="min-h-full bg-surface animate-fade-in">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* ── Back + Search Bar ── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <TbArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <div className="flex-1 relative">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, countries..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-50 border border-glass-border text-gray-200 placeholder-gray-500 text-sm outline-none focus:border-accent/50 focus:shadow-glow-sm transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="hidden sm:flex items-center gap-2">
            <TbAdjustments className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-50 border border-glass-border rounded-xl px-3 py-3 text-sm text-gray-300 outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="score">Top Rated</option>
              <option value="budget-low">Budget: Low → High</option>
              <option value="budget-high">Budget: High → Low</option>
            </select>
          </div>
        </div>

        {/* ── Heading with typing effect ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TbSparkles className="w-5 h-5 text-accent" />
            <span className="text-accent text-xs font-semibold tracking-widest uppercase">AI-Powered Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {typedHeading}
            {typedHeading.length < headingText.length && (
              <span className="inline-block w-[3px] h-[0.8em] bg-accent ml-1 align-middle animate-typing" />
            )}
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-2xl">
            Curated rankings based on budget, internet speed, visa policies, community, and quality of life.
          </p>
        </div>

        {/* ── Ranking Categories ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {rankingCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-accent/20 border border-accent/40 text-accent"
                  : "bg-surface-50/50 border border-glass-border text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Filter Chips ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            const hasSelection = selectedOptions[filter.id];

            return (
              <div key={filter.id} className="relative">
                <button
                  onClick={() => handleFilterClick(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    hasSelection
                      ? "bg-accent/20 border border-accent/40 text-accent"
                      : isActive
                      ? "bg-surface-50 border border-glass-border text-white"
                      : "bg-surface-50/50 border border-glass-border text-gray-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {filter.label}
                  {hasSelection && (
                    <span className="ml-1 text-xs opacity-80">: {selectedOptions[filter.id]}</span>
                  )}
                  <TbChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {isActive && (
                  <div className="absolute top-full left-0 z-50 mt-2 w-56 glass-card p-2 animate-fade-in">
                    {filterOptions[filter.id].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleOptionSelect(filter.id, option)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          selectedOptions[filter.id] === option
                            ? "bg-accent/20 text-accent"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Active Filter Tags ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-500">Active filters:</span>
            {Object.entries(selectedOptions).map(([filterId, option]) => {
              if (!option) return null;
              return (
                <span
                  key={filterId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium"
                >
                  {option}
                  <button
                    onClick={() => removeFilter(filterId)}
                    className="hover:text-white transition-colors"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
            <button
              onClick={() => setSelectedOptions({})}
              className="text-xs text-gray-500 hover:text-white transition-colors ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            {loading ? (
              "Loading destinations..."
            ) : (
              <>
                Showing <span className="text-white font-semibold">{filteredDestinations.length}</span> destinations
                {activeCategory !== "all" && (
                  <span className="text-gray-500 ml-1">ranked by {rankingCategories.find(c => c.id === activeCategory)?.label}</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-400 text-sm">Loading rankings...</span>
          </div>
        )}

        {/* ── Destination Grid ── */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredDestinations.map((destination, index) => {
              const categoryRank = activeCategory !== "all" ? destination.ranks[activeCategory] : null;
              const isTop3 = categoryRank && categoryRank <= 3;

              return (
                <button
                  key={`${destination.city}-${destination.country}`}
                  onClick={() => handleDestinationClick(destination)}
                  className={`glass-card-hover overflow-hidden text-left group cursor-pointer ${isTop3 ? "ring-1 ring-accent/30" : ""}`}
                >
                  {/* Score badge + gradient header */}
                  <div className={`relative h-36 bg-gradient-to-br ${destination.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-surface/40" />

                    {/* Rank badge for category */}
                    {categoryRank && categoryRank <= 3 && (
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-surface font-bold text-sm">#{categoryRank}</span>
                      </div>
                    )}

                    {/* Score circle */}
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-surface/80 backdrop-blur-sm border border-glass-border flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-accent font-bold text-sm leading-none">{destination.score}</span>
                        <span className="block text-[8px] text-gray-400 mt-0.5">SCORE</span>
                      </div>
                    </div>

                    {/* City/Country overlay */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white font-bold text-xl drop-shadow-lg">{destination.city}</h3>
                      <p className="text-white/70 text-sm font-medium">{destination.country}</p>
                    </div>

                    {/* Hover shine */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                  </div>

                  {/* Info section */}
                  <div className="p-4 space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {destination.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <TbCoin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="text-gray-300 truncate">{destination.budget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TbWifi className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="text-gray-300 truncate">{destination.internet}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TbClock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        <span className="text-gray-300 truncate">{destination.visa}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-2 transition-all duration-200 pt-1">
                      Explore destination <TbArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filteredDestinations.length === 0 && (
          <div className="text-center py-16">
            <TbWorld className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-300 text-lg font-medium mb-2">No destinations found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedOptions({}); setActiveCategory("all"); }}
              className="btn-primary text-sm py-2 px-6"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiWorldRankings;
