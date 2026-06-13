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
import { CiSearch } from "react-icons/ci";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Container from "../components/Container";
import { useLocation, useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { useDispatch, useSelector } from "react-redux";
import axios from "../utils/axios.js";
import renderStars from "../utils/renderStarts.jsx";
import SkeletonCard from "../components/Skeletons/SkeletonCard.jsx";
import SkeletonMap from "../components/Skeletons/SkeletonMap.jsx";
import Select from "react-dropdown-select";
import { setFormValues } from "../features/locationSlice.js";
import { useSearchParams } from "react-router-dom";
import ListingCard from "../components/ListingCard.jsx";
import PaginatedGrid from "../components/PaginatedGrid.jsx";
import newIcons from "../assets/newIcons.js";
import { DESTINATION_HIGHLIGHT_FILTERS } from "../data/aiDestinationHighlights.js";
import SearchBarCombobox from "../components/SearchBarCombobox.jsx";
import AiSelectedBadgesSearchBar from "../components/AiSelectedBadgesSearchBar.jsx";
import { IoSearch } from "react-icons/io5";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { AnimatePresence, motion } from "motion/react";
import useAuth from "../hooks/useAuth.js";
import {
  persistSelectedDestination,
  readSelectedDestination,
} from "../utils/selectedDestinationSession.js";

const VALUE_ADDED_SERVICES_CATEGORY = "valueaddedservices";
const TYPING_INTERVAL_MS = 7;
const SECOND_HEADING_DELAY_MS = 250;
const THINKING_HEADING_TEXT = "Curating the best results for you";
const CURATED_RESULTS_HEADING_TEXT =
  "Please find below the best curated results from the options you suggested to me to help you discover and work from the best explorer destinations.";

const valueAddedServiceItems = [
  {
    label: "ANY VISA SUPPORT",
    path: "/visa-support",
    imageUrl:
      // "https://img.magnific.com/free-photo/american-visa-document_1101-820.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.magnific.com/free-photo/american-visa-document_1101-820.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    label: "OVERALL ACTIVATION SUPPORT",
    path: "/overall-activation-support",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbhxwe7kd7j-UFpFp7tS2Ka0_L2iZ_zI_07Q&s",
  },
  {
    label: "NEW COMPANY SUPPORT",
    path: "/new-company-setup",
    imageUrl:
      "https://3.imimg.com/data3/KB/OY/MY-1439773/new-business-setup.jpg",
  },
  {
    label: "ANY CONSULTATION SUPPORT",
    path: "/consultation",
    imageUrl:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29uc3VsdGF0aW9ufGVufDB8fDB8fHww",
  },
  {
    label: "APPLY FOR JOB",
    badge: "Coming soon",
    imageUrl:
      "https://img.freepik.com/premium-vector/people-seeking-jobs-internet-job-search-recruitment_773186-499.jpg?semt=ais_hybrid&w=740&q=80",
  },
  // {
  //   label: "VIEW LOCATION BLOGS",
  //   path: "/ai-blogs",
  //   usesSelectedLocation: true,
  // },
  // {
  //   label: "VIEW LOCATION NEWS",
  //   path: "/ai-news",
  //   usesSelectedLocation: true,
  // },
];

const AiListings = ({ forceListView = false }) => {
  const [resetPageKey, setResetPageKey] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const location = useLocation();
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

  // [Removed special user email array during rebrand]

  const selectedCountry = watch("country");
  const selectedState = watch("location");

  const [persistedSearchBarBadges, setPersistedSearchBarBadges] = useState([]);

  const [typedHeading, setTypedHeading] = useState("");
  const [isSecondHeadingPhase, setIsSecondHeadingPhase] = useState(false);
  const [isHeadingSequenceComplete, setIsHeadingSequenceComplete] =
    useState(false);

  const searchBarBadges = useMemo(() => {
    const formatBadgeValue = (value) =>
      value
        ?.split(/[-_\s]+/)
        .filter(Boolean)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
        )
        .join(" ");
    const selectedStateDisplayLabel =
      location.state?.selectedStateLabel ||
      formatBadgeValue(readSelectedDestination()?.title || "");

    const params = new URLSearchParams(location.search);
    const selectedStateFromQuery =
      params.get("state") || params.get("location") || "";
    const selectedStateBadge =
      selectedStateDisplayLabel || formatBadgeValue(selectedStateFromQuery);
    const locationStateBadges = location.state?.searchBarBadges;

    const replaceTrailingLocationBadge = (badges) => {
      const cleanedBadges = badges.filter(Boolean);
      if (!selectedStateBadge) return cleanedBadges;

      if (cleanedBadges.length === 0) return [selectedStateBadge];

      // If the last badge is already the selected state, just return
      const lastBadge = cleanedBadges[cleanedBadges.length - 1];
      if (lastBadge?.toLowerCase() === selectedStateBadge.toLowerCase()) {
        return cleanedBadges;
      }

      // Check if the selected state is already in the badges but not at the end
      const badgesWithoutSelected = cleanedBadges.filter(
        (b) => b.toLowerCase() !== selectedStateBadge.toLowerCase(),
      );

      // Re-add it to the end
      return [...badgesWithoutSelected, selectedStateBadge];
    };

    if (Array.isArray(locationStateBadges) && locationStateBadges.length > 0) {
      return replaceTrailingLocationBadge(locationStateBadges);
    }

    if (persistedSearchBarBadges.length > 0) {
      return replaceTrailingLocationBadge(persistedSearchBarBadges);
    }

    return selectedStateBadge ? [selectedStateBadge] : [];
  }, [location.search, location.state, persistedSearchBarBadges]);

  useEffect(() => {
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
  }, []);
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

  // const countryOptions = locations
  //   .map((item) => ({
  //     label: item.country?.charAt(0).toUpperCase() + item.country?.slice(1),
  //     value: item.country?.toLowerCase(),
  //   }))
  //   .sort((a, b) => a.label.localeCompare(b.label));

  // const filteredLocation = locations.find(
  //   (item) => item.country?.toLowerCase() === selectedCountry?.toLowerCase()
  // );
  // const locationOptions = filteredLocation?.states?.map((item) => ({
  //   label: item,
  //   value: item?.toLowerCase(),
  // }));

  // 👇 Add this line before building countries
  const selectedContinent = watch("continent");

  // Build countries based on selected continent
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

  const countryOptions = React.useMemo(
    () => allCountryOptions,
    [allCountryOptions],
  );

  const filteredLocation = locations.find(
    (item) => item.country?.toLowerCase() === selectedCountry?.toLowerCase(),
  );

  const locationOptions = React.useMemo(() => {
    return (
      filteredLocation?.states?.map((item) => ({
        label: item.name,
        value: item.name?.toLowerCase(),
      })) || []
    );
  }, [filteredLocation]);

  const countOptions = [
    { label: "1 - 5", value: "1-5" },
    { label: "5 - 10", value: "5-10" },
    { label: "10 - 25", value: "10-25" },
    { label: "25+", value: "25+" },
  ];
  // const categoryOptions = [
  //   { label: "Co-Working", value: "coworking" },
  //   // { label: "Co-Living", value: "coliving" },
  //   { label: "Hostels", value: "hostel" },
  //   { label: "Workation", value: "workation" },
  //   { label: "Private Stay", value: "privatestay" },
  //   { label: "Meetings", value: "meetingroom" },
  //   { label: "Cafe’s", value: "cafe" },
  // ];

  const activeCategory = searchParams.get("category");

  const skeletonArray = Array.from({ length: 6 });

  const { data: listingsData = [], isPending: isLisitingLoading } = useQuery({
    queryKey: ["listings", formData],
    queryFn: async () => {
      const { country, location } = formData || {};
      const response = await axios.get(
        `company/companiesn?country=${country}&state=${location}&userId=${
          userId || ""
        }`,
      );

      return Array.isArray(response.data)
        ? response.data.filter((item) => item?.companyType !== "privatestay")
        : [];
    },
    enabled: !!formData?.country && !!formData?.location,
    refetchOnMount: "always", // ✅ forces refetch on every mount
  });

  const categoryOptions = React.useMemo(() => {
    if (isLisitingLoading) {
      return [];
    }

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
      // privatestay: "Private Stay",
      meetingroom: "Meetings",
      cafe: "Cafe’s",
    };

    const typeOrder = [
      "coworking",
      "coliving",
      "hostel",
      "workation",
      // "privatestay",
      "meetingroom",
      "cafe",
      VALUE_ADDED_SERVICES_CATEGORY,
    ];

    const options = uniqueTypes
      .map((type) => ({ label: labelMap[type] || type, value: type }))
      .sort((a, b) => typeOrder.indexOf(a.value) - typeOrder.indexOf(b.value));

    return [
      ...options.filter(
        (option) => option.value !== VALUE_ADDED_SERVICES_CATEGORY,
      ),
      ...DESTINATION_HIGHLIGHT_FILTERS,
      { label: "Value Adds", value: VALUE_ADDED_SERVICES_CATEGORY },
    ];
  }, [isLisitingLoading, listingsData]);

  const categoryBadgeLabel = useMemo(() => {
    if (!formData?.category) return "";

    const matchedCategory = categoryOptions.find(
      (category) => category.value === formData.category,
    );

    if (matchedCategory?.label) return matchedCategory.label;

    const fallbackLabelMap = {
      coworking: "Co-Working",
      coliving: "Co-Living",
      hostel: "Hostels",
      workation: "Workation",
      meetingroom: "Meetings",
      cafe: "Cafe’s",
      [VALUE_ADDED_SERVICES_CATEGORY]: "Value Added Services",
    };

    return (
      fallbackLabelMap[formData.category] ||
      `${formData.category.charAt(0).toUpperCase()}${formData.category.slice(1)}`
    );
  }, [categoryOptions, formData?.category]);

  const badgesWithCategory = useMemo(() => {
    const baseBadges = searchBarBadges.filter(Boolean);
    if (!categoryBadgeLabel) return baseBadges;

    return [...baseBadges, categoryBadgeLabel];
  }, [searchBarBadges, categoryBadgeLabel]);

  const filteredListings = React.useMemo(() => {
    if (!listingsData) return [];
    if (formData?.category === VALUE_ADDED_SERVICES_CATEGORY) return [];

    if (!formData?.category) return listingsData;

    const categoryResults = listingsData.filter(
      (item) => item.companyType === formData.category,
    );

    // ✅ If no listings match the selected category, fallback to all listings
    // return categoryResults.length > 0 ? categoryResults : listingsData;
    if (categoryResults.length === 0) return listingsData;

    return [...categoryResults].sort((a, b) => {
      const aRating = Number.parseFloat(a.ratings) || 0;
      const bRating = Number.parseFloat(b.ratings) || 0;

      return bRating - aRating;
    });
  }, [listingsData, formData?.category]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedBadges = window.sessionStorage.getItem("aiSearchBarBadges");
    if (!savedBadges) return;

    try {
      const parsedBadges = JSON.parse(savedBadges);
      if (Array.isArray(parsedBadges)) {
        setPersistedSearchBarBadges(parsedBadges.filter(Boolean));
      }
    } catch (error) {
      console.error("Failed to restore AI search badges", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || searchBarBadges.length === 0) return;

    window.sessionStorage.setItem(
      "aiSearchBarBadges",
      JSON.stringify(searchBarBadges),
    );
  }, [searchBarBadges]);

  useEffect(() => {
    setValue("continent", formData.continent);
    setValue("country", formData.country);
    setValue("location", formData.location);
    setValue("category", formData.category);
  }, [formData, setValue]);

  useEffect(() => {
    const selectedDestination = readSelectedDestination();
    persistSelectedDestination({
      continent: formData.continent,
      country: formData.country,
      city: formData.location,
      title: selectedDestination?.title,
    });
  }, [formData.continent, formData.country, formData.location]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryCountry = params.get("country");
    const queryLocation = params.get("state") || params.get("location");
    const queryContinent = params.get("continent");
    const queryCategory = params.get("category");

    const breadcrumbFilters = location.state?.breadcrumbFilters;

    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : value;

    const country = normalizeValue(breadcrumbFilters?.country || queryCountry);
    const loc = normalizeValue(breadcrumbFilters?.location || queryLocation);
    const continent = normalizeValue(
      breadcrumbFilters?.continent || queryContinent,
    );
    const category = normalizeValue(
      location.state?.category || breadcrumbFilters?.category || queryCategory,
    );

    if (!country || !loc) return;

    if (
      country === normalizeValue(formData.country) &&
      loc === normalizeValue(formData.location) &&
      (!continent || continent === normalizeValue(formData.continent)) &&
      (!category || category === normalizeValue(formData.category))
    ) {
      return;
    }

    const nextFormValues = {
      ...formData,
      country: country || "",
      location: loc || "",
      continent: continent || formData.continent || "",
      category: category || formData.category || "",
    };

    dispatch(setFormValues(nextFormValues));
  }, [dispatch, formData, location.state, location.search]);
  useEffect(() => {
    if (formData?.category && listingsData?.length > 0) {
      if (formData.category === VALUE_ADDED_SERVICES_CATEGORY) return;
      const hasCategory = listingsData.some(
        (item) => item.companyType === formData.category,
      );

      if (!hasCategory) {
        // Reset category in Redux + URL
        dispatch(setFormValues({ ...formData, category: "" }));
        setSearchParams({
          country: formData.country,
          location: formData.location,
        });
      }
    }
  }, [listingsData, formData, dispatch, setSearchParams]);

  const { mutate: locationData, isPending: isLocation } = useMutation({
    mutationFn: async (data) => {
      dispatch(setFormValues(data));
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  const forMapsData = isLisitingLoading
    ? []
    : listingsData.map((item) => ({
        ...item,
        id: item._id,
        lat: item.latitude,
        lng: item.longitude,
        name: item.companyName,
        location: item.city,
        reviews: item.reviews?.length,
        rating: item.reviews?.length
          ? (() => {
              const avg =
                item.reviews.reduce((sum, r) => sum + r.starCount, 0) /
                item.reviews.length;
              return avg % 1 === 0 ? avg : avg.toFixed(1);
            })()
          : "0",
        image: item.images?.[0]?.url,
      }));

  const handleCategoryClick = (categoryValue) => {
    const formData = getValues(); // from react-hook-form

    if (!formData.country || !formData.location) {
      alert("Please select Country and Location first.");
      return;
    }

    if (
      DESTINATION_HIGHLIGHT_FILTERS.some(
        (filter) => filter.value === categoryValue,
      )
    ) {
      const params = new URLSearchParams({
        country: formData.country,
        location: formData.location,
        highlight: categoryValue,
      });
      navigate(`/ai-verticals?${params.toString()}`, {
        state: {
          selectedStateLabel,
          searchBarBadges,
        },
      });
      return;
    }

    dispatch(setFormValues({ ...formData, category: categoryValue }));

    // const url = `/listings/${formData.country}.${formData.location}/${categoryValue}`;
    const state = {
      ...formData,
      category: categoryValue,
    };
    setShowMobileSearch(false);
    navigate(
      `${listingsBasePath}?country=${formData.country}&location=${formData.location}&category=${state.category}`,
      {
        state: {
          country: formData.country,
          location: formData.location,
          category: categoryValue,
          selectedStateLabel,
          searchBarBadges,
        },
      },
    );
  };

  const onSubmit = (data) => {
    locationData(data);
    setResetPageKey((prev) => prev + 1); // ensures a new value every time
  };

  const handleValueAddedServiceClick = (service) => {
    if (!service?.path) return;
    navigate(service.path);
  };

  const getValueAddedServiceLabel = (service) => {
    const locationLabel = (selectedStateLabel || "LOCATION").toUpperCase();
    const valueAddedServiceLabelMap = {
      "ANY VISA SUPPORT": `${locationLabel} VISA`,
      "OVERALL ACTIVATION SUPPORT": `${locationLabel} ACTIVATION`,
      "NEW COMPANY SUPPORT": `${locationLabel} COMPANY SETUP`,
      "ANY CONSULTATION SUPPORT": `${locationLabel} CONSULTATION`,
      "APPLY FOR JOB": `${locationLabel} JOBS`,
    };

    if (valueAddedServiceLabelMap[service?.label]) {
      return valueAddedServiceLabelMap[service.label];
    }

    if (!service?.usesSelectedLocation) return service.label;
    return service.label.replace("LOCATION", locationLabel);
  };

  const getValueAddedServiceCardLines = (serviceLabel, service) => {
    if (!serviceLabel) return [];

    if (service?.label === "APPLY FOR JOB") {
      return [serviceLabel];
    }

    const [firstWord, ...remainingWords] = serviceLabel
      .split(" ")
      .filter(Boolean);

    if (!firstWord || remainingWords.length === 0) {
      return [serviceLabel];
    }

    return [firstWord, remainingWords.join(" ")];
  };

  const [mapOpen, setMapOpen] = useState(!forceListView);
  const isMobile = useMediaQuery("(max-width:767px)");
  const isTablet = useMediaQuery("(max-width:1023px)");
  const isValueAddedServicesSelected =
    formData?.category === VALUE_ADDED_SERVICES_CATEGORY;
  const showDesktopMap =
    !forceListView && mapOpen && !isValueAddedServicesSelected;
  const listingsBasePath =
    location.pathname === "/ai-listings-list"
      ? "/ai-listings-list"
      : "/ai-listings";
  const selectedStateFromParams =
    searchParams.get("state") || searchParams.get("location") || "";
  const backLabel = selectedStateFromParams || formData?.location || "";
  const selectedDestination = readSelectedDestination();
  const sessionTitleMatchesSelection =
    selectedDestination?.country === formData?.country?.trim().toLowerCase() &&
    selectedDestination?.city === backLabel?.trim().toLowerCase();
  const displayStateName =
    sessionTitleMatchesSelection && selectedDestination?.title
      ? selectedDestination.title
      : backLabel;
  const selectedStateLabel = displayStateName
    ? displayStateName
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "";

  // Prioritize BIZ Nest and MeWo first, then sort the rest by rating descending
  const prioritizedCompanies = ["BIZ Nest", "MeWo"];
  const sortedListings = [...(listingsData || [])].sort((a, b) => {
    const aIsPriority = prioritizedCompanies.includes(a.companyName);
    const bIsPriority = prioritizedCompanies.includes(b.companyName);

    if (aIsPriority && !bIsPriority) return -1;
    if (!aIsPriority && bIsPriority) return 1;

    // If both are priority or both are not, then sort by average rating descending
    const aRating =
      a.reviews?.length > 0
        ? a.reviews.reduce((sum, r) => sum + r.starCount, 0) / a.reviews.length
        : 0;
    const bRating =
      b.reviews?.length > 0
        ? b.reviews.reduce((sum, r) => sum + r.starCount, 0) / b.reviews.length
        : 0;

    return bRating - aRating;
  });

  return (
    <div className="flex flex-col gap:2 lg:gap-6 bg-surface animate-fade-in">
      <div
        className={`${forceListView ? "flex" : "hidden lg:flex"} flex-col gap-6 md:px-10`}
      >
        <div
          className={`w-full lg:min-w-[82%] max-w-[80rem] lg:max-w-[80rem] mx-0 md:mx-auto ${
            forceListView ? "px-2 sm:px-6 lg:px-0" : "px-4 sm:px-6 lg:px-0"
          }`}
        >
          {!forceListView && (
            <div className="mb-4 flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => navigate("/search/results")}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent text-accent"
                aria-label="Go back to search results"
              >
                <HiOutlineArrowLeft size={18} />
              </button>
              {/* {selectedStateLabel && (
              <span className="text-lg font-medium text-accent">
                {selectedStateLabel}
              </span>
            )} */}
            </div>
          )}
          <p className="mb-4 mt-6 flex items-center gap-2 text-sm font-medium leading-snug text-gray-200 lg:hidden font-heading">
            {!isSecondHeadingPhase && (
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-b-transparent"
                aria-hidden="true"
              />
            )}
            {typedHeading}
          </p>
          <AiSelectedBadgesSearchBar
            badges={badgesWithCategory}
            stateLabel={selectedStateLabel}
            onBack={() => navigate(-1)}
            onClear={() => navigate("/search/results")}
            heading={
              <p className="mt-6 mb-6 hidden items-center gap-2 text-sm font-medium leading-snug text-gray-200 lg:flex lg:text-[0.9rem] font-heading">
                {!isSecondHeadingPhase && (
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-black border-b-transparent"
                    aria-hidden="true"
                  />
                )}
                {typedHeading}
              </p>
            }
            className="mb-4"
            fullWidth
          />
          <div className={isHeadingSequenceComplete ? "block" : "hidden"}>
            <div className="lg:hidden w-full flex flex-col gap-4 mb-4">
              <div className="glass-card flex items-center w-[92%] mx-auto text-center justify-center font-medium text-gray-200 px-6 py-2 rounded-full flex-col gap-1">
                <div className="flex items-center gap-2">
                  <IoSearch className="text-accent" />
                  <span className="text-[11px] font-bold text-gray-200 truncate w-full text-left">
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
                <span className="text-[10px] text-gray-400">
                  {formData?.count || "1-5"} Explorers
                </span>
              </div>
            </div>

            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide gap-1 pb-4 md:justify-center">
              {categoryOptions.map((cat) => {
                const iconSrc = newIcons[cat.value];
                const isActive = formData?.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategoryClick(cat.value)}
                    className="flex-shrink-0 snap-start text-gray-200 px-2 py-2 hover:text-gray-200 transition flex items-center justify-center w-[28%] sm:w-[20%] md:w-[15%] lg:w-[10%]"
                  >
                    <div className="h-10 w-full flex flex-col items-center gap-1">
                      <img
                        src={iconSrc}
                        alt={cat.label}
                        className="h-full w-[90%] object-contain"
                      />
                      <span
                        className={`text-[10px] font-medium whitespace-nowrap border-b-2 ${isActive ? "border-accent text-accent" : "border-transparent text-gray-200"}`}
                      >
                        {cat.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                exit={{ y: "-100%" }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-surface-50 shadow-glass overflow-auto z-50 p-4 rounded-t-3xl lg:hidden h-[100dvh]"
              >
                <div className="flex justify-between items-center mb-10">
                  <div>&nbsp;</div>
                  <h3 className="text-xl font-semibold">Search</h3>
                  <button
                    onClick={() => setShowMobileSearch(false)}
                    className="text-gray-400 text-xl"
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
                className="w-full bg-accent text-white py-5 rounded-full"
              >
                <IoSearch className="inline mr-2" />
                Search
              </button>
            </form> */}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="min-w-[82%] max-w-[80rem] lg:max-w-[80rem] mx-0 md:mx-auto px-6 sm:px-6 lg:px-0 ">
            <div className="lg:flex w-full items-center justify-between hidden">
              <div className="flex flex-col gap-4 justify-center items-center  w-full mt-10 lg:mt-0">
                <div className="hidden lg:flex flex-col gap-4 justify-between items-center w-full h-full">
                  {/* the 5 icons */}

                  <div className="w-full pb-4">
                    <div className="flex justify-between items-center">
                      {categoryOptions.map((cat) => {
                        const iconSrc = newIcons[cat.value];
                        const isActive = activeCategory === cat.value;

                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleCategoryClick(cat.value)}
                            className="text-gray-200 px-1 py-2 hover:text-gray-200 transition flex items-center justify-center w-full"
                          >
                            {iconSrc ? (
                              <div className="h-10 w-full flex flex-col gap-0 items-center">
                                <img
                                  src={iconSrc}
                                  alt={cat.label}
                                  className="h-full w-full object-contain"
                                />
                                <span
                                  className={`text-tiny border-b-2 pb-1 ${
                                    isActive
                                      ? "border-accent"
                                      : "border-transparent"
                                  }`}
                                >
                                  {cat.label}
                                </span>
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
                className=" flex justify-around md:w-full lg:w-full border-2 bg-surface-50 rounded-full p-0 items-center"
                
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
                      className="w-full "
                    />
                  )}
                />
                <div className="w-px h-10 bg-glass-border mx-2 my-auto" />
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
                      className="w-full "
                    />
                  )}
                />
                <div className="w-px h-10 bg-glass-border mx-2 my-auto" />
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
                <div className="w-px h-10 bg-glass-border mx-2 my-auto" />
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
                      className="w-full "
                    />
                  )}
                />
                <button
                  type="submit"
                  className="w-fit h-full  bg-accent text-white p-5 text-subtitle rounded-full"
                >
                  <IoSearch />
                </button>
              </form> */}
                </div>
              </div>
            </div>
            {/* <div className="lg:hidden w-full flex flex-col gap-4 my-0">
          

          <button
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="glass-card flex items-center w-full text-center item-center justify-center font-medium text-gray-200 px-6 py-2 rounded-full flex-col gap-2"
          >
            <span className="text-[11px] font-bold text-gray-200 truncate w-full text-center">
              <div className="flex items-center gap-2">
                <IoSearch className="text-accent" />
                {`${(formData?.country || "Country").charAt(0).toUpperCase() + (formData?.country || "Country").slice(1)} . ${formData?.location
                  ? formData.location
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                  : "Unknown"} . ${formData?.category
                    ? (categoryOptions.find(c => c.value === formData.category)?.label || formData.category.charAt(0).toUpperCase() + formData.category.slice(1))
                    : "All"
                  }`}
              </div>
            </span>
            <span className="text-tiny text-gray-400">
              {formData?.count || "1-5"} Explorers
            </span>
          </button>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide gap-1 pb-4 flex md:justify-center">
            {categoryOptions.map((cat) => {
              const iconSrc = newIcons[cat.value];
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategoryClick(cat.value)}
                  className="flex-shrink-0 snap-start text-gray-200 px-2 py-2 hover:text-gray-200 transition flex items-center justify-center w-[28%] sm:w-[20%] md:w-[15%] lg:w-[10%]"
                >
                  <div className="h-10 w-full flex flex-col items-center gap-1">
                    <img
                      src={iconSrc}
                      alt={cat.label}
                      className="h-full w-[90%] object-contain"
                    />
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap border-b-2 ${isActive ? "border-accent text-accent" : "border-transparent text-gray-200"
                        }`}
                    >
                      {cat.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div> */}
          </div>
          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 bg-surface-50 shadow-glass overflow-auto z-50 p-0 rounded-t-3xl lg:hidden"
              >
                <motion.div className="bg-surface-50 shadow-glass overflow-auto p-4 rounded-b-3xl  h-screen  w-full">
                  <div className="flex justify-between items-center mb-10">
                    <div>&nbsp;</div>
                    <h3 className="text-xl font-semibold">Search</h3>
                    <button
                      onClick={() => setShowMobileSearch(false)}
                      className="text-gray-400 text-xl"
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
                      className="w-full "
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
                  className="w-full bg-accent text-white py-5 rounded-full"
                >
                  <IoSearch className="inline mr-2" />
                  Search
                </button>
              </form> */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <Container
            padding={false}
            className={forceListView ? "!px-0 sm:!px-6 lg:!px-0" : ""}
          >
            {/* Dynamic Header */}
            {formData?.category && formData?.location && (
              <div className="mt-6 mb-2 px-1 border-t border-glass-border">
                <h1 className="text-sm sm:text-base md:text-subtitle text-gray-200 font-semibold truncate leading-tight mt-6">
                  Popular{" "}
                  {{
                    coworking: "Co-Working Spaces",
                    coliving: "Co-Living Spaces",
                    hostel: "Hostels",
                    workation: "Workation",
                    privatestay: "Private Stays",
                    meetingroom: "Meeting Rooms",
                    cafe: "Cafes",
                    [VALUE_ADDED_SERVICES_CATEGORY]: "Value Added Services",
                  }[formData.category] || `${formData.category} Spaces`}{" "}
                  in {selectedStateLabel || "Unknown"}
                </h1>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-9 gap-4">
              {/* LIST VIEW */}
              <motion.div
                key="list-view"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${
                  showDesktopMap ? "col-span-5" : "col-span-9"
                } font-semibold text-lg`}
              >
                {formData?.category === VALUE_ADDED_SERVICES_CATEGORY ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                    {valueAddedServiceItems.map((service) => {
                      const isDisabled = !service.path;

                      const serviceLabel = getValueAddedServiceLabel(service);

                      return (
                        <button
                          key={serviceLabel}
                          type="button"
                          onClick={() => handleValueAddedServiceClick(service)}
                          disabled={isDisabled}
                          className={`relative overflow-hidden rounded-3xl px-1 py-4 min-h-[132px] aspect-square flex items-end justify-center text-center transition-transform ${
                            isDisabled
                              ? "cursor-not-allowed opacity-80"
                              : "hover:scale-[1.02]"
                          }`}
                          style={{
                            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.2)), url(${service.imageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="flex w-full flex-col items-center justify-end">
                            {getValueAddedServiceCardLines(
                              serviceLabel,
                              service,
                            ).map((line) => (
                              <span
                                key={`${serviceLabel}-${line}`}
                                className="text-base md:text-xl font-normal uppercase text-white leading-tight tracking-wide"
                              >
                                {line}
                              </span>
                            ))}
                            {service.badge && (
                              <span className="mt-2 rounded-full border border-red-400 bg-red-200 px-1.5 py-0.5 text-[9px] font-semibold leading-none normal-case text-gray-200 shadow-sm">
                                {service.badge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <PaginatedGrid
                    // data={isLisitingLoading ? skeletonArray : sortedListings}
                    data={isLisitingLoading ? skeletonArray : filteredListings}
                    entriesPerPage={
                      isMobile ? 10 : isTablet ? 9 : !showDesktopMap ? 100 : 9
                    }
                    persistPage={true}
                    resetPageKey={resetPageKey}
                    columns={`grid-cols-2 md:grid-cols-3 ${
                      showDesktopMap
                        ? "lg:grid-cols-3"
                        : "lg:grid-cols-4 xl:grid-cols-5"
                    } gap-4 md:gap-5`}
                    renderItem={(item, index) =>
                      isLisitingLoading ? (
                        <Box key={index} className="w-full h-full">
                          <Skeleton
                            variant="rectangular"
                            height={200}
                            sx={{ borderRadius: 2 }}
                          />
                          <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
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
                            showVertical={false}
                            handleNavigation={() => {
                              navigate(
                                `/ai-listings/${encodeURIComponent(item.companyName)}`,
                                {
                                  state: {
                                    companyId: item.companyId,
                                    type: item.companyType,
                                    selectedStateLabel,
                                    searchBarBadges,
                                  },
                                },
                              );
                            }}
                          />
                        </motion.div>
                      )
                    }
                  />
                )}
              </motion.div>

              {/* MAP VIEW */}
              <AnimatePresence>
                {showDesktopMap && (
                  <motion.div
                    key="map-view"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="hidden lg:block col-span-4 w-full overflow-hidden rounded-xl lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-120px)] min-h-[500px]"
                  >
                    {isLisitingLoading ? (
                      <SkeletonMap />
                    ) : forMapsData?.length ? (
                      <Map locations={forMapsData} />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm border border-dotted rounded-lg">
                        Map data not available.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Container>

          {!isValueAddedServicesSelected && (
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
              <button
                onClick={() =>
                  navigate(
                    `/ai-verticals?country=${formData?.country}&location=${formData?.location}&view=map`,
                    {
                      state: { searchBarBadges },
                    },
                  )
                }
                className="bg-surface-200 text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-glass hover:scale-105 transition-transform active:scale-95"
              >
                <span className="text-sm font-semibold tracking-wide">
                  Show map
                </span>
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
                  <path d="M31.25 3.75a2.29 2.29 0 0 0-1.01-1.44A2.29 2.29 0 0 0 28.5 2L21 3.67l-10-2L2.5 3.56A2.29 2.29 0 0 0 .7 5.8v21.95a2.28 2.28 0 0 0 1.06 1.94A2.29 2.29 0 0 0 3.5 30L11 28.33l10 2 8.49-1.89a2.29 2.29 0 0 0 1.8-2.24V4.25a2.3 2.3 0 0 0-.06-.5zM12.5 25.98l-1.51-.3L9.5 26H9.5V4.66l1.51-.33 1.49.3v21.34zm10 1.36-1.51.33-1.49-.3V6.02l1.51.3L22.5 6h.01v21.34z"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiListings;
