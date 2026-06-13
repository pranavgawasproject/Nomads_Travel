import { MenuItem, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CiSearch } from "react-icons/ci";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
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
import { Helmet } from "@dr.pogodin/react-helmet";
import useAuth from "../hooks/useAuth.js";
import { HiOutlineX } from "react-icons/hi";
import {
  persistSelectedDestination,
  readSelectedDestination,
} from "../utils/selectedDestinationSession.js";
import {
  dedupeAiSearchBadges,
  buildAiVerticalsSearchBadges,
} from "../utils/aiSearchBarBadges.js";
import AiDestinationHighlightSection from "../components/AiDestinationHighlightSection.jsx";
import {
  DESTINATION_HIGHLIGHT_FILTERS,
  popularVenues,
} from "../data/aiDestinationHighlights.js";

// import { LuCircleDollarSign, LuMapPinned } from "react-icons/lu";
// import {
//   HiOutlineCog,
//   HiOutlineKey,
//   HiOutlineUserCircle,
// } from "react-icons/hi";

const VALUE_ADDED_SERVICES_CATEGORY = "valueaddedservices";
// const VALUE_ADDED_SERVICE_CARD_BACKGROUND_IMAGE = "/images/goa-image.jpg";
const VALUE_ADDED_SERVICES_DEFAULT_VISIBLE_COUNT = 5;
const TYPING_INTERVAL_MS = 7;
const SECOND_HEADING_DELAY_MS = 250;
const THINKING_HEADING_TEXT = "Curating the best results for you";
const CURATED_RESULTS_HEADING_TEXT =
  "Please find below the best curated results from the options you suggested to me to help you discover and work from the best explorer destinations.";
const AI_SCROLL_CONTAINER_ID = "roamiq-ai-scroll-container";
const extractImageFromContent = (content) => {
  const match = content?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};
const normalizeContentDestination = (label) =>
  label
    ? label
        .replace(/\+/g, " ")
        .replace(/[\u2010-\u2015\u2212\u{FE63}\u{FF0D}]/gu, "-")
        .trim()
    : "";
const buildExactContentKeyword = (label) => {
  if (!label) return null;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `^${escaped}$`;
};
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
        <h2 className="text-sm sm:text-base md:text-subtitle text-gray-200 font-semibold truncate leading-tight">
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

