import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  TbHeart,
  TbHeartFilled,
  TbShield,
  TbFilter,
  TbSortAscending,
  TbX,
  TbStarFilled,
  TbPlane,
  TbHome,
  TbBrain,
  TbUsers,
  TbLeaf,
} from "react-icons/tb";

/* ────────────── Constants ────────────── */

const TYPING_SEEN_KEY = "roamiq-search-results-typing-seen-v3";

const continentOptions = [
  { id: null, label: "All Continents", emoji: "🌍" },
  { id: "Asia", label: "Asia", emoji: "🌏" },
  { id: "Europe", label: "Europe", emoji: "🏰" },
  { id: "North America", label: "North America", emoji: "🗽" },
  { id: "South America", label: "South America", emoji: "🌎" },
  { id: "Africa", label: "Africa", emoji: "🌍" },
  { id: "Oceania", label: "Oceania", emoji: "🏝️" },
];

const goalOptions = [
  { id: "World Ranking", label: "World Ranking", emoji: "🏆", description: "Overall best cities for nomads" },
  { id: "Work From Anywhere", label: "Work From Anywhere", emoji: "💼", description: "Best remote work setups" },
  { id: "Increase Savings", label: "Increase Savings", emoji: "💰", description: "Maximize your savings" },
  { id: "Find Community", label: "Find Community", emoji: "🤝", description: "Connect with like-minded explorers" },
];

const goalSubOptions = {
  "World Ranking": [
    { id: "Best for Explorers", label: "Best for Explorers" },
    { id: "Most Affordable", label: "Most Affordable" },
    { id: "Safest Cities", label: "Safest Cities" },
    { id: "Best Weather", label: "Best Weather" },
  ],
  "Work From Anywhere": [
    { id: "Fast Internet Cities", label: "Fast Internet" },
    { id: "Best Work Infrastructure", label: "Best Infrastructure" },
    { id: "Best for Remote Work Setup", label: "Remote Work Ready" },
    { id: "Best Connected Cities", label: "Well Connected" },
  ],
  "Increase Savings": [
    { id: "Cheapest Places", label: "Cheapest Places" },
    { id: "Maximum Savings", label: "Maximum Savings" },
    { id: "Low Taxation", label: "Low Taxation" },
    { id: "Purchasing Power", label: "Purchasing Power" },
  ],
  "Find Community": [
    { id: "Strong Explorer Community", label: "Explorer Community" },
    { id: "Startup Ecosystems", label: "Startup Ecosystems" },
    { id: "Tech Talent Density", label: "Tech Talent" },
    { id: "Nightlife & Culture", label: "Nightlife & Culture" },
  ],
};

const sortOptions = [
  { id: "rank", label: "By Rank" },
  { id: "budget-low", label: "Budget: Low to High" },
  { id: "budget-high", label: "Budget: High to Low" },
  { id: "internet", label: "Best Internet" },
  { id: "visa", label: "Longest Visa" },
];

/* ────────────── Static Destination Data ────────────── */

