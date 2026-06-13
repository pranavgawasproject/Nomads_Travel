import React, { useEffect, useMemo, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AI_SAVINGS_TYPING_SEEN_KEY = "roamiq-ai-savings-typing-seen";

const filters = [
  // "Budget",
  "Monthly Income (USD)",
  // "Internet",
  "How much you want to save (USD)",
  // "Visa Duration",
  // "Time Zone",
  // "Continent",
];

const filterOptions = {
  // Budget: ["Under $100", "$100 - $250", "$500 - $1,000", "$1,000+"],
  "Monthly Income (USD)": [
    // "Under $100",
    "$1000 - $2500",
    "$5000 - $10,000",
    "$10,000+",
  ],
  // Internet: ["Under 25 Mbps", "25 - 50 Mbps", "50 - 100 Mbps", "100+ Mbps"],
  "How much you want to save (USD)": [
    // "Under $100",
    "$100 - $250",
    "$500 - $1,000",
    "$1,000+",
  ],
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

const AiSavingsSearch = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  // const [orderedFilters, setOrderedFilters] = useState(filters);

  const [typedHeading, setTypedHeading] = useState("");

  const headingText =
    "Please share the below details to find the best destinations for you";

  const selectedBadges = useMemo(
    () =>
      filters
        .filter((filter) => selectedOptions[filter])
        .map((filter) => ({
          filter,
          value: selectedOptions[filter],
        })),
    [selectedOptions],
  );

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AI_SAVINGS_TYPING_SEEN_KEY) === "true";

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
          window.localStorage.setItem(AI_SAVINGS_TYPING_SEEN_KEY, "true");
        }
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [headingText]);

  const handleFilterClick = (selectedFilter) => {
    setActiveFilter(selectedFilter);

    // setOrderedFilters((currentFilters) => {
    //   const selectedIndex = currentFilters.indexOf(selectedFilter);

    //   if (selectedIndex <= 0) {
    //     return currentFilters;
    //   }

    //   return [
    //     ...currentFilters.slice(selectedIndex),
    //     ...currentFilters.slice(0, selectedIndex),
    //   ];
    // });
  };

  const handleOptionClick = (selectedOption) => {
    if (!activeFilter) return;

    setSelectedOptions((currentOptions) => ({
      ...currentOptions,
      [activeFilter]: selectedOption,
    }));
  };

  const handleSearch = () => {
    navigate("/savings/results", {
      state: {
        selectedOptions,
      },
    });
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

          {/* <div className="mt-12 ml-28 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <TextField
              type="text"
              fullWidth
              inputMode="numeric"
              value={monthlyIncome}
              onChange={handleNumericInputChange(setMonthlyIncome)}
              label="Monthly Income (USD)"
              variant="standard"
              InputLabelProps={{ sx: floatingLabelSx }}
              inputProps={{ pattern: "[0-9]*", "aria-label": "Monthly Income" }}
            />

            <TextField
              type="text"
              fullWidth
              inputMode="numeric"
              value={savingsGoal}
              onChange={handleNumericInputChange(setSavingsGoal)}
              label="How much you want to save (USD)"
              variant="standard"
              InputLabelProps={{ sx: floatingLabelSx }}
              inputProps={{
                pattern: "[0-9]*",
                "aria-label": "How much you want to save",
              }}
            />
          </div> */}

          <div className="mt-6 ml-28 flex max-w-3xl items-center rounded-full border border-glass-border px-4 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
            <div className="flex w-full flex-wrap items-center gap-2">
              {selectedBadges.length ? (
                selectedBadges.map(({ filter, value }) => (
                  <div
                    key={filter}
                    className="rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200"
                  >
                    {`${filter}: ${value}`}
                  </div>
                ))
              ) : (
                <span className="text-base text-gray-500">
                  {/* Select one option from each badge below */}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-label="Search"
              className="ml-4 rounded-full p-2 text-accent"
              onClick={handleSearch}
            >
              <HiOutlineSearch size={36} />
            </button>
          </div>

          <div className="mt-6 ml-28 flex flex-wrap items-center justify-start gap-8">
            {/* {orderedFilters.map((filter) => { */}
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterClick(filter)}
                  className={`rounded-full border px-6 py-2 text-xs font-medium transition-colors ${isActive
                    ? "border-accent bg-accent text-white"
                    : "border-glass-border text-gray-200 hover:border-accent"
                    }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {activeFilter && (
            <div className="mx-auto mt-4 w-full max-w-3xl">
              <ul className="w-full max-w-[220px] space-y-2">
                {filterOptions[activeFilter].map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className="w-full rounded-md px-3 py-2 text-left text-[0.9rem] text-gray-200"
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

export default AiSavingsSearch;
