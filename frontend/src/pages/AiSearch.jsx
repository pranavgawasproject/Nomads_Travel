import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AI_SEARCH_TYPING_SEEN_KEY = "roamiq-ai-search-typing-seen";

const filters = [
  "Overall Work from anywhere Index",
  "Digital explorer visas",
  "Visa-free entry length",
  "Airport connectivity",
  "Direct international flights",
  "Internet speed",
  "Global accessibility",
  "Cost of living (live, work, eat, travel etc)",
  "Explorer Population Index",
  "Remote working infrastructure",
];

const filterOptions = {
  "Overall Work from anywhere Index": [
    "Very Low",
    "Low",
    "Moderate",
    "High",
    "Very High",
  ],

  "Digital explorer visas": [
    "No visa available",
    "Visa available",
    "Multiple visa options",
  ],

  "Visa-free entry length": [
    "Up to 30 days",
    "31 - 90 days",
    "91 - 180 days",
    "180+ days",
  ],

  "Airport connectivity": ["Limited", "Moderate", "Good", "Excellent"],

  "Direct international flights": ["Very Few", "Few", "Moderate", "Many"],

  "Internet speed": [
    "Under 25 Mbps",
    "25 - 50 Mbps",
    "50 - 100 Mbps",
    "100+ Mbps",
  ],

  "Global accessibility": ["Low", "Moderate", "High"],

  "Cost of living (live, work, eat, travel etc)": [
    "Very Affordable",
    "Affordable",
    "Moderate",
    "Expensive",
    "Very Expensive",
  ],

  "Explorer Population Index": [
    "Very Low",
    "Low",
    "Moderate",
    "High",
    "Very High",
  ],

  "Remote working infrastructure": [
    "Basic",
    "Developing",
    "Well Developed",
    "Highly Advanced",
  ],
};

const AiSearch = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);

  const [typedHeading, setTypedHeading] = useState("");

  const headingText =
    "Please share the below details to find the best destinations for you";

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AI_SEARCH_TYPING_SEEN_KEY) === "true";

    if (hasSeenTypingEffect) {
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
          window.localStorage.setItem(AI_SEARCH_TYPING_SEEN_KEY, "true");
        }
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [headingText]);

  const handleFilterClick = (selectedFilter) => {
    setActiveFilter(selectedFilter);
  };

  const handleOptionClick = (selectedOption) => {
    if (!activeFilter) return;

    navigate("/search/results", {
      state: {
        selectedFilter: activeFilter,
        selectedOption,
        orderedFilters: filters,
      },
    });
  };
  return (
    <div className="min-h-full bg-surface animate-fade-in">
      <main className="px-6 py-12 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <div></div>
            <h1 className="text-left text-[1.43rem] font-medium text-gray-200 w-full px-28 font-heading">
              {typedHeading}
              {!typedHeading && (
                <span className="inline-block w-0.5 h-5 bg-accent animate-typing ml-1 align-middle" />
              )}
            </h1>
            <div></div>
          </div>

          <div className="mt-16 ml-28 flex max-w-3xl items-center rounded-full border border-glass-border bg-surface-50 px-4 py-0 shadow-glass backdrop-blur-xl transition-all duration-300 focus-within:border-accent/50 focus-within:shadow-glow">
            <input
              type="text"
              aria-label="Search destinations"
              className="w-full border-none bg-transparent text-xl text-gray-200 outline-none placeholder:text-gray-500"
            />
            <button
              type="button"
              aria-label="Search"
              className="btn-primary ml-4 flex items-center gap-2 !rounded-full !px-5 !py-2.5"
            >
              <HiOutlineSearch size={20} />
              <span className="hidden sm:inline text-sm">Search</span>
            </button>
          </div>

          <div className="mt-6 ml-28 flex flex-wrap items-center justify-start gap-3">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterClick(filter)}
                  className={`rounded-full border px-5 py-2 text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "border-accent bg-accent text-surface shadow-glow"
                      : "border-glass-border bg-glass text-gray-300 hover:border-accent/50 hover:bg-glass-hover hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {activeFilter && (
            <div className="mx-auto mt-4 w-full max-w-3xl animate-slide-down">
              <ul className="w-full max-w-[280px] space-y-1 glass-card p-2">
                {filterOptions[activeFilter].map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className="w-full rounded-lg px-4 py-2.5 text-left text-sm text-gray-300 transition-all duration-200 hover:bg-accent/10 hover:text-white"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AiSearch;
