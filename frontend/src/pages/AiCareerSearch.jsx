import React, { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

const AI_CAREER_TYPING_SEEN_KEY = "roamiq-ai-career-typing-seen";

const filters = [
  // "Budget",
  "Enter Budget (USD)",
  // "Internet",
  // "Visa Duration",
  // "Time Zone",
  // "Continent",
];

const filterOptions = {
  // Budget: ["Under $100", "$100 - $250", "$500 - $1,000", "$1,000+"],
  "Enter Budget (USD)": [
    "Under $100",
    "$100 - $250",
    "$500 - $1,000",
    "$1,000+",
  ],
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

const AiBudgetSearch = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  // const [orderedFilters, setOrderedFilters] = useState(filters);

  const [typedHeading, setTypedHeading] = useState("");

  const headingText =
    "Please share the below details to find the best destinations for you";

  const floatingLabelSx = {
    color: "black",
    "&.Mui-focused": { color: "#1976d2" },
    "&.MuiInputLabel-shrink": { color: "#1976d2" },
  };

  useEffect(() => {
    const hasSeenTypingEffect =
      typeof window !== "undefined" &&
      window.localStorage.getItem(AI_CAREER_TYPING_SEEN_KEY) === "true";

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
          window.localStorage.setItem(AI_CAREER_TYPING_SEEN_KEY, "true");
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

    navigate("/career-search/results", {
      state: {
        selectedFilter: activeFilter,
        selectedOption,
        // orderedFilters,
        orderedFilters: filters,
      },
    });
  };
  const handleNumericInputChange = (setter) => (event) => {
    const numericValue = event.target.value.replace(/\D/g, "");
    setter(numericValue);
  };

  return (
    <div className="min-h-full bg-white">
      <main className="px-6 py-12 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between">
            <div></div>
            <h1 className="text-left text-[1.43rem] font-medium text-black/90 w-full px-28">
              {typedHeading}
            </h1>
            <div></div>
          </div>

          <div className="mt-12 ml-28 flex max-w-sm flex-col gap-3 sm:flex-row justify-center">
            {/* <TextField
              type="text"
              fullWidth
              inputMode="numeric"
              value={monthlyIncome}
              onChange={handleNumericInputChange(setMonthlyIncome)}
              label="Enter Budget (USD)"
              variant="standard"
              InputLabelProps={{ sx: floatingLabelSx }}
              inputProps={{ pattern: "[0-9]*", "aria-label": "Enter Budget" }}
            /> */}

            {/* <TextField
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
            /> */}
          </div>

          <div className="mt-6 ml-28 flex max-w-3xl items-center rounded-full border border-black/15 px-4 py-0 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
            <input
              type="text"
              aria-label="Search destinations"
              className="w-full border-none bg-transparent text-xl text-black/80 outline-none placeholder:text-black/30 "
            />
            <button
              type="button"
              aria-label="Search"
              className="ml-4 rounded-full  p-2 text-black/90"
              onClick={() => navigate("/career-search/results")}
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
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-black text-black/90 hover:border-sky-500"
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
                      className="w-full rounded-md px-3 py-2 text-left text-[0.9rem] text-black/90"
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

export default AiBudgetSearch;
