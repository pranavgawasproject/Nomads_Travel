import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TbSparkles, TbArrowRight, TbBrain, TbClock, TbUserStar } from "react-icons/tb";
import useNomadLoginState from "../hooks/useNomadLoginState";
import useAuth from "../hooks/useAuth";

/* ───────────────────────────── constants ───────────────────────────── */

const getTypingSeenKey = (isLoggedIn) =>
  `roamiq-ai-home-typing-seen-${isLoggedIn ? "logged-in" : "logged-out"}`;

const gatedRecommendationTitles = new Set([
  "Work From Anywhere",
  "Increase Your Savings",
  "Advance Your Career",
  "Find Your Community",
]);

const freeRecommendationTitles = new Set([
  "World Ranking",
  "Explore Destinations",
]);

const goalSlugByTitle = {
  "World Ranking": "worldranking",
  "Work From Anywhere": "workfromanywhere",
  "Increase Your Savings": "increaseyoursavings",
  "Advance Your Career": "advanceyourcareer",
  "Find Your Community": "findyourcommunity",
};

const getSearchPathForGoal = (goalTitle) => {
  const goalSlug = goalSlugByTitle[goalTitle];
  return goalSlug ? `/search/${goalSlug}/results` : "/search/results";
};

/* ── Quick Action Cards ── */
const quickActionCards = [
  {
    emoji: "🌍",
    title: "Work From Anywhere",
    description: "Discover the best remote-work destinations",
    path: getSearchPathForGoal("Work From Anywhere"),
    isGated: true,
  },
  {
    emoji: "💰",
    title: "Increase Savings",
    description: "Cities that maximize your savings potential",
    path: "/savings",
    isGated: true,
  },
  {
    emoji: "🚀",
    title: "Advance Career",
    description: "Top cities to grow your career globally",
    path: "/career-search",
    isGated: true,
  },
  {
    emoji: "🤝",
    title: "Find Community",
    description: "Connect with like-minded explorers",
    path: "/compatible",
    isGated: true,
  },
  {
    emoji: "🗺️",
    title: "Explore Destinations",
    description: "Browse destinations by vertical & category",
    path: "/ai-verticals",
    isGated: false,
  },
  {
    emoji: "📊",
    title: "World Rankings",
    description: "50+ global factors ranked for you",
    path: getSearchPathForGoal("World Ranking"),
    isGated: false,
  },
];

/* ── Trending Destinations ── */
const trendingDestinations = [
  { city: "Bali", country: "Indonesia", desc: "Surf, sunsets & coworking hubs", gradient: "from-emerald-500/40 to-teal-600/40" },
  { city: "Lisbon", country: "Portugal", desc: "Europe's digital nomad capital", gradient: "from-amber-500/40 to-orange-600/40" },
  { city: "Dubai", country: "UAE", desc: "Tax-free living & luxury coworking", gradient: "from-yellow-500/40 to-amber-600/40" },
  { city: "Chiang Mai", country: "Thailand", desc: "Affordable paradise for remote workers", gradient: "from-green-500/40 to-emerald-600/40" },
  { city: "Medellín", country: "Colombia", desc: "Spring-like weather & vibrant culture", gradient: "from-pink-500/40 to-rose-600/40" },
  { city: "Tbilisi", country: "Georgia", desc: "Budget-friendly & visa-free entry", gradient: "from-violet-500/40 to-purple-600/40" },
  { city: "Mexico City", country: "Mexico", desc: "Culture, food & creative energy", gradient: "from-red-500/40 to-orange-600/40" },
  { city: "Budapest", country: "Hungary", desc: "Thermal baths & thriving startup scene", gradient: "from-cyan-500/40 to-blue-600/40" },
];

