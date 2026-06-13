import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaGlobeAmericas } from "react-icons/fa";
import { MdOutlineWorkHistory } from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import { RiUserCommunityLine } from "react-icons/ri";
import { TbAward, TbWorldWww } from "react-icons/tb";
import useNomadLoginState from "../hooks/useNomadLoginState";

import useAuth from "../hooks/useAuth";

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
  "Search Old School",
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

const recommendationCards = [
  {
    title: "World Ranking",
    description:
      "Best explorer destinations based on the world index which includes 50+ global factors.",
    icon: TbAward,
    path: getSearchPathForGoal("World Ranking"),
  },
  {
    title: "Work From Anywhere",
    description:
      "Custom suggestions to help you discover and work from the best explorer destinations.",
    icon: FaGlobeAmericas,
    path: getSearchPathForGoal("Work From Anywhere"),
  },
  {
    title: "Increase Your Savings",
    description:
      "Tailored explorer destination suggestions to help you increase your savings as an explorer.",
    icon: HiOutlineCurrencyDollar,
    path: getSearchPathForGoal("Increase Your Savings"),
  },
  {
    title: "Advance Your Career",
    description:
      "Discover the most suitable explorer destinations to advance your career.",
    icon: MdOutlineWorkHistory,
    path: getSearchPathForGoal("Advance Your Career"),
  },
  {
    title: "Find Your Community",
    description:
      "Like minded individuals & communities as per your preferences in explorer destinations.",
    icon: RiUserCommunityLine,
    path: getSearchPathForGoal("Find Your Community"),
  },
  {
    title: "Search Old School",
    description:
      "Self search & find ideal explorer destinations as per your preference like old times.",
    icon: TbWorldWww,
    path: "/manual-search",
  },
];

const AiHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [typedGreeting, setTypedGreeting] = useState("");
  const [typedSubheading, setTypedSubheading] = useState("");

  const [typedThirdLine, setTypedThirdLine] = useState("");
  const [typedFourthLine, setTypedFourthLine] = useState("");

  const [areCardsVisible, setAreCardsVisible] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);

  const { auth } = useAuth();
  const hasNomadLoginState = useNomadLoginState();
  const isLoggedIn = Boolean(auth?.user) || hasNomadLoginState;

  const userFirstName = auth?.user?.fullName?.split(" ")?.[0] || "Abrar";

  const greetingText = isLoggedIn ? `Hi ${userFirstName}` : "Meet roamiq";
  const subheadingText = isLoggedIn
    ? ""
    : "An intelligent platform for modern explorers … Early adoption of our future lifestyle!";
  const thirdLineText = isLoggedIn
    ? "A global community of explorers & remote workers, who are redefining how the world lives and works. Early adoption of our future lifestyle!"
    : "A global community of explorers & remote workers, who are redefining how the world lives and works. Early adoption of our future lifestyle!";
  const fourthLineText = isLoggedIn
    ? "Choose your goals from below so that we can help you design your explorer lifestyle."
    : "Choose your goals from below so that we can help you design your explorer lifestyle.";

  const renderBracketBrand = (text) =>
    text.split("").map((char, index) => {
      const normalizedText = text.toLowerCase();
      const inOfWord =
        normalizedText.slice(index, index + 2) === "of" ||
        normalizedText.slice(index - 1, index + 1) === "of";
      const isBlueO = (char === "o" || char === "O") && !inOfWord;
      return (
        <span
          key={`${char}-${index}`}
          className={isBlueO ? "text-sky-500" : "text-black/90"}
        >
          {char}
        </span>
      );
    });

  useEffect(() => {
    const typingSeenKey = getTypingSeenKey(isLoggedIn);
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(typingSeenKey) === "true";

    if (hasSeenTypingEffect) {
      setTypedGreeting(greetingText);
      setTypedSubheading(subheadingText);
      setTypedThirdLine(thirdLineText);
      setTypedFourthLine(fourthLineText);
      setAreCardsVisible(true);
      return;
    }
    setTypedGreeting("");
    setTypedSubheading("");
    setTypedThirdLine("");
    setTypedFourthLine("");
    setAreCardsVisible(false);

    let greetingIndex = 0;
    let subheadingIndex = 0;
    let thirdLineIndex = 0;
    let fourthLineIndex = 0;
    let cleanupSubheading = () => { };
    let cleanupThirdLine = () => { };
    let cleanupFourthLine = () => { };

    const greetingInterval = setInterval(() => {
      greetingIndex += 1;
      setTypedGreeting(greetingText.slice(0, greetingIndex));

      if (greetingIndex >= greetingText.length) {
        clearInterval(greetingInterval);

        const subheadingInterval = setInterval(() => {
          subheadingIndex += 1;
          setTypedSubheading(subheadingText.slice(0, subheadingIndex));

          if (subheadingIndex >= subheadingText.length) {
            clearInterval(subheadingInterval);

            if (!thirdLineText) {
              setAreCardsVisible(true);
              return;
            }

            const thirdLineInterval = setInterval(() => {
              thirdLineIndex += 1;
              setTypedThirdLine(thirdLineText.slice(0, thirdLineIndex));

              if (thirdLineIndex >= thirdLineText.length) {
                clearInterval(thirdLineInterval);

                if (!fourthLineText) {
                  setAreCardsVisible(true);
                  return;
                }

                const fourthLineInterval = setInterval(() => {
                  fourthLineIndex += 1;
                  setTypedFourthLine(fourthLineText.slice(0, fourthLineIndex));

                  if (fourthLineIndex >= fourthLineText.length) {
                    clearInterval(fourthLineInterval);
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(typingSeenKey, "true");
                    }
                    setAreCardsVisible(true);
                  }
                }, 7);

                cleanupFourthLine = () => clearInterval(fourthLineInterval);
              }
            }, 7);

            cleanupThirdLine = () => clearInterval(thirdLineInterval);
          }
        }, 7);

        if (!subheadingText) {
          setAreCardsVisible(true);
        }

        cleanupSubheading = () => clearInterval(subheadingInterval);
      }
    }, 7);

    return () => {
      clearInterval(greetingInterval);
      cleanupSubheading();
      cleanupThirdLine();
      cleanupFourthLine();
    };
  }, [fourthLineText, greetingText, isLoggedIn, subheadingText, thirdLineText]);

  useEffect(() => {
    if (!areCardsVisible) {
      setVisibleCardCount(0);
      return;
    }

    let currentVisibleCount = 0;

    const revealInterval = setInterval(() => {
      currentVisibleCount += 1;
      setVisibleCardCount(currentVisibleCount);

      if (currentVisibleCount >= recommendationCards.length) {
        clearInterval(revealInterval);
      }
    }, 120);

    return () => {
      clearInterval(revealInterval);
    };
  }, [areCardsVisible]);

  const handleCardClick = (card) => {
    const params = new URLSearchParams(location.search);
    const targetSearch = params.toString() ? `?${params.toString()}` : "";
    const targetRoute = `${card.path}${targetSearch}`;

    if (!isLoggedIn && gatedRecommendationTitles.has(card.title)) {
      const goalSlug = goalSlugByTitle[card.title];
      const loginPath = goalSlug ? `/ai-login/${goalSlug}` : "/ai-login";

      navigate(`${loginPath}${location.search}`, {
        state: {
          loginContext: {
            title: card.title,
            description: card.description,
          },
          redirectTo: targetRoute,
        },
      });
      return;
    }

    navigate(
      {
        pathname: card.path,
        search: targetSearch,
      },
      {
        state:
          card.path.includes("/search") && card.path.includes("/results")
            ? { selectedGoal: card.title }
            : undefined,
      },
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col bg-white">
      <main className="flex-1 px-3 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-medium text-black/90 font-play">
            {typedGreeting}
          </h1>
          {!isLoggedIn ? (
            <h2 className="mt-1 text-ls font-medium font-play">
              <span className="text-black/90">(</span>
              {renderBracketBrand("world of explorers")}
              <span className="text-black/90">)</span>
            </h2>
          ) : null}
          {typedSubheading ? (
            <h2 className="mt-5 text-sm font-semibold text-black/85 font-play sm:text-lg">
              {typedSubheading}
            </h2>
          ) : null}
          {/* <p className="mt-4 text-sm sm:text-lg font-medium text-black/85 font-play">
            {typedThirdLine}
          </p> */}
          <p className="mt-4 text-sm sm:text-xl font-medium text-primary-blue font-play">
            {typedFourthLine}
          </p>

          <div
            className={`mt-8 rounded-[40px] px-0 py-4 md:px-6 md:py-8 ${areCardsVisible ? "visible" : "invisible"
              }`}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-10 xl:grid-cols-3">
              {recommendationCards.map((card, index) => {
                const Icon = card.icon;

                const isFreeCard = freeRecommendationTitles.has(card.title);
                const loggedOutCardText = isFreeCard
                  ? "Login not required"
                  : "Login required";

                return (
                  <div
                    key={card.title}
                    className={`transition-all duration-300 ${index < visibleCardCount
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                  >
                    <article
                      onClick={() => handleCardClick(card)}
                      className="group cursor-pointer rounded-2xl bg-[#f1f1f3] px-3 py-5 text-center transition-colors duration-200 hover:bg-[#e8e8ed] md:rounded-none md:bg-transparent md:px-0 md:py-0 md:hover:bg-transparent"
                    >
                      <div className="md:hidden">
                        <Icon
                          size={24}
                          className="mx-auto text-black/80 transition-colors duration-200 group-hover:text-sky-500"
                        />
                        <h3 className="mt-2 text-nano font-bold uppercase leading-tight text-black/90 transition-colors duration-200 group-hover:text-sky-500 sm:text-[0.8rem]">
                          {card.title}
                        </h3>
                      </div>
                      <div className="hidden rounded-2xl bg-[#f1f1f3] px-4 py-5 shadow-[0_1px_0_rgba(255,255,255,0.7)] transition-colors duration-200 group-hover:bg-sky-500 md:block">
                        <div className="grid grid-cols-[24px_1fr] items-center gap-3 text-left pl-5">
                          <Icon
                            size={24}
                            className="shrink-0 text-black/80 transition-colors duration-200 group-hover:text-white"
                          />
                          <h3 className="text-nano font-bold uppercase leading-tight text-black/90 transition-colors duration-200 group-hover:text-white sm:text-[0.8rem] pl-5">
                            {card.title}
                          </h3>
                        </div>
                      </div>
                    </article>
                    {!isLoggedIn ? (
                      <p
                        className={`mt-2 text-[10px] font-semibold tracking-wide md:text-xs ${isFreeCard ? "text-primary-blue" : "text-black/70"
                          }`}
                      >
                        {loggedOutCardText}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* <div className="sticky bottom-0 z-10  bg-white/95 py-6 text-center text-nano text-gray-600 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        RoamIQ is in Beta and can make mistakes. Building the future of global
        explorer living, one update at a time. See Cookie Preferences.
      </div> */}
    </div>
  );
};

export default AiHome;