const staticDestinations = [
  {
    _id: "1", city: "Bali", title: "Bali", country: "Indonesia", displayCountry: "Indonesia", continent: "Asia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    budget: "$800/mo", budgetNum: 800, internet: "45 Mbps", internetNum: 45, visa: "60 days", visaNum: 60, score: 92,
    tags: ["Affordable", "Fast WiFi", "Community"], gradient: "from-emerald-500/40 to-teal-600/40",
    allScores: { safety: 7.5, internet: 8.0, cost: 9.5, fun: 9.0, community: 9.5 },
  },
  {
    _id: "2", city: "Lisbon", title: "Lisbon", country: "Portugal", displayCountry: "Portugal", continent: "Europe",
    image: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80",
    budget: "$1,800/mo", budgetNum: 1800, internet: "85 Mbps", internetNum: 85, visa: "90 days", visaNum: 90, score: 89,
    tags: ["EU Access", "Culture", "Nightlife"], gradient: "from-amber-500/40 to-orange-600/40",
    allScores: { safety: 8.5, internet: 8.5, cost: 6.0, fun: 9.0, community: 8.0 },
  },
  {
    _id: "3", city: "Chiang Mai", title: "Chiang Mai", country: "Thailand", displayCountry: "Thailand", continent: "Asia",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80",
    budget: "$650/mo", budgetNum: 650, internet: "35 Mbps", internetNum: 35, visa: "60 days", visaNum: 60, score: 91,
    tags: ["Very Affordable", "Food Scene", "Coworking"], gradient: "from-green-500/40 to-emerald-600/40",
    allScores: { safety: 7.0, internet: 7.0, cost: 9.8, fun: 8.0, community: 8.5 },
  },
  {
    _id: "4", city: "Dubai", title: "Dubai", country: "UAE", displayCountry: "UAE", continent: "Asia",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    budget: "$2,500/mo", budgetNum: 2500, internet: "120 Mbps", internetNum: 120, visa: "30 days", visaNum: 30, score: 85,
    tags: ["Tax-Free", "Luxury", "Fast WiFi"], gradient: "from-yellow-500/40 to-amber-600/40",
    allScores: { safety: 9.5, internet: 9.5, cost: 4.0, fun: 8.5, community: 7.0 },
  },
  {
    _id: "5", city: "Medellín", title: "Medellín", country: "Colombia", displayCountry: "Colombia", continent: "South America",
    image: "https://images.unsplash.com/photo-1496393969266-8b02c5182f4a?w=600&q=80",
    budget: "$900/mo", budgetNum: 900, internet: "40 Mbps", internetNum: 40, visa: "90 days", visaNum: 90, score: 87,
    tags: ["Spring Weather", "Vibrant Culture", "Affordable"], gradient: "from-pink-500/40 to-rose-600/40",
    allScores: { safety: 6.5, internet: 7.5, cost: 8.5, fun: 9.5, community: 8.0 },
  },
  {
    _id: "6", city: "Tbilisi", title: "Tbilisi", country: "Georgia", displayCountry: "Georgia", continent: "Europe",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=600&q=80",
    budget: "$700/mo", budgetNum: 700, internet: "30 Mbps", internetNum: 30, visa: "365 days", visaNum: 365, score: 88,
    tags: ["Visa-Free", "Budget", "Wine Country"], gradient: "from-violet-500/40 to-purple-600/40",
    allScores: { safety: 8.0, internet: 6.5, cost: 9.0, fun: 7.5, community: 7.0 },
  },
  {
    _id: "7", city: "Mexico City", title: "Mexico City", country: "Mexico", displayCountry: "Mexico", continent: "North America",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
    budget: "$1,100/mo", budgetNum: 1100, internet: "35 Mbps", internetNum: 35, visa: "180 days", visaNum: 180, score: 86,
    tags: ["Culture", "Food", "Creative Energy"], gradient: "from-red-500/40 to-orange-600/40",
    allScores: { safety: 6.0, internet: 7.0, cost: 8.0, fun: 9.5, community: 7.5 },
  },
  {
    _id: "8", city: "Budapest", title: "Budapest", country: "Hungary", displayCountry: "Hungary", continent: "Europe",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80",
    budget: "$1,200/mo", budgetNum: 1200, internet: "70 Mbps", internetNum: 70, visa: "90 days", visaNum: 90, score: 84,
    tags: ["EU Access", "Nightlife", "Startup Scene"], gradient: "from-cyan-500/40 to-blue-600/40",
    allScores: { safety: 8.0, internet: 8.0, cost: 7.5, fun: 9.0, community: 7.5 },
  },
  {
    _id: "9", city: "Playa del Carmen", title: "Playa del Carmen", country: "Mexico", displayCountry: "Mexico", continent: "North America",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
    budget: "$1,300/mo", budgetNum: 1300, internet: "30 Mbps", internetNum: 30, visa: "180 days", visaNum: 180, score: 83,
    tags: ["Beach Life", "Affordable", "Community"], gradient: "from-teal-500/40 to-emerald-600/40",
    allScores: { safety: 7.0, internet: 6.5, cost: 7.0, fun: 9.0, community: 8.5 },
  },
  {
    _id: "10", city: "Bangkok", title: "Bangkok", country: "Thailand", displayCountry: "Thailand", continent: "Asia",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80",
    budget: "$900/mo", budgetNum: 900, internet: "50 Mbps", internetNum: 50, visa: "60 days", visaNum: 60, score: 86,
    tags: ["Street Food", "Connectivity", "Affordable"], gradient: "from-orange-500/40 to-red-600/40",
    allScores: { safety: 7.0, internet: 7.5, cost: 8.5, fun: 9.5, community: 7.0 },
  },
  {
    _id: "11", city: "Berlin", title: "Berlin", country: "Germany", displayCountry: "Germany", continent: "Europe",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    budget: "$2,000/mo", budgetNum: 2000, internet: "55 Mbps", internetNum: 55, visa: "90 days", visaNum: 90, score: 82,
    tags: ["Startup Hub", "Culture", "Nightlife"], gradient: "from-gray-500/40 to-slate-600/40",
    allScores: { safety: 8.0, internet: 7.5, cost: 5.5, fun: 9.0, community: 8.5 },
  },
  {
    _id: "12", city: "Canggu", title: "Canggu", country: "Indonesia", displayCountry: "Indonesia", continent: "Asia",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80",
    budget: "$850/mo", budgetNum: 850, internet: "40 Mbps", internetNum: 40, visa: "60 days", visaNum: 60, score: 90,
    tags: ["Surf Town", "Coworking", "Nomad Hub"], gradient: "from-sky-500/40 to-cyan-600/40",
    allScores: { safety: 7.5, internet: 7.5, cost: 9.0, fun: 9.0, community: 9.5 },
  },
];

