import React, { useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const filters = [
  "Budget",
  "Internet",
  "Visa Duration",
  "Time Zone",
  "Continent",
];

const filterOptions = {
  Budget: ["Under $100", "$100 - $250", "$500 - $1,000", "$1,000+"],
  Internet: ["Under 25 Mbps", "25 - 50 Mbps", "50 - 100 Mbps", "100+ Mbps"],
  "Visa Duration": [
    "Up to 30 days",
    "31 - 90 days",
    "3 - 6 months",
    "6+ months",
  ],
  "Time Zone": ["Americas", "Europe/Africa", "Asia", "Oceania"],
  Continent: [
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Africa",
    "Oceania",
  ],
};

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

const AiSavingsSearchResults = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedFilter = state?.selectedFilter || "Budget";
  const selectedOption = state?.selectedOption || "Under $100";

  const [typedHeading, setTypedHeading] = useState("");
  const [activeFilter, setActiveFilter] = useState(selectedFilter);
  // const [orderedFilters, setOrderedFilters] = useState(
  //   state?.orderedFilters && state.orderedFilters.length
  //     ? state.orderedFilters
  //     : (() => {
  //         const selectedIndex = filters.indexOf(selectedFilter);

  //         if (selectedIndex <= 0) {
  //           return filters;
  //         }

  //         return [
  //           ...filters.slice(selectedIndex),
  //           ...filters.slice(0, selectedIndex),
  //         ];
  //       })(),
  // );
  const [currentSelectedOption, setCurrentSelectedOption] =
    useState(selectedOption);

  const [selectedHeadingFilter, setSelectedHeadingFilter] =
    useState(selectedFilter);
  const [headingAnimationKey, setHeadingAnimationKey] = useState(0);
  const [isFilterOptionsOpen, setIsFilterOptionsOpen] = useState(false);

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

  const handleFilterClick = (selectedBadge) => {
    setActiveFilter(selectedBadge);
    setIsFilterOptionsOpen((isOpen) =>
      selectedBadge === activeFilter ? !isOpen : true,
    );

    // setOrderedFilters((currentFilters) => {
    //   const selectedIndex = currentFilters.indexOf(selectedBadge);

    //   if (selectedIndex <= 0) {
    //     return currentFilters;
    //   }

    //   return [
    //     ...currentFilters.slice(selectedIndex),
    //     ...currentFilters.slice(0, selectedIndex),
    //   ];
    // });
  };

  const handleOptionClick = (option) => {
    setCurrentSelectedOption(option);
    setSelectedHeadingFilter(activeFilter);
    setHeadingAnimationKey((currentKey) => currentKey + 1);
    setIsFilterOptionsOpen(false);
  };

  const headingText =
    "As per your inputs, please find below the best destinations curated for you based on " +
    // `${selectedHeadingFilter.toLowerCase()} preference`;
    `savings preference`;

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
  }, [headingText, headingAnimationKey]);

  return (
    <div className="animate-fade-in min-h-full bg-surface">
      <main className="py-8">
        <div className="min-w-[75%] max-w-[80rem] lg:max-w-[80rem] mx-0 px-6 sm:px-6 lg:mx-auto lg:px-0">
          <div className=" glass-card py-6 px-4">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => navigate("/savings")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
                aria-label="Go back"
              >
                <HiOutlineArrowLeft size={18} />
              </button>

              <div className="flex flex-1 items-center rounded-full border border-glass-border bg-surface-50 px-4 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)] ml-20 mr-36 ">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200">
                    Under 2100$
                  </div>
                  {/* <div className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200">
                    {selectedHeadingFilter}
                  </div>
                  <div className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200">
                    {currentSelectedOption}
                  </div> */}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/savings")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-gray-400 transition-colors hover:bg-glass-hover hover:text-white"
                    aria-label="Clear search and go back"
                  >
                    <HiOutlineX size={24} />
                  </button>
                  <HiOutlineSearch size={34} className="text-accent" />
                </div>
              </div>
            </div>

            <div className="relative px-28">
              <div className="relative z-30 mt-6 mx-4">
                <div className="flex flex-wrap gap-8">
                  {/* {orderedFilters.map((filter) => { */}
                  {/* {filters.map((filter) => {
                    const isActive = filter === activeFilter;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => handleFilterClick(filter)}
                        className={`rounded-full border px-6 py-2 text-xs font-medium transition-colors lg:text-md ${
                          isActive
                            ? "border-accent bg-accent text-white"
                            : "border-gray-600 bg-surface-50 text-gray-200 hover:border-accent"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })} */}
                </div>

                {activeFilter && isFilterOptionsOpen && (
                  <div className="absolute left-0 top-full z-40 mt-4 w-full max-w-[220px]">
                    <ul className="space-y-2 rounded-lg border border-accent/50 bg-surface-50 px-2 py-2 shadow-card">
                      {filterOptions[activeFilter].map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            onClick={() => handleOptionClick(option)}
                            className="w-full rounded-md px-2 py-2 text-left text-sm text-gray-200 hover:bg-accent/10"
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative mt-8">
                {activeFilter && isFilterOptionsOpen && (
                  <button
                    type="button"
                    aria-label="Close filter options"
                    onClick={() => setIsFilterOptionsOpen(false)}
                    className="absolute inset-0 z-20 rounded-2xl bg-surface/55 backdrop-blur-[1px]"
                  />
                )}

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

export default AiSavingsSearchResults;