/* ── Features ── */
const features = [
  {
    icon: TbBrain,
    title: "AI-Powered Intelligence",
    desc: "Advanced algorithms analyze hundreds of data points to surface the perfect destination match for your lifestyle.",
  },
  {
    icon: TbClock,
    title: "Real-Time Data",
    desc: "Live cost-of-living, visa requirements, internet speed & safety metrics updated continuously.",
  },
  {
    icon: TbUserStar,
    title: "Personalized Recommendations",
    desc: "Tailored suggestions based on your goals, budget, career path, and community preferences.",
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

  const { auth } = useAuth();
  const hasNomadLoginState = useNomadLoginState();
  const isLoggedIn = Boolean(auth?.user) || hasNomadLoginState;
  const userFirstName = auth?.user?.fullName?.split(" ")?.[0] || "Explorer";

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

  /* ── Quick action click (with gating) ── */
  const handleQuickAction = useCallback(
    (card) => {
      if (!isLoggedIn && card.isGated) {
        const goalSlug = goalSlugByTitle[card.title];
        const loginPath = goalSlug ? `/ai-login/${goalSlug}` : "/ai-login";
        navigate(`${loginPath}${location.search}`, {
          state: {
            loginContext: { title: card.title, description: card.description },
            redirectTo: card.path,
          },
        });
        return;
      }
      navigate(card.path, {
        state: card.path.includes("/search") && card.path.includes("/results")
          ? { selectedGoal: card.title }
          : undefined,
      });
    },
    [isLoggedIn, navigate, location.search]
  );

  /* ── Trending destination click ── */
  const handleDestinationClick = useCallback(
    (dest) => {
      navigate(
        `/search/results?q=${encodeURIComponent(dest.city + " " + dest.country)}`
      );
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
              {isLoggedIn ? (
                <span className="gradient-text">{displayedHeading}</span>
              ) : (
                <span className="gradient-text">{displayedHeading}</span>
              )}
              {displayedHeading.length < headingText.length && (
                <span className="inline-block w-[3px] h-[0.85em] bg-accent ml-1 align-middle animate-typing" />
              )}
            </h1>

            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Ask RoamIQ anything about travel, destinations, workation, or
              career opportunities worldwide
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
                  className={`flex-shrink-0 w-[160px] sm:w-[180px] glass-card-hover p-4 sm:p-5 text-left group snap-start transition-all duration-500 cursor-pointer ${
                    index < visibleCards
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <span className="text-2xl sm:text-3xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                    {card.emoji}
                  </span>
                  <h3 className="text-gray-200 text-sm sm:text-[0.9rem] font-semibold leading-snug mb-1 group-hover:text-accent transition-colors duration-200">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {card.description}
                  </p>
                  {!isLoggedIn && card.isGated && (
                    <span className="inline-block mt-2 text-[10px] text-accent/70 font-medium tracking-wide uppercase">
                      Login required
                    </span>
                  )}
                  {!isLoggedIn && !card.isGated && (
                    <span className="inline-block mt-2 text-[10px] text-emerald-500/70 font-medium tracking-wide uppercase">
                      Free access
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

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
              {trendingDestinations.map((dest, index) => (
                <button
                  key={dest.city}
                  onClick={() => handleDestinationClick(dest)}
                  className={`flex-shrink-0 w-[200px] sm:w-[220px] glass-card-hover overflow-hidden group snap-start cursor-pointer transition-all duration-500 ${
                    index < visibleDestinations
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  {/* Gradient image placeholder */}
                  <div
                    className={`h-28 sm:h-32 bg-gradient-to-br ${dest.gradient} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-surface/30" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-white font-bold text-base sm:text-lg leading-tight drop-shadow-lg">
                        {dest.city}
                      </h3>
                      <p className="text-white/70 text-xs font-medium">
                        {dest.country}
                      </p>
                    </div>
                    {/* Hover shine effect */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {dest.desc}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 text-accent text-xs font-medium group-hover:gap-2 transition-all duration-200">
                      Explore <TbArrowRight className="w-3 h-3" />
                    </span>
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

          {/* ── Footer disclaimer ── */}
          <p className="text-center text-gray-600 text-xs mt-4 pb-4">
            RoamIQ is in Beta and can make mistakes. Building the future of
            global explorer living, one update at a time.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AiHome;
