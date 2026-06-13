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
  TbSun,
  TbMoon,
  TbBriefcase,
  TbMusic,
  TbHeart,
  TbShield,
} from "react-icons/tb";

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

const destinationCards = [
  {
    city: "Bali",
    country: "Indonesia",
    continent: "Asia",
    score: 92,
    tags: ["Affordable", "Fast WiFi", "Community"],
    budget: "$800/mo",
    budgetNum: 800,
    internet: "45 Mbps",
    internetNum: 45,
    visa: "60 days",
    visaNum: 60,
    weather: "27°C avg",
    ranks: { cheapest: 3, "best-wifi": 6, "longest-visa": 4, "best-weather": 2, "best-nightlife": 5, "best-startups": 6, safest: 5, "best-community": 1 },
    gradient: "from-emerald-500/30 to-teal-600/30",
  },
  {
    city: "Lisbon",
    country: "Portugal",
    continent: "Europe",
    score: 89,
    tags: ["EU Access", "Culture", "Nightlife"],
    budget: "$1,800/mo",
    budgetNum: 1800,
    internet: "85 Mbps",
    internetNum: 85,
    visa: "90 days",
    visaNum: 90,
    weather: "18°C avg",
    ranks: { cheapest: 7, "best-wifi": 3, "longest-visa": 2, "best-weather": 5, "best-nightlife": 2, "best-startups": 1, safest: 2, "best-community": 3 },
    gradient: "from-amber-500/30 to-orange-600/30",
  },
  {
    city: "Chiang Mai",
    country: "Thailand",
    continent: "Asia",
    score: 91,
    tags: ["Very Affordable", "Food Scene", "Coworking"],
    budget: "$650/mo",
    budgetNum: 650,
    internet: "35 Mbps",
    internetNum: 35,
    visa: "60 days",
    visaNum: 60,
    weather: "28°C avg",
    ranks: { cheapest: 2, "best-wifi": 7, "longest-visa": 4, "best-weather": 3, "best-nightlife": 4, "best-startups": 5, safest: 4, "best-community": 2 },
    gradient: "from-green-500/30 to-emerald-600/30",
  },
  {
    city: "Dubai",
    country: "UAE",
    continent: "Asia",
    score: 86,
    tags: ["Luxury", "Tax-Free", "Fast WiFi"],
    budget: "$2,500/mo",
    budgetNum: 2500,
    internet: "120 Mbps",
    internetNum: 120,
    visa: "30 days",
    visaNum: 30,
    weather: "33°C avg",
    ranks: { cheapest: 9, "best-wifi": 1, "longest-visa": 7, "best-weather": 7, "best-nightlife": 1, "best-startups": 2, safest: 1, "best-community": 7 },
    gradient: "from-yellow-500/30 to-amber-600/30",
  },
  {
    city: "Budapest",
    country: "Hungary",
    continent: "Europe",
    score: 88,
    tags: ["Affordable EU", "Nightlife", "Thermal Baths"],
    budget: "$1,200/mo",
    budgetNum: 1200,
    internet: "75 Mbps",
    internetNum: 75,
    visa: "90 days",
    visaNum: 90,
    weather: "12°C avg",
    ranks: { cheapest: 5, "best-wifi": 4, "longest-visa": 2, "best-weather": 8, "best-nightlife": 3, "best-startups": 4, safest: 3, "best-community": 5 },
    gradient: "from-cyan-500/30 to-blue-600/30",
  },
  {
    city: "Medellin",
    country: "Colombia",
    continent: "South America",
    score: 87,
    tags: ["Spring Weather", "Affordable", "Community"],
    budget: "$900/mo",
    budgetNum: 900,
    internet: "30 Mbps",
    internetNum: 30,
    visa: "90 days",
    visaNum: 90,
    weather: "22°C avg",
    ranks: { cheapest: 4, "best-wifi": 8, "longest-visa": 2, "best-weather": 1, "best-nightlife": 6, "best-startups": 7, safest: 7, "best-community": 4 },
    gradient: "from-pink-500/30 to-rose-600/30",
  },
  {
    city: "Tbilisi",
    country: "Georgia",
    continent: "Europe",
    score: 85,
    tags: ["Visa-Free", "Budget", "Wine Country"],
    budget: "$700/mo",
    budgetNum: 700,
    internet: "25 Mbps",
    internetNum: 25,
    visa: "365 days",
    visaNum: 365,
    weather: "15°C avg",
    ranks: { cheapest: 1, "best-wifi": 9, "longest-visa": 1, "best-weather": 9, "best-nightlife": 7, "best-startups": 8, safest: 6, "best-community": 6 },
    gradient: "from-violet-500/30 to-purple-600/30",
  },
  {
    city: "Mexico City",
    country: "Mexico",
    continent: "North America",
    score: 84,
    tags: ["Culture", "Food", "Creative"],
    budget: "$1,100/mo",
    budgetNum: 1100,
    internet: "28 Mbps",
    internetNum: 28,
    visa: "180 days",
    visaNum: 180,
    weather: "17°C avg",
    ranks: { cheapest: 6, "best-wifi": 9, "longest-visa": 3, "best-weather": 6, "best-nightlife": 8, "best-startups": 3, safest: 8, "best-community": 8 },
    gradient: "from-red-500/30 to-orange-600/30",
  },
  {
    city: "Auckland",
    country: "New Zealand",
    continent: "Oceania",
    score: 83,
    tags: ["Nature", "Work-Life Balance", "Safe"],
    budget: "$2,200/mo",
    budgetNum: 2200,
    internet: "65 Mbps",
    internetNum: 65,
    visa: "90 days",
    visaNum: 90,
    weather: "16°C avg",
    ranks: { cheapest: 8, "best-wifi": 5, "longest-visa": 2, "best-weather": 4, "best-nightlife": 9, "best-startups": 9, safest: 2, "best-community": 9 },
    gradient: "from-teal-500/30 to-cyan-600/30",
  },
];

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
    let results = [...destinationCards];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (d) =>
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.continent.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by category or custom sort
    if (activeCategory !== "all" && activeCategory !== "score") {
      results.sort((a, b) => (a.ranks[activeCategory] || 99) - (b.ranks[activeCategory] || 99));
    } else if (sortBy === "score") {
      results.sort((a, b) => b.score - a.score);
    } else if (sortBy === "budget-low") {
      results.sort((a, b) => a.budgetNum - b.budgetNum);
    } else if (sortBy === "budget-high") {
      results.sort((a, b) => b.budgetNum - a.budgetNum);
    }

    return results;
  }, [searchQuery, sortBy, selectedOptions, activeCategory]);

  const handleDestinationClick = (destination) => {
    const country = destination.country.toLowerCase();
    const location = destination.city.toLowerCase();
    const continent = destination.continent.toLowerCase();

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
            Showing <span className="text-white font-semibold">{filteredDestinations.length}</span> destinations
            {activeCategory !== "all" && (
              <span className="text-gray-500 ml-1">ranked by {rankingCategories.find(c => c.id === activeCategory)?.label}</span>
            )}
          </p>
        </div>

        {/* ── Destination Grid ── */}
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

        {/* ── Empty state ── */}
        {filteredDestinations.length === 0 && (
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
