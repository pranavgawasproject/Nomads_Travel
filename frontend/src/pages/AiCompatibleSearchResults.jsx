import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const compatibleBadges = [
  "Adventure",
  "Gyming",
  "Founders",
  "Solopreners",
  "Freelancers",
  "Family Explorers",
  "Party Focused",
  "Co-Working Density",
  "Internet",
  "Creative Individuals",
  "Infulencers",
  "Yoga",
  "Pubs",
  "Events",
  "Startups",
  "Nightlife",
  "Nature",
  "Accessibility",
  "Dating Scene",
  "Work-Life Balance",
];

const destinationCards = [
  {
    city: "Goa",
    country: "India",
    continent: "Asia",
    suggestions: 102,
    image: "/images/goa-image.jpg",
  },
  {
    city: "Bali",
    country: "Indonesia",
    continent: "Asia",
    suggestions: 89,
    image: "/images/bali-image.jpg",
  },
  {
    city: "Bangkok",
    country: "Thailand",
    continent: "Asia",
    suggestions: 93,
    image: "/images/bangkok-image.jpg",
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    continent: "Asia",
    suggestions: 101,
    image: "/images/dubai-image.webp",
  },
  {
    city: "Budapest",
    country: "Hungary",
    continent: "Europe",
    suggestions: 78,
    image: "/images/budapest-image.jpg",
  },
  {
    city: "Auckland",
    country: "New Zealand",
    continent: "Oceania",
    suggestions: 83,
    image: "/images/auckland-image.jpg",
  },
];

const AiCompatibleSearchResults = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [typedHeading, setTypedHeading] = useState("");
  const [selectedBadges, setSelectedBadges] = useState(
    state?.selectedBadges || [],
  );
  const badgeScrollerRef = useRef(null);

  const handleDestinationClick = (destination) => {
    const country = destination.country.toLowerCase();
    const location = destination.city.toLowerCase();
    const continent = destination.continent.toLowerCase();

    navigate(
      `/ai-verticals?country=${encodeURIComponent(country)}&state=${encodeURIComponent(location)}`,
      {
        state: {
          breadcrumbFilters: {
            continent,
            country,
            location,
          },
        },
      },
    );
  };

  const handleBadgeClick = (selectedBadge) => {
    setSelectedBadges((currentBadges) => {
      if (currentBadges.includes(selectedBadge)) {
        return currentBadges.filter((badge) => badge !== selectedBadge);
      }

      return [...currentBadges, selectedBadge];
    });
  };

  const handleClearSelection = () => {
    setSelectedBadges([]);
  };

  const headingText =
    "As per your inputs, please find below the best destinations curated for you";

  useEffect(() => {
    const badgeScroller = badgeScrollerRef.current;

    if (!badgeScroller) {
      return undefined;
    }

    let animationFrame;
    // const scrollSpeed = 0.5;
    const scrollSpeed = 0;

    const runAutoScroll = () => {
      if (!badgeScroller.matches(":hover")) {
        badgeScroller.scrollLeft += scrollSpeed;

        if (badgeScroller.scrollLeft >= badgeScroller.scrollWidth / 2) {
          badgeScroller.scrollLeft = 0;
        }
      }

      animationFrame = requestAnimationFrame(runAutoScroll);
    };

    animationFrame = requestAnimationFrame(runAutoScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    setTypedHeading("");

    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      currentIndex += 1;
      setTypedHeading(headingText.slice(0, currentIndex));

      if (currentIndex >= headingText.length) {
        clearInterval(typingInterval);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [headingText]);

  return (
    <div className="animate-fade-in min-h-full bg-surface">
      <main className="py-8">
        <div className="min-w-[75%] max-w-[80rem] lg:max-w-[80rem] mx-0 px-6 sm:px-6 lg:mx-auto lg:px-0">
          <div className=" glass-card py-6 px-4">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => navigate("/compatible")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
                aria-label="Go back"
              >
                <HiOutlineArrowLeft size={18} />
              </button>

              <div className="flex flex-1 items-center rounded-full border border-glass-border bg-surface-50 px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)] ml-20 mr-36 ">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200">
                    Best For You
                  </div>
                  {selectedBadges.length ? (
                    selectedBadges.map((badge) => (
                      <div
                        key={badge}
                        className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200"
                      >
                        {badge}
                      </div>
                    ))
                  ) : (
                    <p className="px-2 text-xs text-gray-500">
                      No badges selected
                    </p>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    disabled={!selectedBadges.length}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-gray-400 transition-colors hover:bg-glass-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Clear selected badges"
                  >
                    <HiOutlineX size={24} />
                  </button>
                  <HiOutlineSearch size={34} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="relative px-28">
              <div
                ref={badgeScrollerRef}
                className="relative z-30 mt-6 mx-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex w-max gap-8 pr-8">
                  {[...compatibleBadges, ...compatibleBadges].map(
                    (badge, index) => {
                      const isActive = selectedBadges.includes(badge);

                      return (
                        <button
                          key={`${badge}-${index}`}
                          type="button"
                          onClick={() => handleBadgeClick(badge)}
                          className={`shrink-0 rounded-full border px-6 py-2 text-xs font-medium transition-colors lg:text-md ${
                            isActive
                              ? "border-accent bg-accent text-white"
                              : "border-gray-600 bg-surface-50 text-gray-200 hover:border-accent"
                          }`}
                        >
                          {badge}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="relative mt-8">
                <div className="relative z-10">
                  <p className="text-3xl font-medium leading-snug text-gray-200 lg:text-lg">
                    {typedHeading}
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 ">
                    {destinationCards.map((destination) => (
                      <article
                        key={`${destination.city}-${destination.country}`}
                        className="cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleDestinationClick(destination)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleDestinationClick(destination);
                          }
                        }}
                      >
                        <img
                          src={destination.image}
                          alt={`${destination.city}, ${destination.country}`}
                          className="h-56 w-full rounded-2xl object-cover"
                        />
                        <div className="mt-2 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[1.2rem] font-semibold text-gray-200">
                              {destination.city}
                            </h3>
                          </div>
                          <p className="mt-1 text-[1rem] font-semibold text-gray-200">
                            {destination.country}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.9rem] text-gray-400">
                            {/* {destination.suggestions} Suggestions */}
                            Find activation options
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiCompatibleSearchResults;