/* ────────────── Score Color Helper ────────────── */

const getScoreColor = (score) => {
  if (score >= 8.5) return "text-emerald-400";
  if (score >= 7.0) return "text-amber-400";
  return "text-red-400";
};

const getScoreBg = (score) => {
  if (score >= 8.5) return "bg-emerald-400/15 border-emerald-400/20";
  if (score >= 7.0) return "bg-amber-400/15 border-amber-400/20";
  return "bg-red-400/15 border-red-400/20";
};

const getRankBadgeColor = (rank) => {
  if (rank === 1) return "from-amber-400 to-yellow-500";
  if (rank === 2) return "from-gray-300 to-gray-400";
  if (rank === 3) return "from-amber-600 to-orange-700";
  return "from-gray-600 to-gray-700";
};

/* ────────────── Component ────────────── */

const AiSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loc, attr } = useParams();

  const [selectedGoal, setSelectedGoal] = useState("World Ranking");
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState(null);
  const [sortBy, setSortBy] = useState("rank");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const [typedText, setTypedText] = useState("");
  const [hasTypingPlayed, setHasTypingPlayed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

  // Restore from URL params
  useEffect(() => {
    if (loc && loc !== "World") {
      const decoded = decodeURIComponent(loc);
      const match = continentOptions.find((c) => c.label === decoded);
      if (match) setSelectedContinent(match.id);
    }
    if (attr) {
      const decoded = decodeURIComponent(attr);
      setSelectedSubOption(decoded);
    }
  }, [loc, attr]);

  // Typing animation on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem(TYPING_SEEN_KEY);
    if (seen) {
      setTypedText("Discover your perfect destination below");
      setHasTypingPlayed(true);
      return;
    }
    const text = "Discover your perfect destination below";
    let idx = 0;
    setTypedText("");
    const interval = setInterval(() => {
      idx++;
      setTypedText(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
        sessionStorage.setItem(TYPING_SEEN_KEY, "1");
        setHasTypingPlayed(true);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // Stagger reveal of cards
  useEffect(() => {
    if (!hasTypingPlayed) return;
    setVisibleCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleCount(count);
      if (count >= filteredDestinations.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, [hasTypingPlayed, selectedGoal, selectedSubOption, selectedContinent, sortBy]);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let results = [...staticDestinations];

    // Filter by continent
    if (selectedContinent) {
      results = results.filter((d) => d.continent === selectedContinent);
    }

    // Filter by sub-option (simulate relevance scoring)
    if (selectedSubOption) {
      const sub = selectedSubOption.toLowerCase();
      if (sub.includes("cheap") || sub.includes("afford") || sub.includes("saving")) {
        results.sort((a, b) => a.budgetNum - b.budgetNum);
      } else if (sub.includes("internet") || sub.includes("wifi") || sub.includes("fast")) {
        results.sort((a, b) => b.internetNum - a.internetNum);
      } else if (sub.includes("visa") || sub.includes("long")) {
        results.sort((a, b) => b.visaNum - a.visaNum);
      } else if (sub.includes("safe")) {
        results.sort((a, b) => (b.allScores?.safety || 0) - (a.allScores?.safety || 0));
      } else if (sub.includes("community") || sub.includes("startup") || sub.includes("ecosystem")) {
        results.sort((a, b) => (b.allScores?.community || 0) - (a.allScores?.community || 0));
      } else if (sub.includes("weather") || sub.includes("fun") || sub.includes("night")) {
        results.sort((a, b) => (b.allScores?.fun || 0) - (a.allScores?.fun || 0));
      } else if (sub.includes("infrastructure") || sub.includes("remote") || sub.includes("work")) {
        results.sort((a, b) => (b.allScores?.internet || 0) - (a.allScores?.internet || 0));
      } else {
        results.sort((a, b) => b.score - a.score);
      }
    } else {
      results.sort((a, b) => b.score - a.score);
    }

    // Sort
    if (sortBy === "budget-low") results.sort((a, b) => a.budgetNum - b.budgetNum);
    else if (sortBy === "budget-high") results.sort((a, b) => b.budgetNum - a.budgetNum);
    else if (sortBy === "internet") results.sort((a, b) => b.internetNum - a.internetNum);
    else if (sortBy === "visa") results.sort((a, b) => b.visaNum - a.visaNum);
    // "rank" is already handled above

    return results;
  }, [selectedContinent, selectedSubOption, sortBy]);

  const handleDestinationClick = (destination) => {
    navigate(
      `/ai-verticals?country=${encodeURIComponent(destination.country?.toLowerCase())}&state=${encodeURIComponent(destination.city?.toLowerCase())}`,
      {
        state: {
          selectedStateLabel: destination.title,
          breadcrumbFilters: {
            continent: destination.continent?.toLowerCase(),
            country: destination.country?.toLowerCase(),
            location: destination.city?.toLowerCase(),
          },
        },
      }
    );
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
    setSelectedSubOption(null);
    setIsDropdownOpen(null);
  };

  const handleSubOptionSelect = (optionId) => {
    setSelectedSubOption(optionId);
    setIsDropdownOpen(null);
  };

  const handleContinentSelect = (continentId) => {
    setSelectedContinent(continentId);
    setIsDropdownOpen(null);
  };

  const currentGoalSubOptions = goalSubOptions[selectedGoal] || [];

  /* ── Narrative Text ── */
  const narrativeText = useMemo(() => {
    const continentLabel = selectedContinent || "the World";
    if (selectedSubOption) {
      return `Best cities in ${continentLabel} for ${selectedSubOption.toLowerCase()}, ranked by RoamIQ's Intelligence Model analyzing 50+ global factors including safety, cost of living, internet speed, visa flexibility, and community.`;
    }
    return `Top-ranked destinations in ${continentLabel} for digital nomads and remote workers. Select a category above to see personalized rankings.`;
  }, [selectedContinent, selectedSubOption]);

  return (
    <div className="min-h-screen bg-surface animate-fade-in">
      <div className="max-w-[85rem] mx-auto px-3 sm:px-6 py-4 lg:py-6">

        {/* ─── Header Section ─── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate("/home")} className="glass-card rounded-full p-2 text-gray-400 hover:text-white hover:border-accent/40 transition">
              <TbArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-100">
                {typedText}
                {!hasTypingPlayed && <span className="animate-pulse text-accent">|</span>}
              </h1>
            </div>
          </div>

          {/* Narrative */}
          {hasTypingPlayed && (
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
              {narrativeText}
            </p>
          )}
        </div>

        {/* ─── Filter Bar ─── */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Goal Selector */}
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(isDropdownOpen === "goal" ? null : "goal")}
                className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-100 px-4 py-2.5 text-sm font-medium text-gray-200 hover:border-accent/40 transition">
                <TbSparkles className="text-accent" />
                {selectedGoal}
                <TbChevronDown size={14} className={`transition-transform ${isDropdownOpen === "goal" ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen === "goal" && (
                <div className="absolute top-full left-0 mt-2 z-40 glass-card rounded-xl p-2 min-w-[240px] shadow-xl">
                  {goalOptions.map((goal) => (
                    <button key={goal.id} onClick={() => handleGoalSelect(goal.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 transition ${selectedGoal === goal.id ? "bg-accent/15 text-accent" : "text-gray-300 hover:bg-surface-100"}`}>
                      <span>{goal.emoji}</span>
                      <div>
                        <p className="font-medium">{goal.label}</p>
                        <p className="text-xs text-gray-500">{goal.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-option Selector */}
            {currentGoalSubOptions.length > 0 && (
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(isDropdownOpen === "subOption" ? null : "subOption")}
                  className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-100 px-4 py-2.5 text-sm font-medium text-gray-200 hover:border-accent/40 transition">
                  <TbFilter className="text-accent" />
                  {selectedSubOption || "Select Category"}
                  <TbChevronDown size={14} className={`transition-transform ${isDropdownOpen === "subOption" ? "rotate-180" : ""}`} />
                </button>
                {isDropdownOpen === "subOption" && (
                  <div className="absolute top-full left-0 mt-2 z-40 glass-card rounded-xl p-2 min-w-[200px] shadow-xl">
                    {currentGoalSubOptions.map((opt) => (
                      <button key={opt.id} onClick={() => handleSubOptionSelect(opt.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${selectedSubOption === opt.id ? "bg-accent/15 text-accent" : "text-gray-300 hover:bg-surface-100"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Continent Selector */}
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(isDropdownOpen === "continent" ? null : "continent")}
                className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-100 px-4 py-2.5 text-sm font-medium text-gray-200 hover:border-accent/40 transition">
                <TbWorld className="text-accent" />
                {selectedContinent || "All Continents"}
                <TbChevronDown size={14} className={`transition-transform ${isDropdownOpen === "continent" ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen === "continent" && (
                <div className="absolute top-full left-0 mt-2 z-40 glass-card rounded-xl p-2 min-w-[220px] shadow-xl">
                  {continentOptions.map((c) => (
                    <button key={c.id ?? "all"} onClick={() => handleContinentSelect(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${selectedContinent === c.id ? "bg-accent/15 text-accent" : "text-gray-300 hover:bg-surface-100"}`}>
                      <span>{c.emoji}</span> {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Selector */}
            <div className="relative ml-auto">
              <button onClick={() => setIsDropdownOpen(isDropdownOpen === "sort" ? null : "sort")}
                className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-100 px-3 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:border-accent/40 transition">
                <TbSortAscending size={16} />
                <span className="hidden sm:inline">Sort</span>
                <TbChevronDown size={14} className={`transition-transform ${isDropdownOpen === "sort" ? "rotate-180" : ""}`} />
              </button>
              {isDropdownOpen === "sort" && (
                <div className="absolute top-full right-0 mt-2 z-40 glass-card rounded-xl p-2 min-w-[200px] shadow-xl">
                  {sortOptions.map((opt) => (
                    <button key={opt.id} onClick={() => { setSortBy(opt.id); setIsDropdownOpen(null); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${sortBy === opt.id ? "bg-accent/15 text-accent" : "text-gray-300 hover:bg-surface-100"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Chips */}
          {(selectedContinent || selectedSubOption) && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-glass-border/50">
              <span className="text-xs text-gray-500">Active filters:</span>
              {selectedContinent && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent font-medium">
                  {selectedContinent}
                  <button onClick={() => setSelectedContinent(null)} className="hover:text-white"><TbX size={12} /></button>
                </span>
              )}
              {selectedSubOption && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-xs text-accent font-medium">
                  {selectedSubOption}
                  <button onClick={() => setSelectedSubOption(null)} className="hover:text-white"><TbX size={12} /></button>
                </span>
              )}
              <button onClick={() => { setSelectedContinent(null); setSelectedSubOption(null); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition ml-2">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ─── Results Count ─── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">
            <span className="text-gray-200 font-semibold">{filteredDestinations.length}</span> destinations found
          </p>
        </div>

        {/* ─── Destination Cards Grid ─── */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDestinations.map((dest, idx) => {
              const isVisible = idx < visibleCount;
              const isLiked = likedIds.has(dest._id);
              const rank = idx + 1;

              return (
                <article
                  key={dest._id}
                  className={`cursor-pointer transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  onClick={() => handleDestinationClick(dest)}
                >
                  <div className="glass-card rounded-2xl overflow-hidden group hover:border-accent/30 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={`${dest.city}, ${dest.country}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Rank Badge */}
                      <div className={`absolute top-3 left-3 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br ${getRankBadgeColor(rank)} text-white text-sm font-bold shadow-lg`}>
                        {rank}
                      </div>

                      {/* Like Button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(dest._id); }}
                        className={`absolute top-3 right-3 rounded-full p-1.5 transition ${isLiked ? "bg-red-500/20 text-red-400" : "bg-black/30 text-white/60 hover:text-white"}`}
                      >
                        {isLiked ? <TbHeartFilled size={18} /> : <TbHeart size={18} />}
                      </button>

                      {/* Score Badge */}
                      <div className={`absolute bottom-3 right-3 rounded-lg border px-2 py-1 text-xs font-bold ${getScoreBg(dest.score / 10)} ${getScoreColor(dest.score / 10)}`}>
                        {dest.score}/100
                      </div>

                      {/* City & Country */}
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-lg font-bold text-white leading-tight">{dest.title}</h3>
                        <p className="text-xs text-white/70">{dest.displayCountry}</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <TbCoin className="text-emerald-400" size={13} />
                          {dest.budget}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <TbWifi className="text-cyan-400" size={13} />
                          {dest.internet}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <TbClock className="text-amber-400" size={13} />
                          {dest.visa}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {dest.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-surface-100 border border-glass-border/50 px-2 py-0.5 text-[10px] text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Score Bars */}
                      <div className="space-y-1 pt-1">
                        {Object.entries(dest.allScores || {}).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-500 w-16 capitalize">{key}</span>
                            <div className="flex-1 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${value >= 8.5 ? "bg-emerald-400" : value >= 7 ? "bg-amber-400" : "bg-red-400"}`}
                                style={{ width: isVisible ? `${(value / 10) * 100}%` : "0%" }}
                              />
                            </div>
                            <span className={`text-[10px] font-medium w-6 text-right ${getScoreColor(value)}`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center">
            <TbSearch className="text-4xl text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-300 mb-1">No destinations found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or continent selection</p>
            <button onClick={() => { setSelectedContinent(null); setSelectedSubOption(null); }}
              className="bg-accent hover:bg-cyan-500 text-white font-medium px-6 py-2.5 rounded-xl transition">
              Clear Filters
            </button>
          </div>
        )}

        {/* ─── Powered By Footer ─── */}
        {filteredDestinations.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by <span className="text-accent font-semibold">RoamIQ Intelligence</span> — Analyzing 50+ global factors
            </p>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isDropdownOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(null)} />
      )}
    </div>
  );
};

export default AiSearchResults;
