import {
  Box,
  MenuItem,
  Skeleton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Container from "../components/Container";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios.js";
import renderStars from "../utils/renderStarts.jsx";
import SkeletonCard from "../components/Skeletons/SkeletonCard.jsx";
import SkeletonMap from "../components/Skeletons/SkeletonMap.jsx";
import Select from "react-dropdown-select";
import { setFormValues } from "../features/locationSlice.js";
import ListingCard from "../components/ListingCard.jsx";
import newIcons from "../assets/newIcons.js";
import { IoSearch } from "react-icons/io5";
import SearchBarCombobox from "../components/SearchBarCombobox.jsx";
import AiSelectedBadgesSearchBar from "../components/AiSelectedBadgesSearchBar.jsx";
import { AnimatePresence, motion } from "motion/react";
import PaginatedGrid from "../components/PaginatedGrid.jsx";
import { Helmet } from "@dr.pogodin/react-helmet";
import useAuth from "../hooks/useAuth.js";
import {
  persistSelectedDestination,
  readSelectedDestination,
} from "../utils/selectedDestinationSession.js";
import {
  dedupeAiSearchBadges,
  buildAiVerticalsSearchBadges,
} from "../utils/aiSearchBarBadges.js";
import { DESTINATION_HIGHLIGHT_FILTERS } from "../data/aiDestinationHighlights.js";

const VALUE_ADDED_SERVICES_CATEGORY = "valueaddedservices";
const TYPING_INTERVAL_MS = 7;
const SECOND_HEADING_DELAY_MS = 250;
const THINKING_HEADING_TEXT = "Curating the best results for you";
const CURATED_RESULTS_HEADING_TEXT =
  "Please find below the best curated results from the options you suggested to me to help you discover and work from the best explorer destinations.";
const getAiVerticalsPageStateKey = (country = "", location = "") => {
  const countryKey = country.trim().toLowerCase();
  const locationKey = location.trim().toLowerCase();

  if (!countryKey || !locationKey) return null;
  return `ai-verticals-page-state:${countryKey}:${locationKey}`;
};

const HorizontalScrollWrapper = ({ children, title }) => {
  const scrollRef = React.useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth * 0.8
          : scrollLeft + clientWidth * 0.8;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  return (
    <div className="relative group/scroll mb-6">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-sm sm:text-base md:text-subtitle text-secondary-dark font-semibold truncate leading-tight">
          {title}
        </h2>
      </div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 md:gap-5 pb-2 custom-scrollbar-hide"
      >
        {children}
      </div>
    </div>
  );
};

const AiGlobalListingsMap = () => {
  const [favorites, setFavorites] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.location.formValues);
  const { handleSubmit, control, reset, setValue, getValues, watch } = useForm({
    defaultValues: {
      country: "",
      location: "",
      category: "",
    },
  });
  const { auth } = useAuth();
  const user = auth?.user || {};
  const userId = auth?.user?._id || auth?.user?.id;

  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobileOrTablet = isMobile || isTablet;

  const selectedCountry = watch("country");
  const selectedState = watch("location");

  const [persistedSearchBarBadges, setPersistedSearchBarBadges] = useState([]);

  const [typedHeading, setTypedHeading] = useState("");
  const [isSecondHeadingPhase, setIsSecondHeadingPhase] = useState(false);
  const [isHeadingSequenceComplete, setIsHeadingSequenceComplete] =
    useState(false);
  const listingPageStateStorageKey = useMemo(
    () =>
      getAiVerticalsPageStateKey(
        formData?.country || "",
        formData?.location || "",
      ),
    [formData?.country, formData?.location],
  );

  const searchBarBadges = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const selectedStateFromQuery =
      params.get("state") || params.get("location") || "";
    return buildAiVerticalsSearchBadges({
      locationState: location.state,
      selectedStateValue: selectedStateFromQuery,
      persistedBadges: persistedSearchBarBadges,
    });
  }, [location.search, location.state, persistedSearchBarBadges]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restoreKey = getAiVerticalsPageStateKey(
      (params.get("country") || "").trim().toLowerCase(),
      (params.get("state") || params.get("location") || "")
        .trim()
        .toLowerCase(),
    );

    if (typeof window !== "undefined" && restoreKey) {
      const hasSavedPageState = window.sessionStorage.getItem(restoreKey);

      if (hasSavedPageState) {
        setTypedHeading(CURATED_RESULTS_HEADING_TEXT);
        setIsSecondHeadingPhase(true);
        setIsHeadingSequenceComplete(true);
        return undefined;
      }
    }

    let timeoutId;
    let intervalId;
    const typeText = (text, onComplete) => {
      let index = 0;
      setTypedHeading("");
      intervalId = setInterval(() => {
        index += 1;
        setTypedHeading(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          onComplete?.();
        }
      }, TYPING_INTERVAL_MS);
    };
    setIsSecondHeadingPhase(false);
    setIsHeadingSequenceComplete(false);
    typeText(THINKING_HEADING_TEXT, () => {
      timeoutId = setTimeout(() => {
        setIsSecondHeadingPhase(true);
        typeText(CURATED_RESULTS_HEADING_TEXT, () =>
          setIsHeadingSequenceComplete(true),
        );
      }, SECOND_HEADING_DELAY_MS);
    });
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [location.search]);

  // [Removed special user email array during rebrand]

  const { data: locations = [], isLoading: isLocations } = useQuery({
    queryKey: ["locations", user?.email],
    queryFn: async () => {
      try {
        const response = await axios.get("company/company-locations");
        const rawData = Array.isArray(response.data) ? response.data : [];

        // Filter: Keep only public states, drop countries with zero public states
        return rawData
          .map((country) => ({
            ...country,
            states: (country.states || []).filter((s) => s?.isPublic),
          }))
          .filter((country) => (country.states?.length || 0) > 0);
      } catch (error) {
        console.error(error?.response?.data?.message);
        return [];
      }
    },
  });

  const continentOptions = React.useMemo(() => {
    const uniqueContinents = [
      ...new Set(locations.map((item) => item.continent).filter(Boolean)),
    ];
    return uniqueContinents
      .map((cont) => ({
        label: cont.charAt(0).toUpperCase() + cont.slice(1),
        value: cont.toLowerCase(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [locations]);

  const selectedContinent = watch("continent");

  const allCountryOptions = React.useMemo(() => {
    let filtered = locations;
    if (selectedContinent) {
      filtered = locations.filter(
        (item) =>
          item.continent?.toLowerCase() === selectedContinent?.toLowerCase(),
      );
    }

    return filtered
      .map((item) => ({
        label: item.country
          ? item.country.charAt(0).toUpperCase() + item.country.slice(1)
          : "",
        value: item.country?.toLowerCase(),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [locations, selectedContinent]);

  const countryOptions = useMemo(() => allCountryOptions, [allCountryOptions]);

  const filteredLocation = locations.find(
    (item) => item.country?.toLowerCase() === selectedCountry?.toLowerCase(),
  );

  const locationOptions = useMemo(() => {
    return (
      filteredLocation?.states?.map((item) => ({
        label: item.name,
        value: item.name?.toLowerCase(),
      })) || []
    );
  }, [filteredLocation]);

  const selectedLocationLabel = useMemo(() => {
    const routeStateLabel = location.state?.selectedStateLabel;
    const selectedDestination = readSelectedDestination();
    const normalizedCountry = formData?.country?.trim().toLowerCase();
    const normalizedLocation = formData?.location?.trim().toLowerCase();
    const sessionTitle =
      selectedDestination?.country === normalizedCountry &&
      selectedDestination?.city === normalizedLocation
        ? selectedDestination?.title
        : "";

    if (routeStateLabel) return routeStateLabel;
    if (sessionTitle) return sessionTitle;
    if (!formData?.location) return "";
    return (
      locationOptions.find(
        (option) => option.value?.toLowerCase() === normalizedLocation,
      )?.label || formData.location
    );
  }, [
    formData?.country,
    formData?.location,
    location.state?.selectedStateLabel,
    locationOptions,
  ]);

  const skeletonArray = Array.from({ length: 6 });
  const countOptions = [
    { label: "1 - 5", value: "1-5" },
    { label: "5 - 10", value: "5-10" },
    { label: "10 - 25", value: "10-25" },
    { label: "25+", value: "25+" },
  ];
  const typeLabels = {
    coworking: "Co-Working Spaces",
    coliving: "Co-Living Spaces",
    hostel: "Hostels",
    workation: "Workation",
    cafe: "Cafes",
    default: (type) => `${type[0].toUpperCase() + type.slice(1)} Spaces`,
  };

  const handleShowMoreClick = (type) => {
    const updatedForm = {
      ...formData,
      category: type,
    };

    dispatch(setFormValues(updatedForm));

    if (isMobileOrTablet) {
      setShowListings(true);
      return;
    }

    navigate(
      `/ai-listings?country=${formData.country}&location=${formData.location}&category=${type}`,
      {
        state: updatedForm,
      },
    );
  };

  const { data: listingsData, isPending: isLisitingLoading } = useQuery({
    queryKey: ["globallistings", formData],
    queryFn: async () => {
      const { country, location, category } = formData || {};

      const response = await axios.get(
        `company/companiesn?country=${country}&state=${location}&userId=${
          userId || ""
        }`,
      );

      return Array.isArray(response.data)
        ? response.data?.filter((item) => item?.companyType !== "privatestay")
        : [];
    },
    enabled: !!formData?.country && !!formData?.location,
    refetchOnMount: "always",
  });

  const sortedListings = useMemo(() => {
    if (!listingsData || listingsData.length === 0) return [];
    return [...listingsData].sort(
      (a, b) => (b.ratings || 0) - (a.ratings || 0),
    );
  }, [listingsData]);

  const categoryOptions = useMemo(() => {
    if (!listingsData || listingsData.length === 0) {
      return [
        ...DESTINATION_HIGHLIGHT_FILTERS,
        {
          label: "Value Adds",
          value: VALUE_ADDED_SERVICES_CATEGORY,
        },
      ];
    }

    const uniqueTypes = [
      ...new Set(
        listingsData
          .filter((item) => item.companyType !== "privatestay")
          .map((item) => item.companyType)
          .filter(Boolean)
          // Temporarily hide Workation from the category icon filters.
          .filter((type) => type !== "workation"),
      ),
    ];

    const labelMap = {
      coworking: "Co-Working",
      coliving: "Co-Living",
      hostel: "Hostels",
      workation: "Workation",
      meetingroom: "Meetings",
      cafe: "Cafe's",
      [VALUE_ADDED_SERVICES_CATEGORY]: "Value Added Services",
    };

    const typeOrder = [
      "coworking",
      "coliving",
      "hostel",
      "workation",
      "meetingroom",
      "cafe",
      VALUE_ADDED_SERVICES_CATEGORY,
    ];

    const result = uniqueTypes
      .map((type) => ({ label: labelMap[type] || type, value: type }))
      .sort((a, b) => typeOrder.indexOf(a.value) - typeOrder.indexOf(b.value));

    return [
      ...result.filter(
        (option) => option.value !== VALUE_ADDED_SERVICES_CATEGORY,
      ),
      ...DESTINATION_HIGHLIGHT_FILTERS,
      {
        label: "Value Adds",
        value: VALUE_ADDED_SERVICES_CATEGORY,
      },
    ];
  }, [listingsData]);

  const groupedListings = sortedListings?.reduce((acc, item) => {
    if (!acc[item.companyType]) acc[item.companyType] = [];
    acc[item.companyType].push(item);
    return acc;
  }, {});

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const navigate = useNavigate();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showListings, setShowListings] = useState(false);

  const onSubmit = (data) => {
    locationData(data);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedBadges = window.sessionStorage.getItem("aiSearchBarBadges");
    if (!savedBadges) return;

    try {
      const parsedBadges = JSON.parse(savedBadges);
      if (Array.isArray(parsedBadges)) {
        setPersistedSearchBarBadges(dedupeAiSearchBadges(parsedBadges));
      }
    } catch (error) {
      console.error("Failed to restore AI search badges", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || searchBarBadges.length < 2) return;

    window.sessionStorage.setItem(
      "aiSearchBarBadges",
      JSON.stringify(searchBarBadges),
    );
  }, [searchBarBadges]);

  useEffect(() => {
    setValue("continent", formData.continent);
    setValue("country", formData.country);
    setValue("location", formData.location);
    setValue("count", formData.count);
  }, [formData, setValue]);

  useEffect(() => {
    persistSelectedDestination({
      continent: formData.continent,
      country: formData.country,
      city: formData.location,
      title: selectedLocationLabel,
    });
  }, [
    formData.continent,
    formData.country,
    formData.location,
    selectedLocationLabel,
  ]);

  useEffect(() => {
    const breadcrumbFilters = location.state?.breadcrumbFilters;
    if (!breadcrumbFilters) return;

    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : value;

    const normalizedContinent = normalizeValue(breadcrumbFilters.continent);
    const normalizedCountry = normalizeValue(breadcrumbFilters.country);
    const normalizedLocation = normalizeValue(breadcrumbFilters.location);

    if (
      normalizedContinent === normalizeValue(formData.continent) &&
      normalizedCountry === normalizeValue(formData.country) &&
      normalizedLocation === normalizeValue(formData.location)
    ) {
      return;
    }

    const nextFormValues = {
      ...formData,
      continent: normalizedContinent || "",
      country: normalizedCountry || "",
      location: normalizedLocation || "",
    };

    dispatch(setFormValues(nextFormValues));
  }, [dispatch, formData, location.state]);

  const { mutate: locationData, isPending: isLocation } = useMutation({
    mutationFn: async (data) => {
      dispatch(setFormValues(data));
      navigate(
        `/ai-verticals?country=${data.country}&location=${data.location}`,
      );
      setShowMobileSearch(false);
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  const handleCategoryClick = (categoryValue) => {
    const currentFormData = getValues();

    if (!currentFormData.country || !currentFormData.location) {
      alert("Please select Country and Location first.");
      return;
    }

    if (
      DESTINATION_HIGHLIGHT_FILTERS.some(
        (filter) => filter.value === categoryValue,
      )
    ) {
      const params = new URLSearchParams({
        country: currentFormData.country,
        location: currentFormData.location,
        highlight: categoryValue,
      });
      navigate(`/ai-verticals?${params.toString()}`, {
        state: {
          ...location.state,
          selectedStateLabel: selectedLocationLabel,
          searchBarBadges,
        },
      });
      return;
    }

    dispatch(setFormValues({ ...currentFormData, category: categoryValue }));

    if (isMobileOrTablet && categoryValue !== VALUE_ADDED_SERVICES_CATEGORY) {
      setShowListings(true);
      // Optional: Clear mobile search if open
      setShowMobileSearch(false);
      return;
    }

    const state = {
      ...currentFormData,
      category: categoryValue,
    };

    setShowMobileSearch(false);
    setShowListings(false);

    const listingsPath =
      categoryValue === VALUE_ADDED_SERVICES_CATEGORY
        ? "/ai-listings-list"
        : "/ai-listings";

    navigate(
      `${listingsPath}?country=${currentFormData.country}&location=${currentFormData.location}&category=${state.category}`,
      {
        state: {
          country: currentFormData.country,
          location: currentFormData.location,
          category: categoryValue,
          searchBarBadges,
        },
      },
    );
  };

  const handleListingNavigation = (item) => {
    if (listingPageStateStorageKey) {
      window.sessionStorage.setItem(
        listingPageStateStorageKey,
        JSON.stringify({
          from: "map",
          savedAt: Date.now(),
        }),
      );
    }

    navigate(`/ai-listings/${encodeURIComponent(item.companyName)}`, {
      state: {
        breadcrumbLoading: true,
        companyId: item.companyId,
        type: item.companyType || "ss",
        selectedStateLabel: selectedLocationLabel,
        selectedFilters: location.state?.selectedFilters,
        searchBarBadges,
        breadcrumbFilters: {
          continent:
            formData?.continent ||
            location.state?.breadcrumbFilters?.continent ||
            "",
          country:
            formData?.country ||
            location.state?.breadcrumbFilters?.country ||
            "",
          location:
            formData?.location ||
            location.state?.breadcrumbFilters?.location ||
            "",
        },
        returnTo: {
          pathname: "/ai-verticals",
          search: location.search,
        },
      },
    });
  };

  const forMapsData = isLisitingLoading
    ? []
    : listingsData.map((item) => ({
        ...item,
        id: item._id,
        lat: item.latitude,
        lng: item.longitude,
        name: item.companyName,
        location: item.city,
        reviews: item.reviewCount,
        rating: item.ratings || 0,
        reviews: item.totalReviews || 0,
        image:
          item.images?.[0]?.url ||
          "https://biznest.co.in/assets/img/projects/subscription/Managed%20Workspace.webp",
      }));

  return (
    <>
      <Helmet>
        <title>RoamIQ | Explore Global Co-working & Stay Listings</title>
        <meta
          name="description"
          content="Discover top-rated coworking spaces, hostels, cafes, and workation stays across the world. Browse verified listings with reviews, maps, and amenities for remote workers and travelers."
        />
        <meta
          name="keywords"
          content="remote workers, coworking map, global listings, workation, hostels, cafes, coliving, remote work, Goa, stay and work"
        />
        <meta
          property="og:title"
          content="RoamIQ | Explore Global Co-working & Stay Listings"
        />
        <meta
          property="og:description"
          content="Explore the world's best coworking and coliving spaces on the RoamIQ global map — find, compare, and connect instantly."
        />
        <meta property="og:image" content="/images/map-preview.jpeg" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://yourdomain.com/ai-verticals" />
      </Helmet>

      {/* ==================== DESKTOP VIEW (lg and above) ==================== */}
      <div className="hidden lg:flex flex-col gap-6 px-1 md:px-10">
        <div className="min-w-[75%] max-w-[80rem] lg:max-w-[80rem] mx-0 lg:mx-auto px-1 sm:px-6 lg:px-0 w-full">
          <AiSelectedBadgesSearchBar
            badges={searchBarBadges}
            stateLabel={selectedLocationLabel}
            onBack={() => navigate(-1)}
            onClear={() => navigate("/search/results")}
            heading={
              <p className="mt-6 mb-6 flex items-center gap-2 text-sm font-medium leading-snug text-black/85 lg:text-[0.8rem] font-play">
                {!isSecondHeadingPhase && (
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-b-transparent"
                    aria-hidden="true"
                  />
                )}
                {typedHeading}
              </p>
            }
            className="mb-2"
            fullWidth
          />
        </div>
        <div
          className={`${isHeadingSequenceComplete ? "flex" : "hidden"} flex-col gap-4 justify-center items-center w-full`}
        >
          <div className="w-full px-0">
            <div className="flex flex-col gap-4 justify-between items-center">
              <div className="w-full pb-4">
                <div className="flex justify-between items-center">
                  {categoryOptions.map((cat) => {
                    const iconSrc = newIcons[cat.value];
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className="text-black px-1 py-2 hover:text-black transition flex items-center justify-center w-full"
                      >
                        {iconSrc ? (
                          <div className="h-10 w-full flex flex-col gap-0">
                            <img
                              src={iconSrc}
                              alt={cat.label}
                              className="h-full w-full object-contain"
                            />
                            <span className="text-tiny">{cat.label}</span>
                          </div>
                        ) : (
                          cat.label
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex justify-around md:w-full lg:w-full border-2 bg-gray-50 rounded-full p-0 items-center"
              >
                <Controller
                  name="continent"
                  control={control}
                  render={({ field }) => (
                    <SearchBarCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={continentOptions}
                      label="Select Continent"
                      placeholder="Select continent"
                      className="w-full"
                    />
                  )}
                />
                <div className="w-px h-10 bg-gray-300 mx-2 my-auto" />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <SearchBarCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={countryOptions}
                      label="Select Country"
                      placeholder="Select aspiring destination"
                      disabled={!selectedContinent}
                      className="w-full"
                    />
                  )}
                />
                <div className="w-px h-10 bg-gray-300 mx-2 my-auto" />
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <SearchBarCombobox
                      value={field.value}
                      onChange={field.onChange}
                      label="Select Location"
                      options={locationOptions}
                      placeholder="Select area within country"
                      disabled={!selectedCountry}
                      className="w-full"
                    />
                  )}
                />
                <div className="w-px h-10 bg-gray-300 mx-2 my-auto" />
                <Controller
                  name="count"
                  control={control}
                  render={({ field }) => (
                    <SearchBarCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={countOptions}
                      label="Select Count"
                      placeholder="Booking for no. of Explorers"
                      disabled={!selectedState}
                      className="w-full"
                    />
                  )}
                />
                <button
                  type="submit"
                  className="w-fit h-full bg-[#FF5757] text-white p-5 text-subtitle rounded-full"
                >
                  <IoSearch />
                </button>
              </form> */}
            </div>
          </div>
        </div>

        <div className={isHeadingSequenceComplete ? "block" : "hidden"}>
          <Container padding={false}>
            <div className="">
              <div className="font-semibold text-md grid grid-cols-9 gap-4 pt-3">
                <div className="custom-scrollbar-hide col-span-5">
                  {isLisitingLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  ) : (
                    <div className="col-span-full mb-6">
                      <PaginatedGrid
                        data={
                          isLisitingLoading ? skeletonArray : sortedListings
                        }
                        allowScroll={false}
                        entriesPerPage={9}
                        persistPage={true}
                        persistKey="verticalsListingsPage"
                        columns={`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5`}
                        renderItem={(item, index) =>
                          isLisitingLoading ? (
                            <Box key={index} className="w-full h-full">
                              <Skeleton
                                variant="rectangular"
                                height={200}
                                sx={{ borderRadius: 2 }}
                              />
                              <Skeleton
                                variant="text"
                                width="80%"
                                sx={{ mt: 1 }}
                              />
                              <Skeleton variant="text" width="60%" />
                            </Box>
                          ) : (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                ease: "easeOut",
                              }}
                            >
                              <ListingCard
                                item={item}
                                showVertical={true}
                                handleNavigation={() =>
                                  handleListingNavigation(item)
                                }
                              />
                            </motion.div>
                          )
                        }
                      />
                    </div>
                  )}
                </div>
                <div className="col-span-4 sticky top-24 h-screen lg:h-[68%] pb-10">
                  <div className="rounded-xl h-full overflow-hidden">
                    {isLisitingLoading ? (
                      <SkeletonMap />
                    ) : forMapsData?.length ? (
                      <Map locations={forMapsData} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-sm border border-dotted rounded-lg">
                        Map data not available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ==================== MOBILE/TABLET VIEW (below lg) ==================== */}
      <div className="lg:hidden flex flex-col gap-2">
        {/* Floating Search Bar & Collection Chips - Always Visible */}
        {!showMobileSearch && (
          <div className="fixed top-[70px] left-0 right-0 z-[1001] flex flex-col items-center gap-2 px-4 pointer-events-none">
            {/* Floating Search Bar */}
            <button
              onClick={() => setShowMobileSearch(true)}
              className="pointer-events-auto w-full max-w-[320px] bg-white shadow-2xl rounded-full py-2 px-4 flex items-center justify-between border border-gray-100 hover:scale-[1.02] transition-transform active:scale-95"
              style={{ boxShadow: "0 8px 16px rgba(0,0,0,0.15)" }}
            >
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="text-[11px] font-bold text-gray-900 truncate w-full text-left">
                  {`${(formData?.country || "Country").charAt(0).toUpperCase() + (formData?.country || "Country").slice(1)} . ${
                    formData?.location
                      ? formData.location
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(" ")
                      : "Unknown"
                  } . ${
                    formData?.category
                      ? categoryOptions.find(
                          (c) => c.value === formData.category,
                        )?.label ||
                        formData.category.charAt(0).toUpperCase() +
                          formData.category.slice(1)
                      : "All"
                  }`}
                </span>
              </div>
              <div className="bg-[#FF5757] p-1.5 rounded-full text-white ml-2 flex-shrink-0 shadow-sm">
                <IoSearch size={16} />
              </div>
            </button>

            {/* Collection/Category Chips */}
            <div className="pointer-events-auto w-full max-w-[450px] flex overflow-x-auto gap-2 pb-2 scrollbar-hide scroll-smooth snap-x">
              {[{ label: "All", value: "" }, ...categoryOptions].map((cat) => {
                const isActive = cat.value === formData?.category;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryClick(cat.value)}
                    className={`flex-shrink-0 snap-start px-4 py-1.5 rounded-full text-[11px] font-semibold shadow-md transition-colors ${
                      isActive
                        ? "bg-blue-50 border border-primary-blue text-primary-blue"
                        : "bg-white/95 backdrop-blur-md border border-gray-200 text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Search Modal */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[1002] flex items-start justify-center lg:hidden bg-white"
            >
              <motion.div className="bg-white shadow-2xl overflow-auto p-4 rounded-b-3xl h-screen w-full">
                <div className="flex justify-between items-center mb-10">
                  <div>&nbsp;</div>
                  <h3 className="text-xl font-semibold">Search</h3>
                  <button
                    onClick={() => {
                      setShowMobileSearch(false);
                    }}
                    className="text-gray-500 text-xl p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    &times;
                  </button>
                </div>
                {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Controller
                    name="continent"
                    control={control}
                    render={({ field }) => (
                      <SearchBarCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={continentOptions}
                        label="Select Continent"
                        placeholder="Select continent"
                        className="w-full"
                      />
                    )}
                  />
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <SearchBarCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={countryOptions}
                        label="Select Country"
                        placeholder="Select aspiring destination"
                        disabled={!selectedContinent}
                        className="w-full"
                      />
                    )}
                  />
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <SearchBarCombobox
                        value={field.value}
                        onChange={field.onChange}
                        label="Select Location"
                        options={locationOptions}
                        placeholder="Select area within country"
                        disabled={!selectedCountry}
                        className="w-full"
                      />
                    )}
                  />
                  <Controller
                    name="count"
                    control={control}
                    render={({ field }) => (
                      <SearchBarCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={countOptions}
                        label="Select Count"
                        placeholder="Booking for no. of Explorers"
                        disabled={!selectedState}
                        className="w-full"
                      />
                    )}
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#FF5757] text-white py-5 rounded-full"
                  >
                    <IoSearch className="inline mr-2" />
                    Search
                  </button>
                </form> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Container */}
        <Container padding={false}>
          <div className="pt-16">
            {" "}
            {/* Add padding to account for floating search bar */}
            <div className="font-semibold text-md grid grid-cols-9 gap-4 pt-3">
              <div className="col-span-full fixed inset-0 lg:relative lg:inset-auto h-screen pb-10 z-40">
                <div className="h-full w-full rounded-xl overflow-hidden">
                  {isLisitingLoading ? (
                    <SkeletonMap />
                  ) : forMapsData?.length ? (
                    <Map locations={forMapsData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm border border-dotted rounded-lg">
                      Map data not available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>

        {/* Bottom Sheet Listings */}
        <AnimatePresence>
          {!showMobileSearch && (
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.05}
              onDragEnd={(_, info) => {
                const isDraggingDown =
                  info.offset.y > 60 || info.velocity.y > 600;
                const isDraggingUp =
                  info.offset.y < -60 || info.velocity.y < -600;
                if (isDraggingDown) {
                  setShowListings(false);
                } else if (isDraggingUp) {
                  setShowListings(true);
                }
              }}
              initial={{ y: "100%" }}
              animate={{
                y: showListings ? "0%" : "40%",
              }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                velocity: 2,
              }}
              className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-[1100] px-6 rounded-t-[24px] lg:hidden ${
                showListings ? "h-[calc(100vh-180px)]" : "h-[25vh]"
              }`}
            >
              <div
                className="flex justify-center py-4 sticky top-0 z-10 bg-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowListings((prev) => !prev);
                }}
              >
                <div className="w-12 h-1.5 rounded-full bg-gray-300"></div>
              </div>

              <div
                className={`custom-scrollbar-hide py-6 overscroll-contain transition-all duration-300 ${
                  showListings
                    ? "overflow-y-auto h-[calc(75vh-70px)]"
                    : "overflow-hidden mb-10"
                }`}
                style={{
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                }}
              >
                {/* Changes Start: Conditional rendering for Drawer content */}
                {formData?.category ? (
                  <div className="pb-20">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm sm:text-base md:text-subtitle text-secondary-dark font-semibold truncate leading-tight">
                        {`Popular ${categoryOptions.find((c) => c.value === formData.category)?.label || "Listings"} in ${
                          selectedLocationLabel || "Unknown"
                        }`}
                      </h2>
                    </div>
                    {isLisitingLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <SkeletonCard key={i} />
                        ))
                      : (() => {
                          const filteredItems = listingsData.filter(
                            (item) => item.companyType === formData.category,
                          );
                          return filteredItems.length > 0 ? (
                            <div className="pb-1">
                              <PaginatedGrid
                                data={filteredItems}
                                entriesPerPage={isMobile ? 10 : 12}
                                scrollToTop={false}
                                columns={`grid-cols-2 md:grid-cols-3 gap-3`}
                                renderItem={(item, index) => (
                                  <ListingCard
                                    key={item._id}
                                    item={item}
                                    showVertical={true}
                                    handleNavigation={() =>
                                      handleListingNavigation(item)
                                    }
                                  />
                                )}
                              />
                            </div>
                          ) : (
                            <div className="text-center py-10 text-gray-500">
                              No listings found for this category.
                            </div>
                          );
                        })()}
                  </div>
                ) : (
                  // Existing Grouped View
                  <>
                    {isLisitingLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    ) : groupedListings &&
                      Object.keys(groupedListings).length > 0 ? (
                      Object.entries(groupedListings).map(([type, items]) => {
                        const prioritizedCompanies = ["MeWo", "BIZ Nest"];
                        const sortedItems = items.sort((a, b) => {
                          const aPriority = prioritizedCompanies.includes(
                            a.companyName,
                          )
                            ? 0
                            : 1;
                          const bPriority = prioritizedCompanies.includes(
                            b.companyName,
                          )
                            ? 0
                            : 1;
                          return (
                            aPriority - bPriority ||
                            (b.ratings || 0) - (a.ratings || 0)
                          );
                        });

                        const hasMore = sortedItems.length > 5;
                        const itemsToShow = hasMore
                          ? sortedItems.slice(0, 5)
                          : sortedItems;
                        const location =
                          formData?.location?.charAt(0).toUpperCase() +
                          formData?.location?.slice(1);

                        const sectionTitle = `Popular ${
                          typeLabels[type] || typeLabels.default(type)
                        } in ${location || ""}`;

                        return (
                          <HorizontalScrollWrapper
                            key={type}
                            title={sectionTitle}
                          >
                            {itemsToShow.map((item) => (
                              <div
                                key={item._id}
                                className="w-[calc(85%-0.5rem)] md:w-[calc(33.33%-1.25rem)] lg:w-[calc(20%-1.5rem)] flex-shrink-0 snap-start"
                              >
                                <ListingCard
                                  item={item}
                                  handleNavigation={() =>
                                    handleListingNavigation(item)
                                  }
                                />
                              </div>
                            ))}
                            {hasMore && (
                              <div className="w-[calc(85%-0.5rem)] md:w-[calc(33.33%-1.25rem)] lg:w-[calc(20%-1.5rem)] flex-shrink-0 snap-start">
                                <button
                                  onClick={() => handleShowMoreClick(type)}
                                  className="w-full aspect-square border-2 border-gray-100 rounded-3xl flex flex-col items-center justify-start pt-12 gap-3 hover:border-primary-blue hover:shadow-md transition-all bg-gray-50/30 group"
                                >
                                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                      />
                                    </svg>
                                  </div>
                                  <span className="text-lg font-medium text-gray-600 group-hover:text-gray-900">
                                    View All
                                  </span>
                                </button>
                              </div>
                            )}
                          </HorizontalScrollWrapper>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center text-sm text-gray-500 border border-dotted rounded-lg p-4">
                        No listings found.
                      </div>
                    )}
                  </>
                )}
                {/* Changes End */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating List Toggle Button (Mobile Only) */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1200]">
        <button
          onClick={() =>
            navigate(
              `/ai-verticals?country=${formData?.country}&location=${formData?.location}`,
              {
                state: {
                  ...location.state,
                  selectedStateLabel: selectedLocationLabel,
                  selectedFilters: location.state?.selectedFilters,
                  searchBarBadges,
                  breadcrumbFilters: {
                    continent:
                      formData?.continent ||
                      location.state?.breadcrumbFilters?.continent ||
                      "",
                    country:
                      formData?.country ||
                      location.state?.breadcrumbFilters?.country ||
                      "",
                    location:
                      formData?.location ||
                      location.state?.breadcrumbFilters?.location ||
                      "",
                  },
                },
              },
            )
          }
          className="bg-[#222222] text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-transform active:scale-95"
        >
          <span className="text-sm font-semibold tracking-wide">Show list</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            style={{
              display: "block",
              height: "16px",
              width: "16px",
              fill: "white",
            }}
          >
            <path d="M7 10h18v2H7zm0 5h18v2H7zm0 5h18v2H7z"></path>
          </svg>
        </button>
      </div>
    </>
  );
};

export default AiGlobalListingsMap;
