import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TbSparkles,
  TbArrowRight,
  TbBrain,
  TbClock,
  TbUserStar,
  TbMapSearch,
  TbChartBar,
  TbMessageChatbot,
  TbPlaneDeparture,
  TbUsers,
  TbCalculator,
  TbRocket,
} from "react-icons/tb";
import useNomadLoginState from "../hooks/useNomadLoginState";
import useAuth from "../hooks/useAuth";
import { getCities } from "../services/supabaseService";

/* ───────────────────────────── constants ───────────────────────────── */

const getTypingSeenKey = (isLoggedIn) =>
  `roamiq-ai-home-typing-seen-${isLoggedIn ? "logged-in" : "logged-out"}`;

/* ── Quick Action Cards — ALL WORKING ── */
const quickActionCards = [
  {
    emoji: "🗺️",
    title: "Explore Destinations",
    description: "Browse coworking, coliving & cafes worldwide",
    path: "/ai-verticals",
    isWorking: true,
  },
  {
    emoji: "📊",
    title: "World Rankings",
    description: "Cities ranked by budget, WiFi, visa & more",
    path: "/world-rankings",
    isWorking: true,
  },
  {
    emoji: "💬",
    title: "AI Trip Planner",
    description: "Tell us your dream trip, AI plans it",
    path: "/search",
    isWorking: true,
  },
  {
    emoji: "✈️",
    title: "Travel Deals",
    description: "Best flight & stay deals this month",
    path: "/savings",
    isWorking: false,
  },
  {
    emoji: "🤝",
    title: "Community",
    description: "Connect with like-minded explorers",
    path: "/compatible",
    isWorking: false,
  },
];

/* ── Trending Destinations (fallback) ── */
const fallbackDestinations = [
  { city: "Bali", country: "Indonesia", desc: "Surf, sunsets & coworking hubs", budget: "$800/mo", gradient: "from-emerald-500/40 to-teal-600/40" },
  { city: "Lisbon", country: "Portugal", desc: "Europe's digital nomad capital", budget: "$1,800/mo", gradient: "from-amber-500/40 to-orange-600/40" },
  { city: "Dubai", country: "UAE", desc: "Tax-free living & luxury coworking", budget: "$2,500/mo", gradient: "from-yellow-500/40 to-amber-600/40" },
  { city: "Chiang Mai", country: "Thailand", desc: "Affordable paradise for remote workers", budget: "$650/mo", gradient: "from-green-500/40 to-emerald-600/40" },
  { city: "Medellín", country: "Colombia", desc: "Spring-like weather & vibrant culture", budget: "$900/mo", gradient: "from-pink-500/40 to-rose-600/40" },
  { city: "Tbilisi", country: "Georgia", desc: "Budget-friendly & visa-free entry", budget: "$700/mo", gradient: "from-violet-500/40 to-purple-600/40" },
  { city: "Mexico City", country: "Mexico", desc: "Culture, food & creative energy", budget: "$1,100/mo", gradient: "from-red-500/40 to-orange-600/40" },
  { city: "Budapest", country: "Hungary", desc: "Thermal baths & thriving startup scene", budget: "$1,200/mo", gradient: "from-cyan-500/40 to-blue-600/40" },
];

/* ── Features — Specific, not generic ── */
const features = [
  {
    icon: TbBrain,
    title: "AI That Knows Nomads",
    desc: "Tells you Bangkok is cheaper than Bali this month, with real visa & WiFi data — not generic travel advice.",
  },
  {
    icon: TbClock,
    title: "Live Cost Comparison",
    desc: "Chiang Mai: $650/mo vs Lisbon: $1,800/mo — see exact breakdowns for rent, food, transport & coworking.",
  },
  {
    icon: TbUserStar,
    title: "Built For Your Lifestyle",
    desc: "Remote dev? Bangkok. Designer? Lisbon. Budget traveler? Tbilisi. Recommendations that match how you actually live.",
  },
];

/* ── Coming Soon ── */
const comingSoonItems = [
  {
    icon: TbMessageChatbot,
    title: "AI Trip Planner",
    desc: "Tell us your budget and dates — AI builds your full itinerary",
  },
  {
    icon: TbPlaneDeparture,
    title: "One-Click Booking",
    desc: "Plan your trip, then book flights & stays in one click",
  },
  {
    icon: TbUsers,
    title: "Nomad Community",
    desc: "Meet fellow travelers in your city, share tips & events",
  },
  {
    icon: TbCalculator,
    title: "Savings Calculator",
    desc: "Compare your current city costs vs 100+ nomad destinations",
  },
];

/* ──────────────────────────── component ──────────────────────────── */

const AiHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [visibleDestinations, setVisibleDestinations] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const [visibleComingSoon, setVisibleComingSoon] = useState(0);
  const [trendingDestinations, setTrendingDestinations] = useState(fallbackDestinations);

  const { auth } = useAuth();
  const hasNomadLoginState = useNomadLoginState();
  const isLoggedIn = Boolean(auth?.user) || hasNomadLoginState;
  const userFirstName = auth?.user?.fullName?.split(" ")?.[0] || "Explorer";

  // Fetch trending destinations from Supabase cities
  useEffect(() => {
    async function fetchCities() {
      try {
        const cities = await getCities();
        if (cities && cities.length > 0) {
          const gradients = [
            "from-emerald-500/40 to-teal-600/40",
            "from-amber-500/40 to-orange-600/40",
            "from-yellow-500/40 to-amber-600/40",
            "from-green-500/40 to-emerald-600/40",
            "from-pink-500/40 to-rose-600/40",
            "from-violet-500/40 to-purple-600/40",
            "from-red-500/40 to-orange-600/40",
            "from-cyan-500/40 to-blue-600/40",
          ];
          const descriptions = [
            "Surf, sunsets & coworking hubs",
            "Europe's digital nomad capital",
            "Tax-free living & luxury coworking",
            "Affordable paradise for remote workers",
            "Spring-like weather & vibrant culture",
            "Budget-friendly & visa-free entry",
            "Culture, food & creative energy",
            "Thermal baths & thriving startup scene",
          ];
          const mapped = cities.slice(0, 8).map((c, i) => ({
            city: c.name,
            country: c.country,
            desc: descriptions[i % descriptions.length],
            budget: c.costUSD ? `$${c.costUSD}/mo` : '',
            gradient: gradients[i % gradients.length],
          }));
          if (mapped.length > 0) {
            setTrendingDestinations(mapped);
          }
        }
      } catch (err) {
        console.warn('[AiHome] Failed to fetch cities, using fallback:', err.message || err);
      }
    }
    fetchCities();
  }, []);

  /* ── Simplified typing animation for heading ── */
  const [displayedHeading, setDisplayedHeading] = useState("");
  const headingText = isLoggedIn
    ? `Welcome back, ${userFirstName}!`
    : "Where will you roam next?";

  useEffect(() => {
    const typingSeenKey = getTypingSeenKey(isLoggedIn);
    const hasSeen =
      typeof window !== "undefined" &&
      window.localStorage.getItem(typingSeenKey) === "true";

    if (hasSeen) {
      setDisplayedHeading(headingText);
      setMounted(true);
      return;
    }

    let idx = 0;
    setDisplayedHeading("");
    const interval = setInterval(() => {
      idx += 1;
      setDisplayedHeading(headingText.slice(0, idx));
      if (idx >= headingText.length) {
        clearInterval(interval);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(typingSeenKey, "true");
        }
      }
    }, 35);

    return () => clearInterval(interval);
  }, [headingText, isLoggedIn]);

  /* ── Mount + staggered reveal ── */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisibleCards(count);
      if (count >= quickActionCards.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setVisibleDestinations(count);
        if (count >= trendingDestinations.length) clearInterval(interval);
      }, 80);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(t);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setVisibleFeatures(count);
        if (count >= features.length) clearInterval(interval);
      }, 150);
      return () => clearInterval(interval);
    }, 1200);
    return () => clearTimeout(t);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setVisibleComingSoon(count);
        if (count >= comingSoonItems.length) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    }, 1800);
    return () => clearTimeout(t);
  }, [mounted]);

  /* ── Chat submit ── */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      navigate(`/search/results?q=${encodeURIComponent(trimmed)}`);
    },
    [query, navigate]
  );

  /* ── Quick action click ── */
  const handleQuickAction = useCallback(
    (card) => {
      if (!card.isWorking) return; // Coming soon — do nothing
      navigate(card.path);
    },
    [navigate]
  );

  /* ── Trending destination click ── */
  const handleDestinationClick = useCallback(
    (dest) => {
      navigate(`/world-rankings`);
    },
    [navigate]
  );

  /* ───────────────────────────── render ───────────────────────────── */

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col bg-surface overflow-x-hidden">
      {/* ── Background gradient glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-glow opacity-60" />

        {/* CSS-only animated particles */}
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
              }}
            />
          ))}
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 sm:gap-14">
          {/* ════════════ 1. Hero Section ════════════ */}
          <section className="text-center space-y-4 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">{displayedHeading}</span>
              {displayedHeading.length < headingText.length && (
                <span className="inline-block w-[3px] h-[0.85em] bg-accent ml-1 align-middle animate-typing" />
              )}
            </h1>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Your AI-powered travel intelligence. Discover cities, compare costs,
              find workspaces — all in one place.
            </p>
          </section>

          {/* ════════════ 2. Chat Input Bar ════════════ */}
          <section
            className={`w-full max-w-2xl transition-all duration-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className={`relative flex items-center gap-3 rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 backdrop-blur-xl transition-all duration-300 ${
                isFocused
                  ? "bg-surface-50/80 border-accent/50 shadow-glow"
                  : "bg-glass border-glass-border hover:border-glass-border/80"
              }`}
            >
              {/* AI sparkle icon */}
              <div className="flex-shrink-0 text-accent">
                <TbSparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask me anything... e.g., 'Best cities for remote workers in Asia'"
                className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 text-sm sm:text-base outline-none min-w-0"
              />

              {/* Send button */}
              <button
                type="submit"
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent hover:bg-accent-hover flex items-center justify-center transition-all duration-200 hover:shadow-glow-sm active:scale-95"
                aria-label="Send query"
              >
                <TbArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-surface" />
              </button>
            </form>

            {/* Glow effect under input */}
            {isFocused && (
              <div className="absolute -inset-1 rounded-2xl bg-accent/5 blur-xl -z-10 transition-opacity duration-300 pointer-events-none" />
            )}
          </section>

          {/* ════════════ 3. Quick Action Cards ════════════ */}
          <section className="w-full">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory px-1">
              {quickActionCards.map((card, index) => (
                <button
                  key={card.title}
                  onClick={() => handleQuickAction(card)}
                  disabled={!card.isWorking}
                  className={`flex-shrink-0 w-[160px] sm:w-[180px] p-4 sm:p-5 text-left group snap-start transition-all duration-500 rounded-xl border ${
                    card.isWorking
                      ? "glass-card-hover cursor-pointer"
                      : "bg-surface-50/30 border-glass-border/50 cursor-not-allowed opacity-60"
                  } ${
                    index < visibleCards
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <span className="text-2xl sm:text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                    {card.emoji}
                  </span>
                  <h3 className={`text-sm sm:text-[0.9rem] font-semibold leading-snug mb-1 transition-colors duration-200 ${
                    card.isWorking ? "text-gray-200 group-hover:text-accent" : "text-gray-400"
                  }`}>
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {card.description}
                  </p>
                  {card.isWorking ? (
                    <span className="inline-block mt-2 text-[10px] text-emerald-500/70 font-medium tracking-wide uppercase">
                      Live
                    </span>
                  ) : (
                    <span className="inline-block mt-2 text-[10px] text-amber-500/70 font-medium tracking-wide uppercase">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ════════════ 4. Trending Destinations ════════════ */}
          <section className="w-full space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
                Trending Destinations
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {trendingDestinations.map((dest, index) => (
                <button
                  key={dest.city}
                  onClick={() => handleDestinationClick(dest)}
                  className={`glass-card-hover overflow-hidden group cursor-pointer transition-all duration-500 ${
                    index < visibleDestinations
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  {/* Gradient image placeholder */}
                  <div
                    className={`h-24 sm:h-28 bg-gradient-to-br ${dest.gradient} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-surface/30" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <h3 className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-lg">
                        {dest.city}
                      </h3>
                      <p className="text-white/70 text-[11px] font-medium">
                        {dest.country}
                      </p>
                    </div>
                    {/* Hover shine effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mb-1.5">
                      {dest.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent text-xs font-semibold">{dest.budget}</span>
                      <span className="inline-flex items-center gap-0.5 text-gray-500 text-[10px] group-hover:text-accent group-hover:gap-1 transition-all duration-200">
                        View <TbArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ════════════ 5. Features Section ════════════ */}
          <section className="w-full space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
                Why RoamIQ
              </h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className={`glass-card p-5 sm:p-6 group transition-all duration-500 ${
                      index < visibleFeatures
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                    <h3 className="text-gray-200 font-semibold text-sm sm:text-base mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ════════════ 6. Coming Soon Section ════════════ */}
          <section className="w-full space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <TbRocket className="w-5 h-5 text-accent" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
                  Coming Soon
                </h2>
              </div>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comingSoonItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={`glass-card p-4 sm:p-5 flex items-start gap-4 transition-all duration-500 ${
                      index < visibleComingSoon
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-300 font-semibold text-sm mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500/80 text-[10px] font-semibold tracking-wide uppercase flex-shrink-0">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Footer disclaimer ── */}
          <p className="text-center text-gray-600 text-xs mt-4 pb-4">
            RoamIQ is in Beta. Building the future of AI-powered travel intelligence.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AiHome;
