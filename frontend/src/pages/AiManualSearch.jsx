import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setFormValues } from "../features/locationSlice";
import useAuth from "../hooks/useAuth";
import axios from "../utils/axios";

import { persistSelectedDestination } from "../utils/selectedDestinationSession";

const searchBarBadgeClassName =
  "inline-flex min-h-[40px] min-w-[5rem] items-center rounded-full border border-glass-border px-4 py-2 text-xs font-medium text-gray-200";
const contentAlignClassName = "md:px-10";

// const countOptions = [
//   { label: "1 - 5", value: "1-5" },
//   { label: "5 - 10", value: "5-10" },
//   { label: "10 - 25", value: "10-25" },
//   { label: "25+", value: "25+" },
// ];

const TYPING_INTERVAL_MS = 7;

const normalizeLocationKey = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

const getLocationKey = (country, state) =>
  `${normalizeLocationKey(country)}|${normalizeLocationKey(state)}`;

const DropdownBadge = ({
  label,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="relative w-full min-w-0 flex-1">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
          disabled
            ? "cursor-not-allowed border-glass-border bg-glass text-gray-500"
            : isOpen
              ? "border-accent bg-accent text-white"
              : "border-glass-border bg-surface-50 text-gray-200 hover:border-accent"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedValue}</span>
        <HiOutlineChevronDown
          size={18}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full z-40 mt-3 w-full min-w-[11rem] max-w-[calc(100vw-4rem)] rounded-2xl border border-accent/20 bg-surface-50 p-2 shadow-glass">
          <ul
            className="max-h-72 overflow-y-auto"
            role="listbox"
            aria-label={label}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => onSelect(option.value)}
                    className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-accent/10 font-medium text-accent"
                        : "text-gray-300 hover:bg-accent/10"
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const AiManualSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { continent: continentParam, country: countryParam } = useParams();
  const dispatch = useDispatch();
  const dropdownContainerRef = useRef(null);
  const { auth } = useAuth();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedContinent, setSelectedContinent] = useState(() =>
    continentParam ? decodeURIComponent(continentParam) : "",
  );
  const [selectedCountry, setSelectedCountry] = useState(() =>
    countryParam ? decodeURIComponent(countryParam) : "",
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [typedTopHeading, setTypedTopHeading] = useState("");

  const user = auth?.user || {};

  // [Removed special user email array during rebrand]

  const { data: locations = [] } = useQuery({
    queryKey: ["locations", user?.email],
    queryFn: async () => {
      try {
        const response = await axios.get("company/company-locations");
        const rawData = Array.isArray(response.data) ? response.data : [];

        // Filter: Keep only public states, drop countries with zero public states
        return rawData
          .map((country) => ({
            ...country,
            states: (country.states || []).filter((state) => state?.isPublic),
          }))
          .filter((country) => (country.states?.length || 0) > 0);
      } catch (error) {
        console.error(error?.response?.data?.message);
        return [];
      }
    },
  });

  const { data: destinationTitleLookup = new Map() } = useQuery({
    queryKey: ["state-wise-destination-titles"],
    queryFn: async () => {
      try {
        const response = await axios.get("state-wise-weight");
        const destinations = response?.data?.data || [];

        return new Map(
          destinations
            .filter((destination) => destination?.title && destination?.state)
            .map((destination) => [
              getLocationKey(destination.country, destination.state),
              destination.title,
            ]),
        );
      } catch (error) {
        console.error(error?.response?.data?.message);
        return new Map();
      }
    },
  });

  const continentOptions = useMemo(() => {
    const uniqueContinents = [
      ...new Set(locations.map((item) => item.continent).filter(Boolean)),
    ];

    return uniqueContinents
      .map((continent) => ({
        label: continent.charAt(0).toUpperCase() + continent.slice(1),
        value: continent.toLowerCase(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [locations]);

  const countryOptions = useMemo(() => {
    const filtered = selectedContinent
      ? locations.filter(
          (item) =>
            item.continent?.toLowerCase() === selectedContinent?.toLowerCase(),
        )
      : locations;

    return filtered
      .map((item) => ({
        label: item.country
          ? item.country.charAt(0).toUpperCase() + item.country.slice(1)
          : "",
        value: item.country?.toLowerCase(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [locations, selectedContinent]);

  const locationOptions = useMemo(() => {
    const countryData = locations.find(
      (item) => item.country?.toLowerCase() === selectedCountry?.toLowerCase(),
    );

    return (
      countryData?.states?.map((item) => ({
        label:
          destinationTitleLookup.get(
            getLocationKey(countryData.country, item.name),
          ) ||
          item.title ||
          item.name,
        value: item.name?.toLowerCase(),
      })) || []
    );
  }, [destinationTitleLookup, locations, selectedCountry]);

  const continentLabel =
    continentOptions.find((option) => option.value === selectedContinent)
      ?.label || "Continent";
  const countryLabel =
    countryOptions.find((option) => option.value === selectedCountry)?.label ||
    "Country";
  const locationLabel =
    locationOptions.find((option) => option.value === selectedLocation)
      ?.label || "Location";
  const topTypingIntervalRef = useRef(null);

  const hasAllSelections = Boolean(
    selectedContinent && selectedCountry && selectedLocation,
  );
  const initialTopHeadingText =
    "Please select one option from each below so that I can display the best curated results.";
  const selectedTopHeadingText =
    "Curating the best results for you. Click on Search to continue.";
  const searchBarBadges = [
    "Search Old School",
    selectedContinent && continentLabel,
    selectedCountry && countryLabel,
    selectedLocation && locationLabel,
  ].filter(Boolean);

  const handleDropdownToggle = (dropdownKey) => {
    setOpenDropdown((current) =>
      current === dropdownKey ? null : dropdownKey,
    );
  };

  const navigateToManualSearchStep = ({ continent = "", country = "" }) => {
    const encodedContinent = continent
      ? `/${encodeURIComponent(continent)}`
      : "";
    const encodedCountry = country ? `/${encodeURIComponent(country)}` : "";

    navigate({
      pathname: `/manual-search${encodedContinent}${encodedCountry}`,
      search: location.search,
    });
  };

  const navigateToSearchResults = ({ continent, country, location }) => {
    const formValues = {
      continent,
      country,
      location,
      category: "",
      count: "",
    };

    dispatch(setFormValues(formValues));

    const selectedLocationTitle =
      locationOptions.find((option) => option.value === location)?.label ||
      location;
    const badges = [
      "Search Old School",
      continentOptions.find((option) => option.value === continent)?.label,
      countryOptions.find((option) => option.value === country)?.label,
      selectedLocationTitle,
    ].filter(Boolean);

    persistSelectedDestination({
      continent,
      country,
      city: location,
      title: selectedLocationTitle,
    });

    navigate(
      `/ai-verticals?country=${encodeURIComponent(country)}&location=${encodeURIComponent(location)}`,
      {
        state: {
          selectedStateLabel: selectedLocationTitle,
          breadcrumbFilters: {
            continent,
            country,
            location,
          },
          searchBarBadges: badges,
        },
      },
    );
  };

  const handleSearch = () => {
    if (!hasAllSelections) return;

    navigateToSearchResults({
      continent: selectedContinent,
      country: selectedCountry,
      location: selectedLocation,
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    setSelectedContinent(
      continentParam ? decodeURIComponent(continentParam) : "",
    );
    setSelectedCountry(countryParam ? decodeURIComponent(countryParam) : "");
    setSelectedLocation("");
    setOpenDropdown(null);
  }, [continentParam, countryParam]);

  useEffect(() => {
    const clearTypingAnimations = () => {
      if (topTypingIntervalRef.current) {
        clearInterval(topTypingIntervalRef.current);
        topTypingIntervalRef.current = null;
      }
    };

    const animateTypedText = (text, setText, onComplete) => {
      setText("");

      if (!text) {
        onComplete?.();
        return null;
      }

      let currentIndex = 0;

      const intervalId = setInterval(() => {
        currentIndex += 1;
        setText(text.slice(0, currentIndex));

        if (currentIndex >= text.length) {
          clearInterval(intervalId);
          onComplete?.();
        }
      }, TYPING_INTERVAL_MS);

      return intervalId;
    };

    clearTypingAnimations();

    if (hasAllSelections) {
      topTypingIntervalRef.current = animateTypedText(
        selectedTopHeadingText,
        setTypedTopHeading,
      );
    } else {
      topTypingIntervalRef.current = animateTypedText(
        initialTopHeadingText,
        setTypedTopHeading,
      );
    }

    return () => {
      clearTypingAnimations();
    };
  }, [hasAllSelections, initialTopHeadingText, selectedTopHeadingText]);

  return (
    <div className="animate-fade-in min-h-full bg-surface">
      <main className="pb-8">
        <div className="mx-0 w-full max-w-none px-3 sm:max-w-[20rem] sm:px-6 lg:mx-auto lg:max-w-[85rem] lg:px-0 lg:min-w-[75%]">
          <div className="glass-card px-0 pb-6">
            <div className={`mt-6 mb-6 ${contentAlignClassName}`}>
              <p className="text-sm font-medium leading-snug text-gray-200 lg:text-[0.9rem] font-heading">
                {typedTopHeading}
              </p>
            </div>

            <div className={contentAlignClassName}>
              <div className="mt-4 hidden max-w-full items-center rounded-[30px] border border-glass-border bg-surface-50 px-4 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)] sm:flex">
                <div className="flex flex-wrap items-center gap-2">
                  {searchBarBadges.map((badgeLabel, index) => (
                    <div
                      key={`${badgeLabel}-${index}`}
                      className={searchBarBadgeClassName}
                    >
                      <span className="truncate">{badgeLabel}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-200 text-gray-400 transition-colors hover:bg-glass-hover hover:text-white"
                    aria-label="Clear search and go back"
                  >
                    <HiOutlineX size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className={`inline-flex items-center justify-center rounded-full p-1 transition-colors ${
                      hasAllSelections
                        ? "text-gray-200 hover:text-accent-hover"
                        : "cursor-not-allowed text-gray-500"
                    }`}
                    aria-label="Search listings"
                    disabled={!hasAllSelections}
                  >
                    <HiOutlineSearch size={34} />
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`relative mt-6 ${contentAlignClassName}`}
              ref={dropdownContainerRef}
            >
              <div className="relative z-30 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-3">
                <DropdownBadge
                  label="Continent"
                  options={continentOptions}
                  selectedValue={
                    selectedContinent ? continentLabel : "Select Continent"
                  }
                  isOpen={openDropdown === "continent"}
                  onToggle={() => handleDropdownToggle("continent")}
                  onSelect={(value) => {
                    setSelectedContinent(value);
                    setSelectedCountry("");
                    setSelectedLocation("");
                    setOpenDropdown(null);
                    navigateToManualSearchStep({ continent: value });
                  }}
                />

                <DropdownBadge
                  label="Country"
                  options={countryOptions}
                  selectedValue={
                    selectedCountry ? countryLabel : "Select Country"
                  }
                  isOpen={openDropdown === "country"}
                  onToggle={() => handleDropdownToggle("country")}
                  onSelect={(value) => {
                    setSelectedCountry(value);
                    setSelectedLocation("");
                    setOpenDropdown(null);
                    navigateToManualSearchStep({
                      continent: selectedContinent,
                      country: value,
                    });
                  }}
                  disabled={!selectedContinent}
                />

                <DropdownBadge
                  label="Location"
                  options={locationOptions}
                  selectedValue={
                    selectedLocation ? locationLabel : "Select Location"
                  }
                  isOpen={openDropdown === "location"}
                  onToggle={() => handleDropdownToggle("location")}
                  onSelect={(value) => {
                    setSelectedLocation(value);
                    setOpenDropdown(null);
                    navigateToSearchResults({
                      continent: selectedContinent,
                      country: selectedCountry,
                      location: value,
                    });
                  }}
                  disabled={!selectedCountry}
                />
              </div>

              {/* <div className="relative mt-8">
                <p className="text-3xl font-medium leading-snug text-gray-200 lg:text-lg font-heading">
                  Select one option from each badge above to view matching
                  destinations.
                </p>

                <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
                  Results will appear in list view after you complete all
                  filters and click search.
                </div>
              </div> */}
              {/* {typedBottomHeading && (
                <div className="relative mt-8">
                  <p className="text-sm font-medium leading-relaxed text-gray-200 lg:text-[0.9rem] font-heading">
                    {typedBottomHeading}
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiManualSearch;