const valueAddedServiceItems = [
  {
    label: "ANY VISA SUPPORT",
    path: "/visa-support",
    imageUrl:
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

const AiGlobalListingsList = () => {
  const [favorites, setFavorites] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isValueAddedServicesExpanded, setIsValueAddedServicesExpanded] =
    useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = useSelector((state) => state.location.formValues);
  const { handleSubmit, control, reset, setValue, getValues, watch } = useForm({
    defaultValues: {
      continent: "",
      country: "",
      location: "",
      category: "",
      count: "",
    },
  });

  const { auth } = useAuth();
  const user = auth?.user || {};
  const userId = auth?.user?._id || auth?.user?.id;
  const selectedCountry = watch("country");
  const selectedState = watch("location");

  const [persistedSearchBarBadges, setPersistedSearchBarBadges] = useState([]);
  const visibleValueAddedServiceItems = isValueAddedServicesExpanded
    ? valueAddedServiceItems
    : valueAddedServiceItems.slice(
        0,
        VALUE_ADDED_SERVICES_DEFAULT_VISIBLE_COUNT,
      );
  const showValueAddedServicesToggle =
    valueAddedServiceItems.length > VALUE_ADDED_SERVICES_DEFAULT_VISIBLE_COUNT;

  const mobileValueAddedServiceItems = valueAddedServiceItems;

  const [typedHeading, setTypedHeading] = useState("");
  const [isSecondHeadingPhase, setIsSecondHeadingPhase] = useState(false);
  const [isHeadingSequenceComplete, setIsHeadingSequenceComplete] =
    useState(false);

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
    const currentCountry = (params.get("country") || "").trim().toLowerCase();
    const currentLocation = (
      params.get("state") ||
      params.get("location") ||
      ""
    )
      .trim()
      .toLowerCase();

    if (typeof window !== "undefined" && currentCountry && currentLocation) {
      const restoreKey = getAiVerticalsPageStateKey(
        currentCountry,
        currentLocation,
      );
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
        typeText(CURATED_RESULTS_HEADING_TEXT, () => {
          setIsHeadingSequenceComplete(true);
        });
      }, SECOND_HEADING_DELAY_MS);
    });

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [location.search]);

  // Special users who can see all locations
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
  const contentDestination = normalizeContentDestination(formData?.location);
  const { data: blogsData } = useQuery({
    queryKey: ["blogs", contentDestination],
    queryFn: async () => {
      const response = await axios.get("/blogs/get-blogs", {
        params: {
          keyword: buildExactContentKeyword(contentDestination),
        },
      });

      return response.data;
    },
    enabled: !!contentDestination,
    refetchOnWindowFocus: false,
  });
  const { data: newsData } = useQuery({
    queryKey: ["ai-news", contentDestination],
    queryFn: async () => {
      const response = await axios.get("/news/get-news", {
        params: {
          keyword: buildExactContentKeyword(contentDestination),
        },
      });

      return response.data;
    },
    enabled: !!contentDestination,
    refetchOnWindowFocus: false,
  });
  const { data: eventsData } = useQuery({
    queryKey: ["ai-events", contentDestination],
    queryFn: async () => {
      const response = await axios.get("/events", {
        params: {
          destination: contentDestination,
        },
      });

      return response.data;
    },
    enabled: !!contentDestination,
    refetchOnWindowFocus: false,
  });
  const popularLocationBlogs = useMemo(
    () =>
      (Array.isArray(blogsData) ? blogsData : []).slice(0, 5).map((blog) => ({
        ...blog,
        id: blog.guid || blog._id || blog.mainTitle,
        title: blog.mainTitle || blog.title,
        image:
          blog.mainImage ||
          extractImageFromContent(blog.content || blog.description),
      })),
    [blogsData],
  );
  const popularLocationNews = useMemo(
    () =>
      (Array.isArray(newsData) ? newsData : []).slice(0, 5).map((newsItem) => ({
        ...newsItem,
        id: newsItem.guid || newsItem._id || newsItem.mainTitle,
        title: newsItem.mainTitle || newsItem.title,
        image:
          newsItem.mainImage ||
          extractImageFromContent(newsItem.content || newsItem.description),
      })),
    [newsData],
  );
  const popularLocationEvents = useMemo(
    () =>
      (Array.isArray(eventsData) ? eventsData : [])
        .slice(0, 5)
        .map((event) => ({
          ...event,
          id: event._id || event.serialNumber || event.eventName,
          title: event.eventName,
          image: event.mainImage,
          location: event.venue || event.destination,
          meta: event.month,
          subtitle: event.month,
          description: event.shortDescription,
        })),
    [eventsData],
  );

  const countOptions = [
    { label: "1 - 5", value: "1-5" },
    { label: "5 - 10", value: "5-10" },
    { label: "10 - 25", value: "10-25" },
    { label: "25+", value: "25+" },
  ];

  const typeOrder = [
    "coworking",
    "hostel",
    "workation",
    "privateStay",
    "coliving",
    "meetingRoom",
    "cafe",
  ];

  const expandedCategoriesStorageKey = useMemo(() => {
    const countryKey = (formData?.country || "").toLowerCase();
    const locationKey = (formData?.location || "").toLowerCase();

    if (!countryKey || !locationKey) return null;
    return `ai-verticals-expanded-categories:${countryKey}:${locationKey}`;
  }, [formData?.country, formData?.location]);

  const listingPageStateStorageKey = useMemo(() => {
    const countryKey = (formData?.country || "").toLowerCase();
    const locationKey = (formData?.location || "").toLowerCase();

    if (!countryKey || !locationKey) return null;
    return getAiVerticalsPageStateKey(countryKey, locationKey);
  }, [formData?.country, formData?.location]);

  const hasRestoredPageStateRef = React.useRef(false);
  const sectionRefs = React.useRef({});
  const getDiscoverySectionRef = React.useCallback((categoryValue) => {
    const viewport = window.innerWidth >= 1024 ? "desktop" : "mobile";
    return sectionRefs.current[`${categoryValue}-${viewport}`];
  }, []);

  const getScrollContainer = () =>
    typeof document === "undefined"
      ? null
      : document.getElementById(AI_SCROLL_CONTAINER_ID);

  const handleShowMoreClick = (type) => {
    setExpandedCategories((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  useEffect(() => {
    if (!expandedCategoriesStorageKey) {
      setExpandedCategories([]);
      return;
    }

    const savedState = window.sessionStorage.getItem(
      expandedCategoriesStorageKey,
    );

    if (!savedState) {
      setExpandedCategories([]);
      return;
    }

    try {
      const parsedState = JSON.parse(savedState);
      setExpandedCategories(Array.isArray(parsedState) ? parsedState : []);
    } catch {
      setExpandedCategories([]);
    }
  }, [expandedCategoriesStorageKey]);

  useEffect(() => {
    if (!expandedCategoriesStorageKey) return;

    window.sessionStorage.setItem(
      expandedCategoriesStorageKey,
      JSON.stringify(expandedCategories),
    );
  }, [expandedCategories, expandedCategoriesStorageKey]);

  const { data: listingsData, isPending: isLisitingLoading } = useQuery({
    queryKey: ["globallistings", formData],
    queryFn: async () => {
      const { country, location, category } = formData || {};

      const response = await axios.get(
        `company/companiesn?country=${country}&state=${location}&userId=${userId || ""}`,
      );

      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!formData?.country && !!formData?.location,
    refetchOnMount: "always",
  });

  const categoryOptions = useMemo(() => {
    if (!listingsData || listingsData.length === 0) {
      return [
        ...DESTINATION_HIGHLIGHT_FILTERS,
        { label: "Value Adds", value: VALUE_ADDED_SERVICES_CATEGORY },
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

    const options = uniqueTypes
      .map((type) => ({ label: labelMap[type] || type, value: type }))
      .sort((a, b) => typeOrder.indexOf(a.value) - typeOrder.indexOf(b.value));

    const optionsWithoutValueAdds = options.filter(
      (option) => option.value !== VALUE_ADDED_SERVICES_CATEGORY,
    );

    return [
      ...optionsWithoutValueAdds,
      ...DESTINATION_HIGHLIGHT_FILTERS,
      { label: "Value Adds", value: VALUE_ADDED_SERVICES_CATEGORY },
    ];
  }, [listingsData]);

  const groupedListings = listingsData?.reduce((acc, item) => {
    if (item.companyType === "privatestay") return acc;
    if (!acc[item.companyType]) acc[item.companyType] = [];
    acc[item.companyType].push(item);
    return acc;
  }, {});

  const typeLabels = {
    coworking: "Co-Working Spaces",
    coliving: "Co-Living Spaces",
    hostel: "Hostels",
    privatestay: "Private Stays",
    meetingroom: "Meeting Rooms",
    cafe: "Cafes",
    default: (type) => `${type[0].toUpperCase() + type.slice(1)} Spaces`,
  };

  useEffect(() => {
    if (
      !listingPageStateStorageKey ||
      isLisitingLoading ||
      !isHeadingSequenceComplete
    ) {
      return;
    }

    if (hasRestoredPageStateRef.current) return;

    const savedState = window.sessionStorage.getItem(
      listingPageStateStorageKey,
    );
    if (!savedState) return;

    try {
      const parsedState = JSON.parse(savedState);
      const scrollContainer = getScrollContainer();
      const targetCategory = parsedState?.category;
      const targetSection = targetCategory
        ? sectionRefs.current[targetCategory]
        : null;

      window.requestAnimationFrame(() => {
        if (targetSection) {
          targetSection.scrollIntoView({ block: "start", behavior: "auto" });
        }

        if (
          scrollContainer &&
          typeof parsedState?.scrollTop === "number" &&
          parsedState.scrollTop >= 0
        ) {
          scrollContainer.scrollTo({
            top: parsedState.scrollTop,
            behavior: "auto",
          });
        }
      });

      hasRestoredPageStateRef.current = true;
      window.sessionStorage.removeItem(listingPageStateStorageKey);
    } catch {
      window.sessionStorage.removeItem(listingPageStateStorageKey);
    }
  }, [
    getScrollContainer,
    isHeadingSequenceComplete,
    isLisitingLoading,
    listingPageStateStorageKey,
  ]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const handleListingNavigation = (item) => {
    const scrollContainer = getScrollContainer();

    if (listingPageStateStorageKey) {
      window.sessionStorage.setItem(
        listingPageStateStorageKey,
        JSON.stringify({
          category: item.companyType || "",
          scrollTop: scrollContainer?.scrollTop ?? 0,
        }),
      );
    }

    navigate(`/ai-listings/${encodeURIComponent(item.companyName)}`, {
      state: {
        breadcrumbLoading: true,
        companyId: item.companyId,
        type: item.companyType,
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

  const [showMobileSearch, setShowMobileSearch] = useState(false);

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
        setPersistedSearchBarBadges(parsedBadges.filter(Boolean));
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
    const params = new URLSearchParams(location.search);
    const queryCountry = params.get("country");
    const queryLocation = params.get("state") || params.get("location");
    const queryContinent = params.get("continent");

    const breadcrumbFilters = location.state?.breadcrumbFilters;

    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : value;

    const country = normalizeValue(breadcrumbFilters?.country || queryCountry);
    const loc = normalizeValue(breadcrumbFilters?.location || queryLocation);
    const continent = normalizeValue(
      breadcrumbFilters?.continent || queryContinent,
    );

    if (!country || !loc) return;

    if (
      country === normalizeValue(formData.country) &&
      loc === normalizeValue(formData.location) &&
      (!continent || continent === normalizeValue(formData.continent))
    ) {
      return;
    }

    const nextFormValues = {
      ...formData,
      country: country || "",
      location: loc || "",
      continent: continent || formData.continent || "",
    };

    dispatch(setFormValues(nextFormValues));
  }, [dispatch, formData, location.state, location.search]);

  const { mutate: locationData, isPending: isLocation } = useMutation({
    mutationFn: async (data) => {
      dispatch(setFormValues(data));
      setShowMobileSearch(false);
      navigate(
        `/ai-verticals?country=${data.country}&location=${data.location}`,
      );
    },
    onSuccess: () => {
      console.log("success");
    },
    onError: () => {
      console.log("error");
    },
  });

  const handleCategoryClick = (categoryValue) => {
    const formData = getValues();

    if (!formData.country || !formData.location) {
      alert("Please select Country and Location first.");
      return;
    }

    if (
      DESTINATION_HIGHLIGHT_FILTERS.some(
        (filter) => filter.value === categoryValue,
      )
    ) {
      getDiscoverySectionRef(categoryValue)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    dispatch(setFormValues({ ...formData, category: categoryValue }));

    const state = {
      ...formData,
      category: categoryValue,
    };

    navigate(
      `/ai-listings-list?country=${formData.country}&location=${formData.location}&category=${state.category}`,
      {
        state: {
          country: formData.country,
          location: formData.location,
          category: categoryValue,
          searchBarBadges,
        },
      },
    );
  };

  const handleHighlightCardClick = (item, type) => {
    if (type === "event" || type === "venue") {
      navigate(`/ai-${type}s/${item.id}`, {
        state: {
          item,
          selectedStateLabel: selectedLocationLabel,
          stickyBreadcrumbs: [
            {
              label: selectedLocationLabel || "Destination",
              path: location.pathname,
            },
            { label: item.title },
          ],
        },
      });
      return;
    }

    navigate(
      type === "news"
        ? "/ai-news/ai-news-details"
        : "/ai-blogs/ai-blog-details",
      {
        state: {
          content: item,
          selectedStateLabel: selectedLocationLabel,
        },
      },
    );
  };

  const handleBlogsViewMore = () => {
    navigate(
      {
        pathname: "/ai-blogs",
        search: location.search,
      },
      {
        state: {
          selectedStateLabel: selectedLocationLabel,
        },
      },
    );
  };

  const handleNewsViewMore = () => {
    navigate(
      {
        pathname: "/ai-news",
        search: location.search,
      },
      {
        state: {
          selectedStateLabel: selectedLocationLabel,
        },
      },
    );
  };

  const handleValueAddedServiceClick = (service) => {
    if (!service.path) return;

    const params = new URLSearchParams(location.search);
    navigate({
      pathname: service.path,
      search: params.toString() ? `?${params.toString()}` : "",
    });
  };

  const getValueAddedServiceLabel = (service) => {
    const locationLabel = (selectedLocationLabel || "LOCATION").toUpperCase();
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

    if (!service.usesSelectedLocation) return service.label;
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
  const prioritizedCompanies = ["BIZ Nest", "MeWo"];
  const sortedListings = [...(listingsData || [])].sort((a, b) => {
    const aIsPriority = prioritizedCompanies.includes(a.companyName);
    const bIsPriority = prioritizedCompanies.includes(b.companyName);

    if (aIsPriority && !bIsPriority) return -1;
    if (!aIsPriority && bIsPriority) return 1;

    const aRating = Number(a.ratings || 0);
    const bRating = Number(b.ratings || 0);

    return bRating - aRating;
  });

  // Handle map navigation with validation
  const handleShowMap = () => {
    console.log("Show map clicked", {
      country: formData?.country,
      location: formData?.location,
    });

    if (!formData?.country || !formData?.location) {
      alert("Please select a country and location first");
      return;
    }

    const mapUrl = `/ai-verticals?country=${encodeURIComponent(formData.country)}&state=${encodeURIComponent(formData.location)}&view=map`;
    console.log("Navigating to:", mapUrl);
    navigate(mapUrl, {
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
    });
  };

  useEffect(() => {
    if (!isHeadingSequenceComplete) return;

    const params = new URLSearchParams(location.search);
    const highlight = params.get("highlight");
    if (!highlight) return;

    window.requestAnimationFrame(() => {
      getDiscoverySectionRef(highlight)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [getDiscoverySectionRef, isHeadingSequenceComplete, location.search]);

  return (
    <>
      <Helmet>
        <title>Explore Work, Stay & Cafe Spaces | RoamIQ</title>
        <meta
          name="description"
          content="Discover top coworking spaces, hostels, cafes, and private stays in your chosen destination. Work, live, and connect with global explorers."
        />
        <meta
          name="keywords"
          content="remote workers, coworking spaces, hostels, workation, cafes, private stays, remote work Goa"
        />
        <meta property="og:title" content="Explore Explorer Spaces | Explorers" />
        <meta
          property="og:description"
          content="Find inspiring spaces to work, stay, and connect with other remote workers and travelers across the globe."
        />
        <meta property="og:image" content="/images/homepage.jpeg" />
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
            onClear={() => navigate(-1)}
            heading={
              <p className=" mt-6 mb-6 flex items-center gap-2 text-sm font-medium leading-snug text-gray-200 lg:text-[0.8rem] font-heading">
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
            <div className="flex flex-col gap-4 justify-between items-center w-full h-full">
              <div className="w-full pb-4">
                <div className="flex justify-between items-center">
                  {categoryOptions.map((cat) => {
                    const iconSrc = newIcons[cat.value];
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className="text-gray-200 px-1 py-2 hover:text-gray-200 transition flex items-center justify-center w-full"
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
                className="flex justify-around md:w-full lg:w-full border-2 bg-surface-50 rounded-full p-0 items-center"
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
                      className="w-full"
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
                      className="w-full"
                    />
                  )}
                />
                <button
                  type="submit"
                  className="w-fit h-full bg-accent text-white p-5 text-subtitle rounded-full"
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
              <div className="font-semibold text-md">
                <div className="custom-scrollbar-hide">
                  {isLisitingLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  ) : groupedListings &&
                    Object.keys(groupedListings).length > 0 ? (
                    <>
                      <div className="border-t border-glass-border mt-0 mb-6" />
                      {Object.entries(groupedListings)
                        .sort(([typeA], [typeB]) => {
                          const typeOrder = [
                            "coworking",
                            "coliving",
                            "hostel",
                            "workation",
                            "privatestay",
                            "meetingroom",
                            "cafe",
                          ];
                          const indexA = typeOrder.indexOf(typeA);
                          const indexB = typeOrder.indexOf(typeB);
                          return (
                            (indexA === -1 ? 999 : indexA) -
                            (indexB === -1 ? 999 : indexB)
                          );
                        })
                        .map(([type, items], index) => {
                          const prioritizedCompanies = ["BIZ Nest", "MeWo"];
                          const sortedItems = [...items].sort((a, b) => {
                            const aPriorityIndex = prioritizedCompanies.indexOf(
                              a.companyName,
                            );
                            const bPriorityIndex = prioritizedCompanies.indexOf(
                              b.companyName,
                            );
                            if (
                              aPriorityIndex !== -1 &&
                              bPriorityIndex !== -1
                            ) {
                              return aPriorityIndex - bPriorityIndex;
                            }
                            if (aPriorityIndex !== -1) return -1;
                            if (bPriorityIndex !== -1) return 1;
                            const aRating = Number(a.ratings || 0);
                            const bRating = Number(b.ratings || 0);
                            return bRating - aRating;
                          });

                          const displayItems = expandedCategories.includes(type)
                            ? sortedItems
                            : sortedItems.slice(0, 5);
                          const showViewMore = sortedItems.length > 5;
                          const sectionTitle = `Popular ${typeLabels[type] || typeLabels.default(type)} in ${selectedLocationLabel}`;

                          return (
                            <div
                              key={type}
                              ref={(element) => {
                                if (element) {
                                  sectionRefs.current[type] = element;
                                  return;
                                }

                                delete sectionRefs.current[type];
                              }}
                              className={`col-span-full ${
                                index > 0
                                  ? "border-t border-glass-border mt-6 pt-6"
                                  : ""
                              } mb-6`}
                            >
                              <h2 className="text-subtitle font-semibold mb-5 text-gray-200">
                                {sectionTitle}
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-0">
                                {displayItems.map((item) => (
                                  <ListingCard
                                    key={item._id}
                                    item={item}
                                    showVertical={false}
                                    handleNavigation={() =>
                                      handleListingNavigation(item)
                                    }
                                  />
                                ))}
                              </div>
                              {showViewMore && (
                                <div className="mt-0 text-right">
                                  <button
                                    onClick={() => handleShowMoreClick(type)}
                                    className="text-accent text-sm font-semibold hover:underline"
                                  >
                                    {expandedCategories.includes(type)
                                      ? "View less ←"
                                      : "View more →"}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      <AiDestinationHighlightSection
                            title={`Popular Annual Events in ${selectedLocationLabel}`}
                            items={popularLocationEvents}
                            kind="event"
                            onCardClick={(item) =>
                              handleHighlightCardClick(item, "event")
                            }
                            sectionRef={(element) => {
                          sectionRefs.current["annualevents-desktop"] = element;
                            }}
                          />
                      {/* <AiDestinationHighlightSection
                        title={`Popular Venues to visit in ${selectedLocationLabel}`}
                        items={popularVenues}
                        kind="venue"
                        onCardClick={(item) =>
                          handleHighlightCardClick(item, "venue")
                        }
                        sectionRef={(element) => {
                          sectionRefs.current["venues-desktop"] = element;
                        }}
                      /> */}
                          <AiDestinationHighlightSection
                            title={`Popular News in ${selectedLocationLabel}`}
                            items={popularLocationNews}
                            kind="news"
                            onCardClick={(item) =>
                              handleHighlightCardClick(item, "news")
                            }
                            onViewMore={handleNewsViewMore}
                            sectionRef={(element) => {
                              sectionRefs.current["news-desktop"] = element;
                            }}
                          />
                          <AiDestinationHighlightSection
                            title={`Popular Blogs in ${selectedLocationLabel}`}
                            items={popularLocationBlogs}
                            kind="blog"
                            onCardClick={(item) =>
                              handleHighlightCardClick(item, "blog")
                            }
                            onViewMore={handleBlogsViewMore}
                            sectionRef={(element) => {
                              sectionRefs.current["blogs-desktop"] = element;
                            }}
                      />
                      <div
                        ref={(element) => {
                          sectionRefs.current["valueaddedservices-desktop"] =
                            element;
                        }}
                        className="col-span-full border-t border-glass-border mt-6 pt-6 mb-6 scroll-mt-24"
                      >
                        <h2 className="text-subtitle font-semibold mb-5 text-gray-200">
                          Value Added Services in {selectedLocationLabel}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {visibleValueAddedServiceItems.map((service) => {
                            const isDisabled = !service.path;

                            const serviceLabel =
                              getValueAddedServiceLabel(service);

                            return (
                              <button
                                key={serviceLabel}
                                type="button"
                                onClick={() =>
                                  handleValueAddedServiceClick(service)
                                }
                                disabled={isDisabled}
                                className={`relative overflow-hidden rounded-3xl min-h-[132px] aspect-square flex items-end justify-center text-center transition-transform ${
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
                                <div className="flex w-full flex-col items-center justify-end pb-2">
                                  {getValueAddedServiceCardLines(
                                    serviceLabel,
                                    service,
                                  ).map((line) => (
                                    <span
                                      key={`${serviceLabel}-${line}`}
                                      className="text-base md:text-xl font-normal uppercase text-white leading-tight tracking-wide pb-2"
                                    >
                                      {line}
                                    </span>
                                  ))}
                                  {service.badge && (
                                    <span className="mt-0 rounded-full border border-red-400 bg-red-200 px-1.5 py-0.5 text-[9px] font-semibold normal-case text-gray-200 shadow-sm">
                                      {service.badge}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {showValueAddedServicesToggle && (
                          <div className="mt-0 text-right">
                            <button
                              onClick={() =>
                                setIsValueAddedServicesExpanded(
                                  (prevState) => !prevState,
                                )
                              }
                              className="text-accent text-sm font-semibold hover:underline"
                            >
                              {isValueAddedServicesExpanded
                                ? "View less ←"
                                : "View more →"}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="col-span-full text-center text-sm text-gray-400 border border-dotted rounded-lg p-4">
                      No listings found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* ==================== MOBILE/TABLET VIEW (below lg) ==================== */}
      <div className="lg:hidden flex flex-col gap-2">
        <div className="flex flex-col gap-4 justify-center items-center w-full lg:mt-0">
          <div className="w-full lg:min-w-[82%] max-w-[80rem] lg:max-w-[80rem] mx-0 md:mx-auto px-4 sm:px-6 lg:px-0">
            <div className="lg:hidden w-full flex flex-col gap-4 mb-4">
              <div className="w-[92%] mx-auto glass-card rounded-full pl-16 pr-4 py-2 flex items-center gap-2">
                <div className="flex items-center flex-1 text-center justify-center font-medium text-gray-200 flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2 w-full">
                    <IoSearch className="text-primary-red" />
                    <span className="text-[11px] font-bold text-gray-200 truncate w-full text-left">
                      {`${(formData?.country || "Country").charAt(0).toUpperCase() + (formData?.country || "Country").slice(1)} . ${
                        selectedLocationLabel || "Unknown"
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
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label="Go back to previous page"
                  className="h-8 w-8 shrink-0 rounded-full bg-surface-100 text-gray-400 flex items-center justify-center"
                >
                  <HiOutlineX size={18} />
                </button>
              </div>
            </div>

            <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide gap-1 pb-4 md:justify-center">
              {categoryOptions.map((cat) => {
                const iconSrc = newIcons[cat.value];
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
                      <span className="text-[10px] font-medium whitespace-nowrap">
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
        </div>

        <Container padding={false}>
          <div className="">
            <div className="font-semibold text-md">
              <div className="custom-scrollbar-hide">
                {isLisitingLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : groupedListings &&
                  Object.keys(groupedListings).length > 0 ? (
                  <>
                    {Object.entries(groupedListings)
                      .sort(([typeA], [typeB]) => {
                        const typeOrder = [
                          "coworking",
                          "hostel",
                          "workation",
                          "privatestay",
                          "coliving",
                          "meetingroom",
                          "cafe",
                        ];
                        const indexA = typeOrder.indexOf(typeA);
                        const indexB = typeOrder.indexOf(typeB);
                        return (
                          (indexA === -1 ? 999 : indexA) -
                          (indexB === -1 ? 999 : indexB)
                        );
                      })
                      .map(([type, items]) => {
                        const prioritizedCompanies = ["BIZ Nest", "MeWo"];
                        const sortedItems = [...items].sort((a, b) => {
                          const aPriorityIndex = prioritizedCompanies.indexOf(
                            a.companyName,
                          );
                          const bPriorityIndex = prioritizedCompanies.indexOf(
                            b.companyName,
                          );
                          if (aPriorityIndex !== -1 && bPriorityIndex !== -1) {
                            return aPriorityIndex - bPriorityIndex;
                          }
                          if (aPriorityIndex !== -1) return -1;
                          if (bPriorityIndex !== -1) return 1;
                          const aRating = Number(a.ratings || 0);
                          const bRating = Number(b.ratings || 0);
                          return bRating - aRating;
                        });

                        const displayItems = sortedItems;
                        const hasMore = displayItems.length > 5;
                        const itemsToShow = hasMore
                          ? displayItems.slice(0, 5)
                          : displayItems;

                        const sectionTitle = `Popular ${typeLabels[type] || typeLabels.default(type)} in ${selectedLocationLabel}`;

                        return (
                          <HorizontalScrollWrapper
                            key={type}
                            title={sectionTitle}
                          >
                            {itemsToShow.map((item) => (
                              <div
                                key={item._id}
                                className="w-[calc(85%-0.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1.5rem)] flex-shrink-0 snap-start"
                              >
                                <ListingCard
                                  item={item}
                                  showVertical={false}
                                  handleNavigation={() =>
                                    handleListingNavigation(item)
                                  }
                                />
                              </div>
                            ))}
                            {hasMore && (
                              <div className="w-[calc(85%-0.5rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1.5rem)] flex-shrink-0 snap-start">
                                <button
                                  onClick={() => handleCategoryClick(type)}
                                  className="w-full aspect-square border-2 border-glass-border rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-accent hover:shadow-card transition-all bg-surface-50/30 group md:justify-start md:pt-12"
                                >
                                  <div className="w-16 h-16 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-surface-100 transition-colors">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="w-8 h-8 text-gray-400 group-hover:text-gray-400"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                      />
                                    </svg>
                                  </div>
                                  <span className="text-lg font-medium text-gray-400 group-hover:text-gray-200">
                                    View All
                                  </span>
                                </button>
                              </div>
                            )}
                          </HorizontalScrollWrapper>
                        );
                      })}
                    <AiDestinationHighlightSection
                          mobile
                          title={`Popular Annual Events in ${selectedLocationLabel}`}
                          items={popularLocationEvents}
                          kind="event"
                          onCardClick={(item) =>
                            handleHighlightCardClick(item, "event")
                          }
                          sectionRef={(element) => {
                        sectionRefs.current["annualevents-mobile"] = element;
                          }}
                        />
                    {/* <AiDestinationHighlightSection
                      mobile
                      title={`Popular Venues to visit in ${selectedLocationLabel}`}
                      items={popularVenues}
                      kind="venue"
                      onCardClick={(item) =>
                        handleHighlightCardClick(item, "venue")
                      }
                      sectionRef={(element) => {
                        sectionRefs.current["venues-mobile"] = element;
                      }}
                    /> */}
                        <AiDestinationHighlightSection
                          mobile
                          title={`Popular News in ${selectedLocationLabel}`}
                          items={popularLocationNews}
                          kind="news"
                          onCardClick={(item) =>
                            handleHighlightCardClick(item, "news")
                          }
                          onViewMore={handleNewsViewMore}
                          sectionRef={(element) => {
                            sectionRefs.current["news-mobile"] = element;
                          }}
                        />
                        <AiDestinationHighlightSection
                          mobile
                          title={`Popular Blogs in ${selectedLocationLabel}`}
                          items={popularLocationBlogs}
                          kind="blog"
                          onCardClick={(item) =>
                            handleHighlightCardClick(item, "blog")
                          }
                          onViewMore={handleBlogsViewMore}
                          sectionRef={(element) => {
                            sectionRefs.current["blogs-mobile"] = element;
                          }}
                    />
                    <div
                      ref={(element) => {
                        sectionRefs.current["valueaddedservices-mobile"] =
                          element;
                      }}
                      className="mb-6 scroll-mt-24"
                    >
                      <h2 className="text-sm sm:text-base md:text-subtitle text-gray-200 font-semibold leading-tight mb-4">
                        Value Added Services in {selectedLocationLabel}
                      </h2>
                      <div className="flex md:hidden flex-nowrap overflow-x-auto snap-x snap-mandatory gap-4 pb-2 custom-scrollbar-hide">
                        {mobileValueAddedServiceItems.map((service) => {
                          const isDisabled = !service.path;

                          const serviceLabel =
                            getValueAddedServiceLabel(service);

                          return (
                            <button
                              key={serviceLabel}
                              type="button"
                              onClick={() =>
                                handleValueAddedServiceClick(service)
                              }
                              disabled={isDisabled}
                              className={`relative overflow-hidden w-[calc(85%-0.5rem)] flex-shrink-0 snap-start rounded-3xl px-3 py-5 text-center min-h-[112px] aspect-square flex items-end justify-center transition-transform ${
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
                              <div className="flex w-full flex-col items-center justify-end pb-1">
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
                                  <span className="mt-1.5 rounded-full border border-red-400 bg-red-200 px-1.5 py-0.5 text-[8px] font-semibold normal-case text-gray-200 shadow-sm">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="hidden md:grid grid-cols-3 gap-4">
                        {valueAddedServiceItems.map((service) => {
                          const isDisabled = !service.path;
                          const serviceLabel =
                            getValueAddedServiceLabel(service);

                          return (
                            <button
                              key={serviceLabel}
                              type="button"
                              onClick={() =>
                                handleValueAddedServiceClick(service)
                              }
                              disabled={isDisabled}
                              className={`relative overflow-hidden rounded-3xl px-3 py-5 text-center min-h-[112px] aspect-square flex items-end justify-center transition-transform ${
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
                                  <span className="mt-1.5 rounded-full border border-red-400 bg-red-200 px-1.5 py-0.5 text-[8px] font-semibold normal-case text-gray-200 shadow-sm">
                                    {service.badge}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {showValueAddedServicesToggle && (
                        <div className="hidden md:block mt-0 text-right">
                          <button
                            onClick={() =>
                              setIsValueAddedServicesExpanded(
                                (prevState) => !prevState,
                              )
                            }
                            className="text-accent text-sm font-semibold hover:underline"
                          >
                            {isValueAddedServicesExpanded
                              ? "View less ←"
                              : "View more →"}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="col-span-full text-center text-sm text-gray-400 border border-dotted rounded-lg p-4">
                    No listings found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* SHOW MAP BUTTON - MOBILE ONLY */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          type="button"
          onClick={handleShowMap}
          className="bg-surface-200 text-white px-5 py-3 rounded-full flex items-center gap-2 shadow-glass hover:scale-105 transition-transform active:scale-95"
        >
          <span className="text-sm font-semibold tracking-wide">Show map</span>
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
    </>
  );
};

export default AiGlobalListingsList;
