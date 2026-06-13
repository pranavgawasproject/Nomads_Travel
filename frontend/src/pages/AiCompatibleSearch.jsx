import React, { useEffect, useRef, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AI_COMPATIBLE_TYPING_SEEN_KEY = "roamiq-ai-compatible-typing-seen";

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

const AiCompatibleSearch = () => {
  const navigate = useNavigate();
  const [selectedBadges, setSelectedBadges] = useState([]);

  const badgeScrollerRef = useRef(null);

  const [typedHeading, setTypedHeading] = useState("");

  const headingText =
    "Please share the below details to find the best destinations for you";

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AI_COMPATIBLE_TYPING_SEEN_KEY) === "true";

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
          window.localStorage.setItem(AI_COMPATIBLE_TYPING_SEEN_KEY, "true");
        }
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [headingText]);

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

  const handleBadgeClick = (selectedBadge) => {
    setSelectedBadges((currentBadges) => {
      if (currentBadges.includes(selectedBadge)) {
        return currentBadges.filter((badge) => badge !== selectedBadge);
      }

      return [...currentBadges, selectedBadge];
    });
  };

  const handleSearch = () => {
    if (!selectedBadges.length) return;

    navigate("/compatible/results", {
      state: {
        selectedBadges,
      },
    });
  };

  const handleClearSelection = () => {
    setSelectedBadges([]);
  };

  return (
    <div className="animate-fade-in min-h-full bg-surface">
      <main className="px-6 py-12 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <div></div>
            <h1 className="text-left text-[1.43rem] font-medium text-gray-200 w-full px-28">
              {typedHeading}
            </h1>
            <div></div>
          </div>

          <div className=" mt-16 ml-28 flex max-w-3xl items-center rounded-full border border-glass-border px-3 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)] ">
            <div className="flex min-h-10 flex-1 flex-wrap items-center gap-2">
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
                <p className="px-2 text-base text-gray-500">
                  Select badges below
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearSelection}
              disabled={!selectedBadges.length}
              aria-label="Clear selected badges"
              className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-gray-400 transition-colors hover:bg-glass-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiOutlineX size={22} />
            </button>
            <button
              type="button"
              onClick={handleSearch}
              aria-label="Search"
              className="rounded-full p-2 text-accent"
            >
              <HiOutlineSearch size={36} />
            </button>
          </div>

          <div
            ref={badgeScrollerRef}
            className="mt-6 ml-28 max-w-3xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex w-max items-center gap-8 pr-8">
              {[...compatibleBadges, ...compatibleBadges].map(
                (badge, index) => {
                  const isActive = selectedBadges.includes(badge);

                  return (
                    <button
                      key={`${badge}-${index}`}
                      type="button"
                      onClick={() => handleBadgeClick(badge)}
                      className={`shrink-0 rounded-full border px-6 py-2 text-xs font-medium transition-colors ${isActive
                          ? "border-accent bg-accent text-white"
                          : "border-glass-border text-gray-200 hover:border-accent"
                        }`}
                    >
                      {badge}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiCompatibleSearch;
