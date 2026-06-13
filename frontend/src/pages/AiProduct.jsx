import React, { useEffect, useRef, useState } from "react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SecondaryButton from "../components/SecondaryButton";
import ReviewCard from "../components/ReviewCard";
import LeafRatings from "../components/LeafRatings";
import axios from "../utils/axios";
import renderStars from "../utils/renderStarts";
import relativeTime from "dayjs/plugin/relativeTime";
import MuiModal from "../components/Modal";
import Map from "../components/Map";
import LeafWrapper from "../components/LeafWrapper";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { ArrowLeft, Globe } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  isAlphanumeric,
  isValidEmail,
  isValidPhoneNumber,
  isValidInternationalPhone,
  noOnlyWhitespace,
} from "../utils/validators";
import { useDispatch, useSelector } from "react-redux";
import AmenitiesList from "../components/AmenitiesList";
import { FaCheck } from "react-icons/fa";
import TransparentModal from "../components/TransparentModal";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";
import { setFormValues } from "../features/locationSlice.js";
import { readSelectedDestination } from "../utils/selectedDestinationSession";

dayjs.extend(relativeTime);

const AiProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = useParams();
  const [searchParams] = useSearchParams();
  const locationState = location.state || {};
  const { companyId: stateCompanyId, type: stateType } = locationState;
  const typeFromQuery = searchParams.get("companyType")?.trim() || null;
  const companyName = company ? company.trim() : "";
  const companyId = stateCompanyId || null;
  const type = stateType || typeFromQuery || null;
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const userId = auth?.user?._id || auth?.user?.id;

  const reviewerName = auth?.user?.fullName?.trim() || "";

  const [selectedReview, setSelectedReview] = useState([]);
  const [showAmenities, setShowAmenities] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // Mobile specific states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);
  const carouselRef = useRef(null);
  const reviewScrollRef = useRef(null); // For Mobile/Tablet
  const desktopReviewScrollRef = useRef(null); // For Desktop

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };

  // const handleReviewScroll = (direction) => {
  //   const container = reviewScrollRef.current;
  //   if (!container) return;

  //   const scrollAmount = 400; // Adjust scroll distance as needed
  //   const newScrollLeft = direction === 'left'
  //     ? container.scrollLeft - scrollAmount
  //     : container.scrollLeft + scrollAmount;

  //   container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  // };

  const normalizePhoneNumber = (value) =>
    value ? value.replace(/\s+/g, "") : "";

  const handleEnquiryMobileChange = (onChange, value, info) => {
    const nationalNumber = info?.nationalNumber?.replace(/\D/g, "") || "";

    if (info?.countryCode === "IN" && nationalNumber.length > 10) return;

    onChange(value);
  };

  const axiosPrivate = useAxiosPrivate();

  const { data: companyDetails, isPending: isCompanyDetails } = useQuery({
    queryKey: [
      "companyDetails",
      companyId,
      companyName || "unknown",
      userId || "guest",
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (companyId) {
        params.set("companyId", companyId);
      } else if (companyName) {
        params.set("companyName", companyName);
      }
      if (type) {
        params.set("companyType", type);
      }
      if (userId) {
        params.set("userId", userId);
      }
      const url = `company/get-single-company-data?${params.toString()}`;
      const response = await axios.get(url);
      return response?.data;
    },
    enabled: !!companyId || !!companyName,
    refetchOnMount: "always",
  });

  const infiniteReviews =
    companyDetails?.reviews?.length > 2
      ? [...companyDetails.reviews, ...companyDetails.reviews]
      : companyDetails?.reviews || [];

  useEffect(() => {
    // Helper function for the scrolling logic
    const setupAutoScroll = (containerRef) => {
      const container = containerRef.current;
      // We need at least one full set of reviews to loop
      if (!container || (companyDetails?.reviews?.length || 0) <= 2)
        return null;

      const interval = setInterval(() => {
        const { scrollLeft, offsetWidth, scrollWidth } = container;

        // The width of a single review card + gap
        // Based on your CSS: min-w-[300px] md:min-w-[400px] + gap-6 (24px)
        // We calculate the width of one "set" of reviews.
        const singleSetWidth = scrollWidth / 2;

        // 2. Logic for continuous loop
        // If we have scrolled past the first set (into the duplicated set),
        // instantly reset scroll to the beginning.
        if (scrollLeft >= singleSetWidth) {
          container.scrollTo({ left: 0, behavior: "auto" }); // Instant reset, no animation
        } else {
          // Normal smooth scroll to the right
          container.scrollBy({ left: 300, behavior: "smooth" });
        }
      }, 3000);

      return interval;
    };

    // Setup for both views
    const desktopInterval = setupAutoScroll(desktopReviewScrollRef);
    const mobileInterval = setupAutoScroll(reviewScrollRef);

    return () => {
      if (desktopInterval) clearInterval(desktopInterval);
      if (mobileInterval) clearInterval(mobileInterval);
    };
  }, [companyDetails?.reviews]);

  useEffect(() => {
    const companyType = companyDetails?.companyType?.trim();
    if (!companyType) return;

    const params = new URLSearchParams(location.search);
    const currentType = params.get("companyType")?.trim();

    if (currentType === companyType) return;

    params.set("companyType", companyType);

    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
      },
      {
        replace: true,
        state: location.state,
      },
    );
  }, [
    companyDetails?.companyType,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  const companyImages = companyDetails?.images?.slice(0, 4) || [];
  const showMore = (companyDetails?.images?.length || 0) > 4;
  const selectedDestination = readSelectedDestination();
  const matchedSessionTitle =
    selectedDestination?.country === companyDetails?.country?.trim().toLowerCase() &&
      selectedDestination?.city === companyDetails?.state?.trim().toLowerCase()
      ? selectedDestination?.title
      : "";
  const displayStateLabel =
    location.state?.selectedStateLabel || matchedSessionTitle || companyDetails?.state;
  const breadcrumbState = {
    continent: companyDetails?.continent || "Asia",
    country: companyDetails?.country,
    state: companyDetails?.state,
    stateLabel: displayStateLabel,
    companyType: companyDetails?.companyType,
  };

  useEffect(() => {
    const currentLoading = Boolean(location.state?.breadcrumbLoading);
    if (currentLoading === isCompanyDetails) return;

    navigate(location.pathname + location.search, {
      replace: true,
      state: {
        ...location.state,
        breadcrumbLoading: isCompanyDetails,
      },
    });
  }, [
    isCompanyDetails,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  useEffect(() => {
    const trail = [
      { label: breadcrumbState.continent, path: "/search/worldranking/results" },
      {
        label: breadcrumbState.country,
        path: `/search/worldranking/results`,
      },
      {
        label: breadcrumbState.stateLabel,
        path: `/ai-verticals?country=${encodeURIComponent(
          breadcrumbState.country || "",
        )}&state=${encodeURIComponent(breadcrumbState.state || "")}`,
      },
      {
        label: getCompanyTypeBreadcrumbLabel(breadcrumbState.companyType),
        path: `/ai-listings-list?country=${encodeURIComponent(
          breadcrumbState.country || "",
        )}&location=${encodeURIComponent(
          breadcrumbState.state || "",
        )}&category=${encodeURIComponent(breadcrumbState.companyType || "")}`,
      },
      {
        label: companyDetails?.companyName || companyName,
        truncate: true,
      },
    ].filter((item) => item.label);

    if (trail.length === 0) return;
    const currentTrail = location.state?.stickyBreadcrumbs || [];
    if (JSON.stringify(currentTrail) === JSON.stringify(trail)) return;

    navigate(location.pathname + location.search, {
      replace: true,
      state: {
        ...location.state,
        stickyBreadcrumbs: trail,
      },
    });
  }, [
    breadcrumbState.companyType,
    breadcrumbState.continent,
    breadcrumbState.country,
    breadcrumbState.state,
    breadcrumbState.stateLabel,
    companyDetails?.companyName,
    companyName,
    location.pathname,
    location.search,
    location.state,
    navigate,
  ]);

  const getCompanyTypeBreadcrumbLabel = (companyType) => {
    const companyTypeLabelMap = {
      coworking: "Co-Working",
      hostel: "Hostel",
      coliving: "Co-Living",
      meetingroom: "MeetingRooms",
      cafe: "Cafes",
      workation: "Workation",
    };

    return companyTypeLabelMap[companyType?.toLowerCase()] || companyType;
  };

  const handleBreadcrumbNavigate = (breadcrumbKey) => {
    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : value;

    const normalizedContinent = normalizeValue(breadcrumbState.continent);
    const normalizedCountry = normalizeValue(breadcrumbState.country);
    const normalizedLocation = normalizeValue(breadcrumbState.state);
    const normalizedCategory = normalizeValue(breadcrumbState.companyType);

    const isCompanyTypeClick = breadcrumbKey === "companyType";

    dispatch(
      setFormValues({
        continent: normalizedContinent || "",
        country: normalizedCountry || "",
        location: normalizedLocation || "",
        category: isCompanyTypeClick ? normalizedCategory || "" : "",
        count: "",
      }),
    );

    if (isCompanyTypeClick) {
      navigate(
        `/ai-listings-list?country=${normalizedCountry || ""}&location=${
          normalizedLocation || ""
        }&category=${normalizedCategory || ""}`,
        {
          state: {
            ...location.state,
            selectedStateLabel: breadcrumbState.stateLabel,
            breadcrumbFilters: {
              continent: normalizedContinent || "",
              country: normalizedCountry || "",
              location: normalizedLocation || "",
              category: normalizedCategory || "",
            },
          },
        },
      );
      return;
    }

    navigate(
      `/ai-verticals?country=${normalizedCountry || ""}&state=${
        normalizedLocation || ""
      }`,
      {
        state: {
          ...location.state,
          selectedStateLabel: breadcrumbState.stateLabel,
          breadcrumbFilters: {
            continent: normalizedContinent || "",
            country: normalizedCountry || "",
            location: normalizedLocation || "",
          },
        },
      },
    );
  };

  const handleBackButtonClick = () => {
    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : "";

    const fallbackCountry = normalizeValue(companyDetails?.country);
    const fallbackState = normalizeValue(companyDetails?.state);
    const returnTo = location.state?.returnTo;

    if (returnTo?.pathname) {
      navigate(
        {
          pathname: returnTo.pathname,
          search:
            returnTo.search ||
            `?country=${fallbackCountry || ""}&state=${fallbackState || ""}`,
        },
        { state: location.state },
      );
      return;
    }

    if (fallbackCountry && fallbackState) {
      navigate(
        `/ai-verticals?country=${fallbackCountry}&state=${fallbackState}`,
        {
          state: location.state,
        },
      );
      return;
    }

    navigate(-1);
  };

  const handleWriteReviewClick = () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setIsAddReviewOpen(true);
  };

  const inclusions =
    companyDetails?.inclusions?.split(",").map((item) => {
      return item?.split(" ")?.length
        ? item?.split(" ").join("")?.trim()
        : item?.trim();
    }) || [];

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      fullName: "",
      noOfPeople: 0,
      mobileNumber: "",
      email: "",
      startDate: null,
      endDate: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (auth?.user) {
      const fullName = auth.user.fullName || "";

      reset({
        fullName,
        mobileNumber: auth.user.mobile || "",
        email: auth.user.email || "",
        noOfPeople: 0,
        startDate: null,
        endDate: null,
      });
    }
  }, [auth, reset]);

  const selectedStartDate = watch("startDate");

  const {
    handleSubmit: handlesubmitSales,
    control: salesControl,
    reset: salesReset,
    formState: { errors: salesErrors },
  } = useForm({
    defaultValues: {
      fullName: "",
      mobileNumber: 0,
      email: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit: handleSubmitReview,
    control: reviewControl,
    reset: resetReview,
    setValue: setReviewValue,
    formState: { errors: reviewErrors },
  } = useForm({
    defaultValues: {
      name: "",
      starCount: 5,
      description: "",
      reviewSource: "",
      reviewLink: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (reviewerName) {
      setReviewValue("name", reviewerName, { shouldValidate: true });
    }
  }, [reviewerName, setReviewValue]);

  const { mutate: submitEnquiry, isPending: isSubmitting } = useMutation({
    mutationKey: ["submitEnquiry"],
    mutationFn: async (data) => {
      const response = await axios.post("/forms/add-new-b2c-form-submission", {
        ...data,
        startDate: data.startDate
          ? dayjs(data.startDate).format("YYYY-MM-DD")
          : "",
        endDate: data.endDate ? dayjs(data.endDate).format("YYYY-MM-DD") : "",
        country: companyDetails?.country,
        state: companyDetails?.state,
        companyType: companyDetails?.companyType,
        personelCount: parseInt(data?.noOfPeople),
        companyName: companyDetails?.companyName,
        sheetName: "All_Enquiry",
        phone: data?.mobileNumber,
        company: companyDetails?._id,
        companyId: companyDetails?.companyId,
        source: "roamiq",
        productType: companyDetails?.companyType,
      });
      return response.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(data.message);
      reset();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Something went wrong";
      showErrorAlert(errorMessage);
    },
  });

  const { mutate: submitReview, isPending: isSubmittingReview } = useMutation({
    mutationKey: ["submitReview", companyDetails?.companyId],
    mutationFn: async (data) => {
      const payload = {
        businessId: companyDetails?.businessId,
        name: data.name?.trim() || reviewerName || "Anonymous",
        starCount: Number(data.starCount),
        description: data.description?.trim(),
        reviewSource: "RoamIQ Website",
        reviewLink: "",
      };
      const response = await axios.post("/review", {
        ...payload,
      });
      return response?.data;
    },
    onSuccess: () => {
      showSuccessAlert("Review submitted successfully.");
      resetReview();
      setIsAddReviewOpen(false);
      queryClient.invalidateQueries({ queryKey: ["companyDetails"] });
    },
    onError: (error) => {
      showErrorAlert(
        error?.response?.data?.message || "Unable to submit review.",
      );
    },
  });

  const { mutate: submitSales, isPending: isSubmittingSales } = useMutation({
    mutationKey: ["submitSales"],
    mutationFn: async (data) => {
      const response = await axios.post("/forms/add-new-b2c-form-submission", {
        ...data,
        pocName: companyDetails?.poc?.name || "Sales Team",
        pocCompany: companyDetails?.companyName,
        pocDesignation: companyDetails?.poc?.designation,
        sheetName: "All_POC_Contact",
        mobile: data.mobileNumber,
      });
      return response.data;
    },
    onSuccess: (data) => {
      showSuccessAlert(data.message);
      salesReset();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Something went wrong";
      showErrorAlert(errorMessage);
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    if (companyImages?.length && !selectedImage) {
      setSelectedImage(companyImages[0]);
    }
  }, [companyImages, selectedImage]);

  const reviewData = isCompanyDetails
    ? []
    : companyDetails?.reviews?.map((item) => ({
        ...item,
        stars: item.starCount,
        message: item.description,
        date: dayjs(item.createdAt).fromNow(),
      }));

  const forMapsData = {
    id: companyDetails?._id,
    lat: companyDetails?.latitude,
    lng: companyDetails?.longitude,
    name: companyDetails?.companyName,
    companyTitle: companyDetails?.companyTitle,
    googleMap: companyDetails?.googleMap,
    location: companyDetails?.city,
    reviews: companyDetails?.totalReviews,
    ratings: companyDetails?.ratings,
    image:
      companyDetails?.images?.[0]?.url ||
      "https://biznest.co.in/assets/img/projects/subscription/Managed%20Workspace.webp  ",
  };

  const shareUrl = (() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (companyDetails?.companyType) {
        url.searchParams.set("companyType", companyDetails.companyType);
      }
      return url.toString();
    }
    return companyDetails?.websiteTemplateLink || "";
  })();

  const shareTitle = companyDetails?.companyName
    ? `Check out ${companyDetails.companyName}`
    : "Check out this listing";
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  const shareLinks = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text= ${encodeURIComponent(
        `${shareTitle} ${shareUrl}`.trim(),
      )}`,
      icon: FaWhatsapp,
      iconClassName: "text-[#25D366]",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u= ${encodeURIComponent(
        shareUrl,
      )}`,
      icon: FaFacebookF,
      iconClassName: "text-[#1877F2]",
    },
    {
      id: "twitter",
      label: "X",
      href: `https://twitter.com/intent/tweet?text= ${encodeURIComponent(
        shareTitle,
      )}&url=${encodeURIComponent(shareUrl)}`,
      icon: FaTwitter,
      iconClassName: "text-gray-200",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url= ${encodeURIComponent(
        shareUrl,
      )}`,
      icon: FaLinkedinIn,
      iconClassName: "text-[#0A66C2]",
    },
  ];

  const mapsData = [forMapsData];

  const handleCopyShareLink = async () => {
    if (!shareUrl) return;
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2000);
      return;
    }

    const fallbackInput = document.createElement("input");
    fallbackInput.value = shareUrl;
    document.body.appendChild(fallbackInput);
    fallbackInput.select();
    document.execCommand("copy");
    document.body.removeChild(fallbackInput);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2000);
  };

  const [heartClicked, setHeartClicked] = useState(null);

  useEffect(() => {
    if (!companyDetails) return;
    if (heartClicked === null) {
      setHeartClicked(companyDetails?.isLiked || false);
    }
  }, [companyDetails, heartClicked]);

  const { mutate: toggleLike } = useMutation({
    mutationFn: async (isLikedNow) => {
      const response = await axiosPrivate.patch(`/user/like`, {
        listingId: companyDetails?._id,
        userId,
        isLiked: isLikedNow,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userLikes"]);
      queryClient.invalidateQueries(["globallistings"]);
    },
    onError: (error) => {
      showErrorAlert(error.response?.data?.message || "Something went wrong");
    },
  });

  const goToHostsContentCopyright = () => {
    if (window.location.hostname.includes("localhost")) {
      window.location.href =
        "http://hosts.localhost:5173/content-and-copyright";
    } else {
      window.location.href = "https://hosts.yourdomain.com/content-and-copyright ";
    }
  };

  return (
    <div className="pb-4 pt-4 px-4 sm:px-0 sm:pt-0 bg-surface animate-fade-in">
      {/* Share Modal - Shared between both views */}
      <TransparentModal
        open={shareMenuOpen}
        onClose={() => setShareMenuOpen(false)}
        bgColor="bg-surface-50"
        width="w-full max-w-md"
        height="h-auto max-h-[90vh]"
      >
        <div className="space-y-4">
          <div>
            <p className="text-base font-semibold text-gray-300">
              Share this listing
            </p>
            <p className="text-xs text-gray-400">
              Choose a platform to share the listing link.
            </p>
          </div>
          <div className="rounded-lg border border-glass-border bg-surface-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Listing URL
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-full border border-glass-border bg-surface-100 px-3 py-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs text-gray-300 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white transition hover:bg-accent-hover"
              >
                {hasCopiedLink ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {shareLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShareMenuOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-glass-border px-3 py-3 text-xs font-medium text-gray-300 transition hover:border-glass-border hover:bg-surface-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100">
                    <Icon className={item.iconClassName} size={18} />
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </TransparentModal>

      {/* ==================== DESKTOP VIEW (lg and above) ==================== */}
      <div className="hidden lg:block min-w-[70%] max-w-[80rem] lg:max-w-[99%] mx-0 md:mx-auto md:px-10">
        <div className="pb-4">
          {/* Breadcrumb - Desktop Only */}
          <nav
            aria-label="Breadcrumb"
            className="hidden mb-4 items-center text-accent"
          >
            <button
              type="button"
              onClick={handleBackButtonClick}
              aria-label="Go back"
              className="inline-flex items-center justify-center rounded-full border border-accent p-1 text-accent"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="mx-2">{">"}</span>
            {[
              {
                key: "continent",
                label: companyDetails?.continent,
                isLink: true,
              },
              { key: "country", label: companyDetails?.country, isLink: true },
              { key: "state", label: companyDetails?.state, isLink: true },
              {
                key: "companyType",
                label: getCompanyTypeBreadcrumbLabel(
                  companyDetails?.companyType,
                ),
                isLink: true,
              },
              {
                key: "companyName",
                label: companyDetails?.companyName || companyName,
                isLink: false,
              },
            ]
              .filter((item) => item.label)
              .map((item, index, items) => (
                <span key={`${item.label}-${index}`}>
                  {item.isLink ? (
                    <button
                      type="button"
                      onClick={() => handleBreadcrumbNavigate(item.key)}
                      className="text-accent hover:text-accent transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    item.label
                  )}
                  {index < items.length - 1 ? (
                    <span className="mx-2">{">"}</span>
                  ) : null}
                </span>
              ))}
          </nav>
          <h1 className="text-title font-semibold text-gray-200">
            {companyDetails?.companyTitle || "Loading Title..."}
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          {/* Desktop Image Section */}
          {isCompanyDetails ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-hidden animate-pulse">
              <div className="w-full h-[28.5rem] bg-surface-100 rounded-md" />
              <div className="grid grid-cols-2 gap-1">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-56 bg-surface-100 rounded-md"
                  />
                ))}
              </div>
            </div>
          ) : companyImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 border border-dashed border-glass-border rounded-md">
              <img
                src="https://via.placeholder.com/150x100?text=No+Images "
                alt="No images"
                className="w-40 h-auto"
              />
              <p className="text-gray-400 text-sm">
                No images have been provided by the company.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-hidden">
              <div className="w-full h-[28.5rem] overflow-hidden rounded-md">
                <img
                  src={
                    companyDetails?.images?.[0]?.url ||
                    "https://via.placeholder.com/400x200?text=No+Image+Found "
                  }
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() =>
                    navigate("images", {
                      state: {
                        companyName: companyDetails?.companyName,
                        images: companyDetails?.images,
                        selectedImageId: selectedImage?._id,
                        ...breadcrumbState,
                      },
                    })
                  }
                  alt="Selected"
                />
              </div>

              <div className="grid grid-cols-2 gap-1">
                {companyDetails?.images?.slice(1, 5).map((item, index) => (
                  <div
                    key={item._id}
                    className={`relative w-full h-56 overflow-hidden rounded-md cursor-pointer border-2 ${
                      selectedImage?._id === item._id
                        ? "border-accent"
                        : "border-transparent"
                    }`}
                    onClick={() =>
                      navigate("images", {
                        state: {
                          companyName: companyDetails?.companyName,
                          images: companyDetails?.images,
                          selectedImageId: item._id,
                          ...breadcrumbState,
                        },
                      })
                    }
                  >
                    <img
                      src={item.url}
                      alt="company-thumbnail"
                      className="w-full h-full object-cover"
                    />
                    {showMore && index === 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("images", {
                              state: {
                                companyName: companyDetails?.companyName,
                                images: companyDetails?.images,
                                ...breadcrumbState,
                              },
                            });
                          }}
                          className="bg-surface-200 text-white text-sm px-3 py-1 rounded shadow-card font-medium"
                        >
                          +{companyDetails.images.length - 4} more
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desktop About and Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="flex flex-col gap-8">
              {isCompanyDetails ? (
                <div className="w-full h-36 bg-surface-100 animate-pulse rounded-md" />
              ) : !(
                  (typeof companyDetails?.logo === "string" &&
                    companyDetails.logo) ||
                  companyDetails?.logo?.url
                ) ? (
                <div className="w-full h-36 flex items-center justify-center bg-surface-100 border border-dashed border-glass-border rounded-md">
                  <span className="text-gray-400 text-sm">
                    No company logo available
                  </span>
                </div>
              ) : (
                <div className="w-full h-36 overflow-hidden rounded-md">
                  <img
                    src={
                      (typeof companyDetails?.logo === "string" &&
                        companyDetails.logo) ||
                      companyDetails?.logo?.url
                    }
                    alt="company-logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-title font-medium text-gray-300 uppercase">
                    About
                  </h1>
                  <div className="items-center flex gap-2">
                    <div>
                      <button
                        type="button"
                        onClick={() => setShareMenuOpen(true)}
                        className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1 mr-2 text-small text-gray-400 transition hover:border-accent/50 hover:text-white"
                      >
                        <FiShare2 className="text-gray-400" size={14} />
                        Share
                      </button>
                    </div>

                    {companyDetails?.websiteTemplateLink && (
                      <div>
                        <a
                          href={companyDetails?.websiteTemplateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-small underline text-accent"
                        >
                          View Website
                        </a>
                      </div>
                    )}

                    <div
                      onClick={() => {
                        if (!userId) {
                          navigate("/login");
                          return;
                        }
                        const newLiked = !heartClicked;
                        setHeartClicked(newLiked);
                        toggleLike(newLiked);
                      }}
                      className="cursor-pointer relative"
                    >
                      {heartClicked ? (
                        <IoIosHeart className="text-[#ff5757]" size={22} />
                      ) : (
                        <IoIosHeartEmpty size={22} />
                      )}
                    </div>
                  </div>
                </div>

                {isCompanyDetails ? (
                  <div className="space-y-1 animate-pulse">
                    <div className="h-3 bg-surface-100 rounded w-3/4" />
                    <div className="h-3 bg-surface-100 rounded w-2/3" />
                    <div className="h-3 bg-surface-100 rounded w-1/2" />
                  </div>
                ) : !companyDetails?.about ? (
                  <div className="place-content-center w-full h-full">
                    <p className="text-sm text-gray-400 italic">
                      Company information is not provided.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-200">
                    {companyDetails.about.replace(/\\n/g, " ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="glass-card flex gap-1 items-center p-4">
                <div className="text-tiny w-full hidden lg:flex justify-center items-center">
                  <LeafWrapper height="3rem" width={"2rem"}>
                    <div className="text-gray-200 font-semibold flex lg:text-subtitle flex-col leading-5 items-center">
                      <span>Guest</span>
                      <span>Favorite</span>
                    </div>
                  </LeafWrapper>
                </div>
                <div className="w-full hidden lg:flex">
                  <p className="text-tiny">
                    One of the most loved places on RoamIQ, according to guests
                  </p>
                </div>
                <div className="flex w-full lg:w-1/2 gap-1 justify-end">
                  <div className="flex flex-col gap-0 justify-center items-center">
                    <p className="text-tiny lg:text-subtitle">
                      {companyDetails?.ratings || 0}
                    </p>
                    <span className="text-tiny flex lg:text-small font-medium">
                      {renderStars(companyDetails?.ratings || 0)}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-glass-border mx-2 my-auto lg:hidden" />
                  <div className="text-tiny w-full flex justify-center items-center lg:hidden">
                    <LeafWrapper height="3rem" width={"2rem"}>
                      <div className="text-gray-200 font-semibold flex text-tiny lg:text-subtitle flex-col leading-5 items-center">
                        <span>Guest</span>
                        <span>Favorite</span>
                      </div>
                    </LeafWrapper>
                  </div>
                  <div className="w-px h-10 bg-glass-border mx-2 my-auto" />
                  <div className="flex flex-col gap-4 lg:gap-0 justify-center items-center">
                    <p className="text-tiny lg:text-subtitle mt-1">
                      {companyDetails?.reviewCount ||
                        companyDetails?.totalReviews ||
                        0}
                    </p>
                    <span className="text-tiny lg:text-small font-medium">
                      Reviews
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card flex flex-col gap-4 p-6 rounded-xl">
                <h1 className="text-card-title text-gray-200 font-semibold leading-normal">
                  Enquire & Receive Quote
                </h1>
                <form
                  onSubmit={handleSubmit((data) => {
                    const formattedMobileNumber = normalizePhoneNumber(
                      data.mobileNumber,
                    );
                    submitEnquiry({
                      ...data,
                      mobileNumber: formattedMobileNumber,
                    });
                  })}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Controller
                    name="fullName"
                    rules={{
                      required: "Full Name is required",
                      validate: {
                        noOnlyWhitespace,
                        isAlphanumeric,
                      },
                    }}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        variant="standard"
                        size="small"
                        helperText={errors?.fullName?.message}
                        sx={{ marginTop: 3 }}
                        error={!!errors.fullName}
                      />
                    )}
                  />
                  <Controller
                    name="noOfPeople"
                    control={control}
                    rules={{
                      required: "No. of people is required",
                      validate: (value) =>
                        value > 0 || "At least one person is required",
                    }}
                    render={({ field }) => (
                      <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400 font-medium">
                          No. Of People
                        </label>
                        <div className="flex items-center border-b border-glass-border py-1 w-full max-w-xs">
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                Math.max(0, Number(field.value || 0) - 1),
                              )
                            }
                            className="px-3 py-1 text-lg font-semibold text-gray-400 hover:text-accent"
                          >
                            −
                          </button>
                          <input
                            {...field}
                            readOnly
                            className="w-full text-center outline-none bg-transparent text-gray-300 text-sm font-medium"
                            value={field.value || 0}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(Number(field.value || 0) + 1)
                            }
                            className="px-3 py-1 text-lg font-semibold text-gray-400 hover:text-accent"
                          >
                            +
                          </button>
                        </div>
                        {errors?.noOfPeople && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.noOfPeople.message}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="mobileNumber"
                    control={control}
                    rules={{
                      required: "Mobile number is required",
                      validate: {
                        isValidInternationalPhone,
                      },
                    }}
                    render={({ field }) => (
                      <MuiTelInput
                        {...field}
                        label="Mobile Number"
                        fullWidth
                        defaultCountry="IN"
                        variant="standard"
                        size="small"
                        value={field.value || ""}
                        onChange={(value, info) => {
                          handleEnquiryMobileChange(
                            field.onChange,
                            value,
                            info,
                          );
                        }}
                        helperText={errors?.mobileNumber?.message}
                        error={!!errors.mobileNumber}
                      />
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      validate: {
                        isValidEmail,
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        type="email"
                        variant="standard"
                        size="small"
                        helperText={errors?.email?.message}
                        error={!!errors.email}
                      />
                    )}
                  />

                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const end = watch("endDate");
                        if (!end || !value) return true;
                        const startDate = dayjs(value);
                        const endDate = dayjs(end);
                        return (
                          startDate.isBefore(endDate) ||
                          "Start date must be before end date"
                        );
                      },
                    }}
                    render={({ field }) => (
                      <DesktopDatePicker
                        {...field}
                        label="Start Date"
                        disablePast
                        format="DD-MM-YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "standard",
                            error: !!errors.startDate,
                            helperText: errors?.startDate?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const start = watch("startDate");
                        if (!start || !value) return true;
                        const startDate = dayjs(start);
                        const endDate = dayjs(value);
                        return (
                          endDate.isAfter(startDate) ||
                          "End date must be after start date"
                        );
                      },
                    }}
                    render={({ field }) => (
                      <DesktopDatePicker
                        {...field}
                        label="End Date"
                        format="DD-MM-YYYY"
                        disablePast
                        disabled={!selectedStartDate}
                        value={field.value ? dayjs(field.value) : null}
                        onChange={field.onChange}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "standard",
                            error: !!errors.endDate,
                            helperText: errors?.endDate?.message,
                          },
                        }}
                      />
                    )}
                  />

                  <div className="flex justify-center items-center lg:col-span-2">
                    <SecondaryButton
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      title={"GET QUOTE"}
                      type={"submit"}
                      externalStyles={"w-1/2"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          <hr className="my-5 lg:my-10" />

          {/* Desktop Inclusions */}
          <div className="flex flex-col gap-8 w-full">
            <h1 className="text-title text-gray-300 font-medium uppercase">
              What Inclusions does it offer
            </h1>
            {inclusions.length === 0 ? (
              <div className="w-full glass-card border-dotted p-6 text-center text-gray-400">
                Inclusions not available
              </div>
            ) : (
              <div className="flex flex-col gap-10 w-full">
                <AmenitiesList
                  type={companyDetails?.companyType.toLowerCase() || ""}
                  inclusions={inclusions}
                />
              </div>
            )}
          </div>

          <hr className="my-5 lg:my-10" />

          {/* Desktop Reviews Section */}
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
              <h1 className="text-main-header font-medium mt-5">
                <LeafRatings
                  ratings={companyDetails?.ratings || 0}
                  align="items-start"
                />
              </h1>
              <p className="text-subtitle my-4 font-medium">Guest Favorite</p>
              <span className="text-content text-center">
                This place is a guest favourite based on <br /> ratings, reviews
                and reliability
              </span>
            </div>

            {/* Desktop Auto-Scrolling Reviews Container */}
            <div
              ref={desktopReviewScrollRef}
              className="flex overflow-x-auto gap-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory pb-4 w-full items-center"
            >
              {infiniteReviews.length > 0 ? (
                <>
                  {infiniteReviews.map((review, index) => (
                    <div
                      key={review._id || `${review._id}-${index}`} // Ensure unique keys for duplicates
                      className="w-full md:w-[calc((100%-3rem)/3)] flex-shrink-0 snap-center h-full"
                    >
                      <ReviewCard
                        handleClick={() => {
                          setSelectedReview(review);
                          setOpen(true);
                        }}
                        review={review}
                        reviewTextClassName="h-[60px]"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-full glass-card border-dotted p-6 text-center text-sm text-gray-400 h-40 flex justify-center items-center w-full">
                  No reviews yet.
                </div>
              )}
            </div>
            <div className="text-right">
              <a
                className="text-accent text-sm font-semibold hover:underline"
                href={companyDetails?.googleMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                View more →
              </a>
            </div>

            {/* <hr className="my-5 lg:my-10" /> */}
            {/* <div className="flex flex-col justify-center items-center max-w-4xl mx-auto">
              <h1 className="text-main-header font-medium mt-5">
                <LeafRatings
                  ratings={companyDetails?.ratings || 0}
                  align="items-start"
                />
              </h1>

              <p className="text-subtitle  my-4 font-medium">Guest Favorite</p>
              <span className="text-content text-center">
                This place is a guest favourite based on <br /> ratings, reviews
                and reliability
              </span>
            </div> */}
            <div className="flex justify-center">
              <button
                type="button"
                className="flex rounded-full items-center cursor-pointer justify-center  gap-2
        bg-accent hover:bg-secondary-light text-primary
        text-content leading-5
        w-3/2 px-6 py-3 undefined"
                onClick={handleWriteReviewClick}
                disabled={!companyDetails?.companyId}
              >
                WRITE A REVIEW
              </button>
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-0 lg:p-0">
              {companyDetails?.reviews?.length > 0 ? (
                companyDetails?.reviews?.slice(0, 6).map((review, index) => (
                  <ReviewCard
                    handleClick={() => {
                      setSelectedReview(review);
                      setOpen(true);
                    }}
                    key={index}
                    review={review}
                  />
                ))
              ) : (
                <div className="col-span-full glass-card border-dotted p-6 text-center text-sm text-gray-400 h-40 flex justify-center items-center">
                  No reviews yet.
                </div>
              )}
            </div> */}
            {/* <div className="text-right">
              <a
                className="text-accent text-sm font-semibold hover:underline"
                href={companyDetails?.googleMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                View more →
              </a>
            </div> */}

            <hr className="my-5 lg:my-10" />

            {/* Desktop Map */}
            <div className="w-full h-[500px] flex flex-col gap-8 rounded-xl overflow-hidden">
              <h1 className="text-title font-medium text-gray-300 uppercase">
                Where you'll be
              </h1>
              <Map
                locations={mapsData}
                disableNavigation
                disableTwoFingerScroll
              />
            </div>

            {/* Desktop Host Section */}
            {["CMP0001", "CMP0052"].includes(companyDetails?.companyId) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 pt-10">
                  <div className="flex flex-col lg:flex-row justify-center items-center col-span-1 glass-card gap-4 rounded-xl p-6 w-full">
                    <div className="flex flex-col gap-4 justify-between items-center h-full w-56">
                      <div className="w-32 aspect-square rounded-full bg-accent flex items-center justify-center text-white text-6xl font-semibold uppercase">
                        {companyDetails?.poc?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "AG"}
                      </div>
                      <div className="text-center space-y-3 h-1/2 flex flex-col justify-evenly items-center">
                        <h1 className="text-title text-gray-300 font-medium leading-10">
                          {companyDetails?.poc?.name || "Sales Team"}
                        </h1>
                        <p className="text-content">
                          {companyDetails?.poc?.designation ||
                            "Sales Department"}
                        </p>
                      </div>
                    </div>
                    <div className="w-px h-full bg-glass-border mx-2 my-auto" />
                    <div className="h-full w-56 flex flex-col justify-normal">
                      <p className="text-title text-center text-gray-300 font-medium mb-8 underline uppercase">
                        Host Details
                      </p>
                      <div className="flex flex-col gap-5 text-sm sm:text-base">
                        {[
                          "Response rate: 100%",
                          "Speaks English, Hindi, Marathi and Konkani",
                          "Responds within an hour",
                          "Lives in Velha, Goa",
                        ].map((detail, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheck className="text-accent mt-1 flex-shrink-0" />
                            <span className="leading-snug">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full glass-card rounded-xl">
                    <div className="flex flex-col h-full gap-4 rounded-xl p-6 w-full lg:w-full justify-between">
                      <h1 className="text-title text-gray-300 font-medium uppercase">
                        Connect With Host
                      </h1>
                      <form
                        onSubmit={handlesubmitSales((data) =>
                          submitSales(data),
                        )}
                        className="grid grid-cols-1 gap-4"
                      >
                        <Controller
                          name="fullName"
                          control={salesControl}
                          rules={{
                            required: "Full Name is required",
                            validate: {
                              isAlphanumeric,
                              noOnlyWhitespace,
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Full Name"
                              fullWidth
                              variant="standard"
                              size="small"
                              error={!!salesErrors?.fullName}
                              helperText={salesErrors?.fullName?.message}
                            />
                          )}
                        />
                        <Controller
                          name="mobileNumber"
                          control={salesControl}
                          rules={{
                            required: "Mobile number is required",
                            validate: {
                              isValidInternationalPhone,
                            },
                          }}
                          render={({ field }) => (
                            <MuiTelInput
                              {...field}
                              label="Mobile Number"
                              fullWidth
                              defaultCountry="IN"
                              variant="standard"
                              size="small"
                              value={field.value || ""}
                              onChange={(value) => {
                                const formattedValue =
                                  normalizePhoneNumber(value);
                                field.onChange(value);
                                console.log("Sales mobile input:", {
                                  raw: value,
                                  formatted: formattedValue,
                                });
                              }}
                              helperText={salesErrors?.mobileNumber?.message}
                              error={!!salesErrors?.mobileNumber}
                            />
                          )}
                        />
                        <Controller
                          name="email"
                          control={salesControl}
                          rules={{
                            required: "Email is required",
                            validate: { isValidEmail },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Email"
                              fullWidth
                              type="email"
                              variant="standard"
                              size="small"
                              error={!!salesErrors?.email}
                              helperText={salesErrors?.email?.message}
                            />
                          )}
                        />
                        <div className="flex justify-center items-center">
                          <SecondaryButton
                            title={"SUBMIT"}
                            type={"submit"}
                            externalStyles={"mt-6 w-1/2"}
                            disabled={isSubmittingSales}
                            isLoading={isSubmittingSales}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <hr className="mt-5 mb-0 lg:mt-10 lg:mb-0" />
              </>
            )}

            {/* Desktop Disclaimer */}
            <div className="text-[0.74rem] text-gray-400 leading-relaxed">
              <p className="mb-2">
                <b>Source:</b> All above content, images and details have been
                sourced from publicly available information.
              </p>
              <p className="mb-2">
                <b>Content and Copyright Disclaimer:</b> RoamIQ is an explorer
                services and informational platform that aggregates and presents
                publicly available information about co-working spaces,
                co-living spaces, serviced apartments, hostels, workation
                spaces, meeting rooms, working cafés and related lifestyle or
                travel services. All such information displayed on its platform,
                including images, brand names, or descriptions is shared solely
                for informational and reference purposes to help explorers/users
                discover and compare global explorer-friendly information and
                services on its central platform.
              </p>
              <p className="mb-2">
                RoamIQ does not claim ownership of any third-party logos, images,
                descriptions, or business information displayed on the platform.
                All trademarks, brand names, and intellectual property remain
                the exclusive property of their respective owners and platforms.
                The inclusion of third-party information does not imply
                endorsement, partnership, or affiliation unless explicitly
                stated.
              </p>
              <p className="mb-2">
                The content featured from other websites and platforms on RoamIQ
                is not used for direct monetization, resale, or advertising
                gain. RoamIQ's purpose is to inform and connect remote workers and travelers and
                remote working professionals by curating publicly available data
                in a transparent, good-faith manner for the ease of its users
                and to support and grow the businesses who are providing these
                services with intent to grow them and the ecosystem.
              </p>
              <p className="mt-2">
                Read the entire{" "}
                <span
                  className="underline text-accent cursor-pointer"
                  onClick={goToHostsContentCopyright}
                >
                  Content and Copyright
                </span>{" "}
                by clicking the link in our website footer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE/TABLET VIEW (below lg) ==================== */}
      <div className="lg:hidden min-w-[70%] max-w-[80rem] lg:max-w-[70rem] mx-0 md:mx-auto">
        <div className="pb-4">
          {/* Breadcrumb - Mobile/Tablet */}
          <nav
            aria-label="Breadcrumb"
            className="hidden mb-4 items-center text-accent text-[10px] md:text-sm"
          >
            <button
              type="button"
              onClick={handleBackButtonClick}
              aria-label="Go back"
              className="inline-flex items-center justify-center rounded-full border border-accent p-1 text-accent"
            >
              <ArrowLeft size={14} />
            </button>
            <span className="mx-1 md:mx-2">{">"}</span>
            {[
              {
                key: "continent",
                label: companyDetails?.continent,
                isLink: true,
              },
              { key: "country", label: companyDetails?.country, isLink: true },
              { key: "state", label: companyDetails?.state, isLink: true },
              {
                key: "companyType",
                label: getCompanyTypeBreadcrumbLabel(
                  companyDetails?.companyType,
                ),
                isLink: true,
              },
              {
                key: "companyName",
                label: companyDetails?.companyName || companyName,
                isLink: false,
              },
            ]
              .filter((item) => item.label)
              .map((item, index, items) => (
                <span key={`${item.label}-${index}`}>
                  {item.isLink ? (
                    <button
                      type="button"
                      onClick={() => handleBreadcrumbNavigate(item.key)}
                      className="text-accent hover:text-accent transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="truncate max-w-[80px] md:max-w-none inline-block align-bottom">
                      {item.label}
                    </span>
                  )}
                  {index < items.length - 1 ? (
                    <span className="mx-1 md:mx-2">{">"}</span>
                  ) : null}
                </span>
              ))}
          </nav>
          <h1 className="text-title font-semibold text-gray-200">
            {companyDetails?.companyName || "Loading Title..."}
          </h1>
        </div>

        <div className="flex flex-col gap-8">
          {/* Mobile Image Section */}
          {isCompanyDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-hidden animate-pulse">
              <div className="w-full h-[28.5rem] bg-surface-100 rounded-md" />
              <div className="grid grid-cols-2 gap-1">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-56 bg-surface-100 rounded-md"
                  />
                ))}
              </div>
            </div>
          ) : companyImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-10 border border-dashed border-glass-border rounded-md">
              <img
                src="https://via.placeholder.com/150x100?text=No+Images "
                alt="No images"
                className="w-40 h-auto"
              />
              <p className="text-gray-400 text-sm">
                No images have been provided by the company.
              </p>
            </div>
          ) : (
            <div className="w-full">
              {/* Tablet Grid Layout */}
              <div className="hidden md:grid grid-cols-2 gap-2 overflow-hidden">
                <div className="w-full h-[28.5rem] overflow-hidden rounded-md">
                  <img
                    src={
                      companyDetails?.images?.[0]?.url ||
                      "https://via.placeholder.com/400x200?text=No+Image+Found "
                    }
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() =>
                      navigate("images", {
                        state: {
                          companyName: companyDetails?.companyName,
                          images: companyDetails?.images,
                          selectedImageId: selectedImage?._id,
                        },
                      })
                    }
                    alt="Selected"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1 px-1">
                  {companyDetails?.images?.slice(1, 5).map((item, index) => (
                    <div
                      key={item._id}
                      className={`relative w-full h-56 overflow-hidden rounded-md cursor-pointer border-2 ${
                        selectedImage?._id === item._id
                          ? "border-accent"
                          : "border-transparent"
                      }`}
                      onClick={() =>
                        navigate("images", {
                          state: {
                            companyName: companyDetails?.companyName,
                            images: companyDetails?.images,
                            selectedImageId: item._id,
                          },
                        })
                      }
                    >
                      <img
                        src={item.url}
                        alt="company-thumbnail"
                        className="w-full h-full object-cover"
                      />
                      {showMore && index === 3 && (
                        <div className="absolute inset-0 bg-black/40 flex items-end justify-end p-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("images", {
                                state: {
                                  companyName: companyDetails?.companyName,
                                  images: companyDetails?.images,
                                },
                              });
                            }}
                            className="bg-surface-200 text-white text-sm px-3 py-1 rounded shadow-card font-medium"
                          >
                            +{companyDetails.images.length - 4} more
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Image Carousel */}
              <div className="md:hidden relative group -mx-2">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                  onScroll={handleScroll}
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {companyDetails?.images?.map((item, index) => (
                    <div
                      key={item._id}
                      className="w-full aspect-[4/3] flex-shrink-0 snap-center overflow-hidden"
                      onClick={() =>
                        navigate("images", {
                          state: {
                            companyName: companyDetails?.companyName,
                            images: companyDetails?.images,
                            selectedImageId: item._id,
                          },
                        })
                      }
                    >
                      <img
                        src={item.url}
                        alt={`product-img-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1.5 rounded-full bg-black/30 backdrop-blur-sm z-10">
                  {companyDetails?.images?.slice(0, 8).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        currentImageIndex === idx
                          ? "bg-white w-4"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile About and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-1">
              {isCompanyDetails ? (
                <div className="w-full h-36 bg-surface-100 animate-pulse rounded-md" />
              ) : !(
                  (typeof companyDetails?.logo === "string" &&
                    companyDetails.logo) ||
                  companyDetails?.logo?.url
                ) ? (
                <div className="w-full h-36 flex items-center justify-center bg-surface-100 border border-dashed border-glass-border rounded-md">
                  <span className="text-gray-400 text-sm">
                    No company logo available
                  </span>
                </div>
              ) : (
                <div className="w-full h-36 overflow-hidden rounded-md">
                  <img
                    src={
                      (typeof companyDetails?.logo === "string" &&
                        companyDetails.logo) ||
                      companyDetails?.logo?.url
                    }
                    alt="company-logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4 mb-4 mt-2">
                  <h1 className="text-center md:text-left text-title font-medium text-gray-300 uppercase">
                    About
                  </h1>

                  <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => setShareMenuOpen(true)}
                    >
                      <FiShare2 className="text-gray-400" size={17} />
                    </button>

                    {companyDetails?.websiteTemplateLink && (
                      <a
                        href={companyDetails?.websiteTemplateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-small font-semibold underline text-accent hover:text-accent transition-colors"
                      >
                        <Globe
                          className="text-accent md:w-[24px] md:h-[24px] lg:w-[32px] lg:h-[32px]"
                          size={20}
                        />
                      </a>
                    )}

                    <div
                      onClick={() => {
                        if (!userId) {
                          navigate("/login");
                          return;
                        }
                        const newLiked = !heartClicked;
                        setHeartClicked(newLiked);
                        toggleLike(newLiked);
                      }}
                      className="cursor-pointer relative"
                    >
                      {heartClicked ? (
                        <IoIosHeart className="text-[#ff5757]" size={22} />
                      ) : (
                        <IoIosHeartEmpty size={22} />
                      )}
                    </div>
                  </div>
                </div>

                {isCompanyDetails ? (
                  <div className="space-y-1 animate-pulse">
                    <div className="h-3 bg-surface-100 rounded w-3/4" />
                    <div className="h-3 bg-surface-100 rounded w-2/3" />
                    <div className="h-3 bg-surface-100 rounded w-1/2" />
                  </div>
                ) : !companyDetails?.about ? (
                  <div className="place-content-center w-full h-full">
                    <p className="text-sm text-gray-400 italic">
                      Company information is not provided.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p
                      className={`text-sm text-gray-200 leading-relaxed ${
                        !isAboutExpanded
                          ? "line-clamp-4 md:line-clamp-none"
                          : ""
                      }`}
                    >
                      {companyDetails.about.replace(/\\n/g, " ")}
                    </p>
                    {companyDetails.about.length > 250 && (
                      <button
                        onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                        className="md:hidden text-accent text-xs font-semibold mt-2 hover:underline focus:outline-none"
                      >
                        {isAboutExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full">
              <div className="w-full md:static lg:sticky lg:top-24 flex flex-col gap-6">
                {/* Mobile/Tablet Guest Favorite Card */}
                <div className="border border-glass-border rounded-2xl md:rounded-3xl flex flex-col lg:flex-row items-center justify-between p-4 lg:p-8 glass-card transition-all gap-6 lg:gap-0">
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-3 w-full lg:w-auto text-center sm:text-left">
                    <LeafWrapper height="4rem" width="3rem">
                      <div className="flex flex-col items-center leading-tight">
                        <span className="text-[20px] uppercase tracking-tighter text-gray-400">
                          Guest
                        </span>
                        <span className="text-gray-200 font-bold text-xl">
                          Favorite
                        </span>
                      </div>
                    </LeafWrapper>
                    <div className="hidden lg:block w-px h-8 bg-surface-100 mx-2" />
                    <p className="text-xs text-gray-400 max-w-[300px] sm:max-w-none">
                      One of the most loved places on RoamIQ
                    </p>
                  </div>

                  <div className="flex items-center justify-center lg:justify-end gap-6 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-glass-border pt-4 lg:pt-0 lg:pl-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-200">
                        {companyDetails?.ratings || "0"}
                      </span>
                      <div className="flex text-[10px] text-gray-400">
                        {renderStars(companyDetails?.ratings || 0)}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-surface-100" />
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-200">
                        {companyDetails?.reviewCount ||
                          companyDetails?.totalReviews ||
                          0}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">
                        Reviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet Enquiry Form */}
                <div className="glass-card flex flex-col gap-2 md:gap-4 p-4 md:p-5 lg:p-8 rounded-2xl max-w-full">
                  <h1 className="text-lg text-center md:text-base lg:text-xl xl:text-2xl text-gray-200 font-bold">
                    Enquire & Receive Quote
                  </h1>
                  <hr />
                  <form
                    onSubmit={handleSubmit((data) => {
                      const formattedMobileNumber = normalizePhoneNumber(
                        data.mobileNumber,
                      );
                      submitEnquiry({
                        ...data,
                        mobileNumber: formattedMobileNumber,
                      });
                    })}
                    className="grid grid-cols-1 gap-y-4 md:gap-y-5"
                  >
                    <Controller
                      name="fullName"
                      rules={{
                        required: "Full Name is required",
                        validate: {
                          noOnlyWhitespace,
                          isAlphanumeric,
                        },
                      }}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Full Name"
                          fullWidth
                          variant="standard"
                          size="small"
                          helperText={errors?.fullName?.message}
                          error={!!errors.fullName}
                        />
                      )}
                    />
                    <Controller
                      name="noOfPeople"
                      control={control}
                      rules={{
                        required: "No. of people is required",
                        validate: (value) =>
                          value > 0 || "At least one person is required",
                      }}
                      render={({ field }) => (
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-400 font-medium">
                            No. Of People
                          </label>
                          <div className="flex items-center border-b border-glass-border py-1 w-full mt-auto">
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  Math.max(0, Number(field.value || 0) - 1),
                                )
                              }
                              className="px-3 py-1 text-lg font-semibold text-gray-400 hover:text-accent"
                            >
                              −
                            </button>
                            <input
                              {...field}
                              readOnly
                              className="w-full text-center outline-none bg-transparent text-gray-300 text-sm font-medium"
                              value={field.value || 0}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(Number(field.value || 0) + 1)
                              }
                              className="px-3 py-1 text-lg font-semibold text-gray-400 hover:text-accent"
                            >
                              +
                            </button>
                          </div>
                          {errors?.noOfPeople && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.noOfPeople.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="mobileNumber"
                      control={control}
                      rules={{
                        required: "Mobile number is required",
                        validate: {
                          isValidInternationalPhone,
                        },
                      }}
                      render={({ field }) => (
                        <MuiTelInput
                          {...field}
                          label="Mobile Number"
                          fullWidth
                          defaultCountry="IN"
                          variant="standard"
                          size="small"
                          value={field.value || ""}
                          onChange={(value, info) => {
                            handleEnquiryMobileChange(
                              field.onChange,
                              value,
                              info,
                            );
                          }}
                          helperText={errors?.mobileNumber?.message}
                          error={!!errors.mobileNumber}
                        />
                      )}
                    />
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: "Email is required",
                        validate: {
                          isValidEmail,
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          fullWidth
                          type="email"
                          variant="standard"
                          size="small"
                          helperText={errors?.email?.message}
                          error={!!errors.email}
                        />
                      )}
                    />

                    <Controller
                      name="startDate"
                      control={control}
                      rules={{
                        validate: (value) => {
                          const end = watch("endDate");
                          if (!end || !value) return true;
                          const startDate = dayjs(value);
                          const endDate = dayjs(end);
                          return (
                            startDate.isBefore(endDate) ||
                            "Start date must be before end date"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <DesktopDatePicker
                          {...field}
                          label="Start Date"
                          disablePast
                          format="DD-MM-YYYY"
                          value={field.value ? dayjs(field.value) : null}
                          onChange={field.onChange}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              variant: "standard",
                              error: !!errors.startDate,
                              helperText: errors?.startDate?.message,
                            },
                          }}
                        />
                      )}
                    />

                    <Controller
                      name="endDate"
                      control={control}
                      rules={{
                        validate: (value) => {
                          const start = watch("startDate");
                          if (!start || !value) return true;
                          const startDate = dayjs(start);
                          const endDate = dayjs(value);
                          return (
                            endDate.isAfter(startDate) ||
                            "End date must be after start date"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <DesktopDatePicker
                          {...field}
                          label="End Date"
                          format="DD-MM-YYYY"
                          disablePast
                          disabled={!selectedStartDate}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={field.onChange}
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              variant: "standard",
                              error: !!errors.endDate,
                              helperText: errors?.endDate?.message,
                            },
                          }}
                        />
                      )}
                    />

                    <div className="flex justify-center items-center mt-4 md:mt-8">
                      <SecondaryButton
                        disabled={isSubmitting}
                        isLoading={isSubmitting}
                        title={"GET QUOTE"}
                        type={"submit"}
                        externalStyles={
                          "w-full md:w-3/4 lg:w-1/2 rounded-full py-3 shadow-glass"
                        }
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-5 md:my-10" />

          {/* Mobile Inclusions */}
          <div className="flex flex-col gap-4 w-full">
            <h1 className="text-lg text-center md:text-base lg:text-xl xl:text-2xl text-gray-200 font-bold">
              What Inclusions does it offer
            </h1>
            <hr />
            {inclusions.length === 0 ? (
              <div className="w-full glass-card border-dotted p-6 text-center text-gray-400">
                Inclusions not available
              </div>
            ) : (
              <div className="flex flex-col gap-10 w-full">
                <AmenitiesList
                  type={companyDetails?.companyType.toLowerCase() || ""}
                  inclusions={inclusions}
                />
              </div>
            )}
          </div>

          <hr className="my-5 md:my-10" />

          {/* Mobile Reviews Section */}
          <div className="flex flex-col gap-8 w-full">
            <div className="flex flex-col justify-center items-center max-w-4xl mx-auto mb-4">
              <h1 className="text-4xl md:text-6xl lg:text-main-header font-medium mt-5">
                <LeafRatings
                  ratings={companyDetails?.ratings || 0}
                  align="items-start"
                />
              </h1>
              <p className="text-subtitle my-4 font-medium">Guest Favorite</p>
              <span className="text-content text-center">
                This place is a guest favourite based on <br /> ratings, reviews
                and reliability
              </span>
            </div>

            <div
              ref={reviewScrollRef}
              className="flex overflow-x-auto gap-6 px-4 md:px-0 scrollbar-hide snap-x snap-mandatory pb-4 items-center"
            >
              {infiniteReviews.length > 0 ? (
                <>
                  {infiniteReviews.map((review, index) => (
                    <div
                      key={review._id || `${review._id}-${index}`}
                      className="w-full flex-shrink-0 snap-center h-full"
                    >
                      <ReviewCard
                        handleClick={() => {
                          setSelectedReview(review);
                          setOpen(true);
                        }}
                        review={review}
                        reviewTextClassName="h-[60px]"
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-full glass-card border-dotted p-6 text-center text-sm text-gray-400 h-40 flex justify-center items-center w-full">
                  No reviews yet.
                </div>
              )}
            </div>

            <div className="text-right">
              <a
                className="text-accent text-sm font-semibold hover:underline"
                href={companyDetails?.googleMap}
                target="_blank"
                rel="noopener noreferrer"
              >
                View more →
              </a>
            </div>

            <div className="flex justify-center items-center mb-6">
              <button
                type="button"
                className="flex rounded-full items-center cursor-pointer justify-center  gap-2
        bg-accent hover:bg-secondary-light text-primary
        text-content leading-5
        w-full md:w-3/4 lg:w-1/2  shadow-glass px-6 py-3 undefined"
                onClick={handleWriteReviewClick}
                disabled={!companyDetails?.companyId}
              >
                WRITE A REVIEW
              </button>
            </div>

            <hr className="my-5 lg:my-10" />

            {/* Mobile Map */}
            <div className="w-full h-[350px] md:h-[500px] flex flex-col gap-8 rounded-xl overflow-hidden mt-6">
              <h1 className="text-title font-medium text-gray-300 uppercase">
                Where you'll be
              </h1>
              <Map
                locations={mapsData}
                disableNavigation
                disableTwoFingerScroll
              />
            </div>

            {/* Host Section - Responsive: Mobile/Tablet stacked, Desktop side-by-side */}
            {["CMP0001", "CMP0052"].includes(companyDetails?.companyId) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 pt-10">
                  <div className="flex flex-col lg:flex-row justify-center items-center col-span-1 glass-card gap-4 rounded-xl p-6 w-full">
                    <div className="flex flex-col gap-4 justify-between items-center h-full w-56">
                      {/* Avatar with Initials */}
                      <div className="w-32 aspect-square rounded-full bg-accent flex items-center justify-center text-white text-6xl font-semibold uppercase">
                        {companyDetails?.poc?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2) || "AG"}
                      </div>

                      {/* Name & Designation */}
                      <div className="text-center space-y-3 h-1/2 flex flex-col justify-evenly items-center">
                        <h1 className="text-title text-gray-300 font-medium leading-10">
                          {companyDetails?.poc?.name || "Sales Team"}
                        </h1>
                        <p className="text-content">
                          {companyDetails?.poc?.designation ||
                            "Sales Department"}
                        </p>
                      </div>
                    </div>

                    <div className="w-px h-full bg-glass-border mx-2 my-auto" />
                    <div className="h-full w-56 flex flex-col justify-normal">
                      <p className="text-title text-center text-gray-300 font-medium mb-8 underline uppercase">
                        Host Details
                      </p>
                      <div className="flex flex-col gap-5 text-sm sm:text-base">
                        {[
                          "Response rate: 100%",
                          "Speaks English, Hindi, Marathi and Konkani",
                          "Responds within an hour",
                          "Lives in Velha, Goa",
                        ].map((detail, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <FaCheck className="text-accent mt-1 flex-shrink-0" />
                            <span className="leading-snug">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full glass-card rounded-xl">
                    <div className="flex flex-col h-full gap-4 rounded-xl p-6 w-full lg:w-full justify-between">
                      <h1 className="text-title text-gray-300 font-medium uppercase">
                        Connect With Host
                      </h1>
                      <form
                        onSubmit={handlesubmitSales((data) =>
                          submitSales(data),
                        )}
                        className="grid grid-cols-1 gap-4"
                      >
                        <Controller
                          name="fullName"
                          control={salesControl}
                          rules={{
                            required: "Full Name is required",
                            validate: {
                              isAlphanumeric,
                              noOnlyWhitespace,
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Full Name"
                              fullWidth
                              variant="standard"
                              size="small"
                              error={!!salesErrors?.fullName}
                              helperText={salesErrors?.fullName?.message}
                            />
                          )}
                        />
                        <Controller
                          name="mobileNumber"
                          control={salesControl}
                          rules={{
                            required: "Mobile number is required",
                            validate: {
                              isValidInternationalPhone,
                            },
                          }}
                          render={({ field }) => (
                            <MuiTelInput
                              {...field}
                              label="Mobile Number"
                              fullWidth
                              defaultCountry="IN"
                              variant="standard"
                              size="small"
                              value={field.value || ""}
                              onChange={(value) => {
                                const formattedValue =
                                  normalizePhoneNumber(value);
                                field.onChange(value);
                                console.log("Sales mobile input:", {
                                  raw: value,
                                  formatted: formattedValue,
                                });
                              }}
                              helperText={salesErrors?.mobileNumber?.message}
                              error={!!salesErrors?.mobileNumber}
                            />
                          )}
                        />
                        <Controller
                          name="email"
                          control={salesControl}
                          rules={{
                            required: "Email is required",
                            validate: { isValidEmail },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Email"
                              fullWidth
                              type="email"
                              variant="standard"
                              size="small"
                              error={!!salesErrors?.email}
                              helperText={salesErrors?.email?.message}
                            />
                          )}
                        />
                        <div className="flex justify-center items-center">
                          <SecondaryButton
                            title={"Submit"}
                            type={"submit"}
                            externalStyles={"mt-6 w-1/2"}
                            disabled={isSubmittingSales}
                            isLoading={isSubmittingSales}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
            <hr className="mt-5 mb-0 lg:mt-10 lg:mb-0" />

            {/* Mobile Disclaimer */}
            <div className="text-[0.74rem] text-gray-400 leading-relaxed">
              <p className="mb-2">
                <b>Source:</b> All above content, images and details have been
                sourced from publicly available information.
              </p>

              <div
                className={`${
                  !isDisclaimerExpanded
                    ? "line-clamp-[6] md:line-clamp-none overflow-hidden"
                    : ""
                }`}
              >
                <p className="mb-2">
                  <b>Content and Copyright Disclaimer:</b> RoamIQ is an explorer
                  services and informational platform that aggregates and
                  presents publicly available information about co-working
                  spaces, co-living spaces, serviced apartments, hostels,
                  workation spaces, meeting rooms, working cafés and related
                  lifestyle or travel services. All such information displayed
                  on its platform, including images, brand names, or
                  descriptions is shared solely for informational and reference
                  purposes to help explorers/users discover and compare global
                  explorer-friendly information and services on its central
                  platform.
                </p>
                <p className="mb-2">
                  RoamIQ does not claim ownership of any third-party logos,
                  images, descriptions, or business information displayed on the
                  platform. All trademarks, brand names, and intellectual
                  property remain the exclusive property of their respective
                  owners and platforms. The inclusion of third-party information
                  does not imply endorsement, partnership, or affiliation unless
                  explicitly stated.
                </p>
                <p className="mb-2">
                  The content featured from other websites and platforms on RoamIQ
                  is not used for direct monetization, resale, or advertising
                  gain. RoamIQ's purpose is to inform and connect remote workers and travelers
                  and remote working professionals by curating publicly
                  available data in a transparent, good-faith manner for the
                  ease of its users and to support and grow the businesses who
                  are providing these services with intent to grow them and the
                  ecosystem.
                </p>
              </div>

              <button
                onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}
                className="md:hidden text-accent text-xs font-semibold mt-1 mb-2 hover:underline focus:outline-none"
              >
                {isDisclaimerExpanded ? "View less" : "View more"}
              </button>

              <p className="mt-2">
                Read the entire{" "}
                <span
                  className="underline text-accent cursor-pointer"
                  onClick={goToHostsContentCopyright}
                >
                  Content and Copyright
                </span>{" "}
                by clicking the link in our website footer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      <MuiModal open={open} onClose={() => setOpen(false)} title={"Review"}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-lg uppercase">
              {(
                selectedReview?.reviewerName ||
                selectedReview?.name ||
                "Unknown"
              )
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-base">
                {selectedReview?.reviewerName ||
                  selectedReview?.name ||
                  "Unknown"}
              </p>
              <p className="text-sm text-gray-400">{selectedReview?.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-200 text-sm">
            {renderStars(selectedReview?.rating || selectedReview?.starCount)}
          </div>
          <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
            {selectedReview?.message ||
              selectedReview?.reviewText ||
              selectedReview?.description}
          </div>
        </div>
      </MuiModal>

      {/* Add Review Modal */}
      <MuiModal
        open={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        title={companyDetails?.companyName || "Add a review"}
      >
        <form
          onSubmit={handleSubmitReview((data) => submitReview(data))}
          className="grid grid-cols-1 gap-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-2xl uppercase">
                {(reviewerName || auth?.user?.name || "U")
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-card-title font-semibold text-gray-200">
                  {reviewerName || auth?.user?.name || "Unknown User"}
                </p>
              </div>
            </div>
          </div>
          <Controller
            name="starCount"
            control={reviewControl}
            rules={{
              required: "Star rating is required",
              min: { value: 1, message: "Minimum rating is 1" },
              max: { value: 5, message: "Maximum rating is 5" },
            }}
            render={({ field }) => (
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => field.onChange(rating)}
                      className="transition-transform hover:scale-105"
                      aria-label={`Rate ${rating} star`}
                    >
                      {rating <= field.value ? (
                        <AiFillStar size={56} className="text-yellow-400" />
                      ) : (
                        <AiOutlineStar size={56} className="text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
                {reviewErrors?.starCount?.message ? (
                  <p className="text-xs text-red-600 mt-1">
                    {reviewErrors.starCount.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          <Controller
            name="description"
            control={reviewControl}
            rules={{
              required: "Review details are required",
              validate: {
                noOnlyWhitespace,
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Share details of your own experience at this place"
                fullWidth
                variant="standard"
                size="small"
                multiline
                minRows={3}
                error={!!reviewErrors?.description}
                helperText={reviewErrors?.description?.message}
              />
            )}
          />
          <div className="flex justify-center">
            <SecondaryButton
              title={"Submit Review"}
              type={"submit"}
              externalStyles={"mt-4"}
              disabled={isSubmittingReview}
              isLoading={isSubmittingReview}
            />
          </div>
        </form>
      </MuiModal>

      {/* Amenities Modal */}
      <TransparentModal
        open={showAmenities}
        onClose={() => setShowAmenities(false)}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {(Array.isArray(companyDetails?.inclusions)
            ? companyDetails.inclusions
            : companyDetails?.inclusions?.split(",") || []
          ).map((item) => (
            <span
              key={item}
              className="bg-surface-200 text-white text-sm rounded-lg px-3 py-2 text-center"
            >
              {item
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/-/g, " ")
                .replace(/&/g, " & ")
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          ))}
        </div>
      </TransparentModal>
    </div>
  );
};

export default AiProduct;
