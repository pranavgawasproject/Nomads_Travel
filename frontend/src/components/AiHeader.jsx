import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/roamiq-logo-black.png";
import { useSelector } from "react-redux";
import { Drawer, Avatar, Popover, CircularProgress } from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import useNomadLoginState from "../hooks/useNomadLoginState";
import AiContainer from "./AiContainer";
import useLogout from "../hooks/useLogout";
import { clearStoredLoginState } from "../hooks/useNomadLoginState";
import useLocationContentAvailability from "../hooks/useLocationContentAvailability";
import { readSelectedDestination } from "../utils/selectedDestinationSession";

const AiHeader = ({ onMobileSidebarToggle }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const view = searchParams.get("view");
  const formData = useSelector((state) => state.location.formValues);

  const isAiListingsMapPage = location.pathname === "/ai-listings";
  const isAiListingsListPage = location.pathname === "/ai-listings-list";
  const showToggle =
    location.pathname.includes("verticals") ||
    isAiListingsMapPage ||
    isAiListingsListPage;
  const isAiEditorialPage =
    location.pathname.startsWith("/ai-blogs") ||
    location.pathname.startsWith("/ai-news");
  const shouldCheckNewsBlogLinks =
    showToggle ||
    isAiEditorialPage ||
    location.pathname.startsWith("/ai-listings") ||
    location.pathname.startsWith("/listings");

  const countryParam = searchParams.get("country") || formData?.country || "";
  const locationParam =
    searchParams.get("location") || formData?.location || "";
  const categoryParam =
    searchParams.get("category") || formData?.category || "";

  const buildListingsQuery = () => {
    const params = new URLSearchParams();
    if (countryParam) params.set("country", countryParam);
    if (locationParam) params.set("location", locationParam);
    if (categoryParam) params.set("category", categoryParam);
    return params.toString();
  };

  const listingsQuery = buildListingsQuery();
  const mapViewLink = listingsQuery
    ? `/ai-listings?${listingsQuery}`
    : "/ai-listings";
  const listViewLink = listingsQuery
    ? `/ai-listings-list?${listingsQuery}`
    : "/ai-listings-list";

  const { auth } = useAuth();
  const logout = useLogout();
  const hasNomadLoginState = useNomadLoginState();
  const isLoggedIn = Boolean(auth?.user) || hasNomadLoginState;
  const userInitial = auth?.user?.fullName?.charAt(0)?.toUpperCase() || "A";
  const openPopover = Boolean(anchorEl);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    if (isLogoutLoading) return;
    setIsLogoutLoading(true);
    handlePopoverClose();

    try {
      if (auth?.user) {
        await logout();
      }
      const nextSearchParams = new URLSearchParams(location.search);
      nextSearchParams.delete("login");
      clearStoredLoginState();

      navigate(
        {
          pathname: "/ai-login",
          search: nextSearchParams.toString()
            ? `?${nextSearchParams.toString()}`
            : "",
        },
        {
          state: {
            redirectTo: `${location.pathname}${location.search}`,
          },
        },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  const getNomadLoginRedirectPath = () => {
    const authPages = new Set([
      "/ai-signup",
      "/ai-login",
      "/ai-forgot-password",
    ]);

    if (authPages.has(location.pathname)) {
      return "/home";
    }

    return `${location.pathname}${location.search}`;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const goToHosts = () => {
    window.location.href = "/host";
  };

  const goToHostssMain = () => {
    window.location.href = "/home";
  };

  const stateParam =
    searchParams.get("state") ||
    searchParams.get("location") ||
    formData?.state ||
    formData?.location ||
    "";

  const formatStateLabel = (value) =>
    decodeURIComponent(value)
      .replace(/[-_]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const selectedDestination = readSelectedDestination();
  const normalizedStateParam = stateParam?.trim().toLowerCase();
  const normalizedCountryParam = countryParam?.trim().toLowerCase();
  const matchedSessionTitle =
    selectedDestination?.city === normalizedStateParam &&
    selectedDestination?.country === normalizedCountryParam
      ? selectedDestination?.title
      : "";
  const stateLabel =
    location.state?.selectedStateLabel ||
    matchedSessionTitle ||
    (stateParam ? formatStateLabel(stateParam) : "");
  const newsLabel = stateLabel ? `${stateLabel} News` : "News";
  const blogLabel = stateLabel ? `${stateLabel} Blog` : "Blog";
  const { hasBlogs, hasNews, hasNewsOrBlogs } = useLocationContentAvailability({
    enabled: shouldCheckNewsBlogLinks,
    keyword: stateParam,
  });
  const showNewsBlogLinks = shouldCheckNewsBlogLinks && hasNewsOrBlogs;

  const currentSearch = location.search || "";
  const aiVerticalsToggleState = (() => {
    const stateFromRoute = location.state || {};
    let fallbackBadges = [];

    if (typeof window !== "undefined") {
      try {
        const raw = window.sessionStorage.getItem("aiSearchBarBadges");
        const parsed = raw ? JSON.parse(raw) : [];
        fallbackBadges = Array.isArray(parsed) ? parsed : [];
      } catch {
        fallbackBadges = [];
      }
    }

    return {
      ...stateFromRoute,
      searchBarBadges: stateFromRoute?.searchBarBadges || fallbackBadges || [],
      selectedFilters: stateFromRoute?.selectedFilters,
      breadcrumbFilters: {
        continent:
          formData?.continent ||
          stateFromRoute?.breadcrumbFilters?.continent ||
          "",
        country:
          formData?.country || stateFromRoute?.breadcrumbFilters?.country || "",
        location:
          formData?.location ||
          stateFromRoute?.breadcrumbFilters?.location ||
          "",
      },
    };
  })();

  const headerLinks = [
    // { id: 1, text: "Home", to: "/" },
    { id: 2, type: "news", text: newsLabel, to: `/ai-news${currentSearch}` },
    { id: 3, type: "blog", text: blogLabel, to: `/ai-blogs${currentSearch}` },
    // { id: 4, type: "offers", text: offersLabel },
  ];

  const shouldShowHeaderLinks =
    location.pathname.startsWith("/listings") &&
    !location.pathname.startsWith("/ai-listings");

  return (
    <div className="bg-white/80 backdrop-blur-md px-1 md:px-20">
      <AiContainer padding={false}>
        <div className="flex py-3 justify-between items-center lg:py-[0.625rem]">
          {/* Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onMobileSidebarToggle?.()}
              className="mr-2 rounded p-1 text-black sm:hidden"
              aria-label="Open sidebar"
            >
              <HiOutlineMenu size={24} />
            </button>
            <div
              onClick={goToHostssMain}
              className="w-24 h-10 lg:w-48 overflow-x-hidden rounded-lg flex gap-8 justify-start items-start cursor-pointer"
            >
              <img
                src={logo}
                alt="logo"
                className="w-fit h-full object-contain"
              />
            </div>
            <div className="min-w-[80px] hidden lg:block">
              {showToggle && (
                <ul>
                  {(isAiListingsListPage ||
                    (!isAiListingsMapPage && view !== "map")) && (
                    <li className="flex items-center">
                      <div className="p-4 px-0 whitespace-nowrap">
                        <Link
                          to={
                            isAiListingsListPage
                              ? mapViewLink
                              : `${location.pathname}?country=${formData?.country}&location=${formData?.location}&view=map`
                          }
                          state={aiVerticalsToggleState}
                          className="group relative text-md text-black"
                        >
                          <span className="relative z-10 group-hover:font-bold mb-2 text-sm font-semibold">
                            Map View
                          </span>
                          <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </div>
                    </li>
                  )}

                  {(isAiListingsMapPage || view === "map") && (
                    <li className="flex items-center">
                      <div className="p-4 px-0 whitespace-nowrap">
                        <Link
                          to={
                            isAiListingsMapPage
                              ? listViewLink
                              : `${location.pathname}?country=${formData?.country}&location=${formData?.location}`
                          }
                          state={aiVerticalsToggleState}
                          className="group relative text-md text-black"
                        >
                          <span className="relative z-10 group-hover:font-bold mb-2 text-sm font-semibold">
                            List view
                          </span>
                          <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                      </div>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Main Nav */}
          <div className="w-full">
            {shouldShowHeaderLinks && (
              <ul className="hidden xl:flex sm:hidden gap-8 justify-end flex-1">
                {headerLinks.map((item) => {
                  const isActive =
                    item.to === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.to);

                  return (
                    <li key={item.id} className="flex items-center">
                      <div className="p-4 px-0 whitespace-nowrap">
                        <Link
                          to={item.to}
                          className="group relative text-md text-black"
                        >
                          <span
                            className={`relative z-10 mb-8 uppercase ${
                              isActive ? "text-black" : "group-hover:font-bold"
                            }`}
                          >
                            {item.text}
                          </span>
                          <span
                            className={`absolute left-0 bottom-0 top-6 block h-[2px] bg-primary-blue transition-all duration-300 
                              ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                          ></span>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center pl-10 gap-12">
            <div className="flex items-center gap-3">
              {/* <button
                type="button"
                onClick={() => navigate(`/host/ai-host-signup?step=1`)}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm  text-black transition hover:border-black/20 hover:bg-black/5 min-w-48"
              >
                Sign up as Business
              </button> */}
            </div>

            <li className="flex items-center gap-6">
              {showNewsBlogLinks && (
                <ul>
                  {/* Blogs and News - Added on the LEFT side of Map/List View */}
                  <li className="flex items-center gap-6">
                    {hasNews && (
                      <Link
                        to={`/ai-news${currentSearch}`}
                        className="group relative text-md text-black font-semibold whitespace-nowrap"
                      >
                        <span className="relative z-10 group-hover:font-bold mb-2 text-sm whitespace-nowrap">
                          {newsLabel}
                        </span>
                        <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    )}

                    {hasBlogs && (
                      <Link
                        to={`/ai-blogs${currentSearch}`}
                        className="group relative text-md text-black font-semibold whitespace-nowrap"
                      >
                        <span className="relative z-10 group-hover:font-bold mb-2 text-sm whitespace-nowrap">
                          {blogLabel}
                        </span>
                        <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    )}

                    {/* <span className="group relative text-md text-black font-semibold whitespace-nowrap">
                      <span className="relative z-10 mb-2 text-sm whitespace-nowrap">
                        {offersLabel}
                      </span>
                    </span> */}
                  </li>

                  {/* Original Map View / List View - UNCHANGED */}
                </ul>
              )}
              {!isLoggedIn && (
                <div className="p-4 px-0 whitespace-nowrap">
                  <Link
                    to={`/ai-login${location.search}`}
                    state={{
                      redirectTo: getNomadLoginRedirectPath(),
                    }}
                    className="relative inline-block pb-1 transition-all cursor-pointer duration-300 group bg-transparent border-none text-sm text-primary-blue whitespace-nowrap"
                  >
                    Login as Explorer
                    <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              )}
              <div className="p-4 px-0 whitespace-nowrap">
                <button
                  onClick={goToHosts}
                  className="relative pb-1 transition-all cursor-pointer duration-300 group bg-transparent border-none text-sm text-primary-blue"
                >
                  Become A Host
                  <span className="absolute left-0 bottom-0 top-6 w-0 h-[2px] bg-primary-blue transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </li>

            {isLoggedIn && (
              <Avatar
                onClick={handleAvatarClick}
                className="bg-primary-blue"
                sx={{
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backgroundColor: "#0ba9ef",
                }}
              >
                {userInitial}
              </Avatar>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="h-full px-2 lg:hidden flex items-center gap-2">
            {isLoggedIn && (
              <Avatar
                onClick={handleAvatarClick}
                className="bg-primary-blue"
                sx={{
                  cursor: "pointer",
                  width: 32,
                  height: 32,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  backgroundColor: "#0ba9ef",
                }}
              >
                {userInitial}
              </Avatar>
            )}

            <Popover
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  style: {
                    marginTop: "5px",
                    borderRadius: "20px",
                    overflow: "visible",
                  },
                },
              }}
            >
              <div className="p-[0.3rem]">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLogoutLoading}
                  className="w-full min-w-[140px] h-10 px-5 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center gap-3 text-[#2f2f2f] text-[15px] font-medium hover:shadow-md active:bg-gray-50 transition-all disabled:opacity-70"
                >
                  <span className="w-5 h-5 flex items-center justify-center text-gray-500">
                    {isLogoutLoading ? (
                      <CircularProgress size={18} sx={{ color: "gray" }} />
                    ) : (
                      <FiLogOut />
                    )}
                  </span>
                  <span>Sign Out</span>
                </button>
              </div>
            </Popover>

            <button
              onClick={() => setOpen(true)}
              className={`rounded-lg text-subtitle text-black ${onMobileSidebarToggle ? "hidden" : ""}`}
            >
              ☰
            </button>
          </div>

          {/* Mobile Drawer */}
          <Drawer
            sx={{
              "& .MuiDrawer-paper": {
                width: {
                  xs: "85%",
                  sm: "400px",
                },
              },
            }}
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
          >
            <div className="flex flex-col h-full justify-between">
              <ul className="flex flex-col gap-2 p-4">
                <div className="flex justify-end w-full">
                  <span
                    className="text-title cursor-pointer text-black"
                    onClick={() => setOpen(false)}
                  >
                    <IoCloseSharp />
                  </span>
                </div>

                {(shouldShowHeaderLinks || showNewsBlogLinks) &&
                  headerLinks
                    .filter((item) =>
                      showNewsBlogLinks
                        ? (item.type === "news" && hasNews) ||
                          (item.type === "blog" && hasBlogs) ||
                          item.type === "offers"
                        : true,
                    )
                    .map((item) => (
                      <li key={item.id} className="items-center text-center">
                        <div
                          onClick={() => item.to && handleNavigation(item.to)}
                          className={`py-4 ${item.to ? "cursor-pointer" : "cursor-default"}`}
                        >
                          <p className="text-secondary-dark text-lg">
                            {item.text}
                          </p>
                        </div>
                        <div className="h-[0.2px] bg-gray-300"></div>
                      </li>
                    ))}

                <li className="items-center text-center">
                  <div
                    onClick={() => {
                      goToHosts();
                      setOpen(false);
                    }}
                    className="py-4 cursor-pointer"
                  >
                    <p className="text-secondary-dark text-lg ">
                      Become A Host
                    </p>
                  </div>
                  <div className="h-[0.2px] bg-gray-300"></div>
                </li>

                {/* {auth?.user ? (
                  <>
                    <li className="items-center text-center">
                      <div
                        onClick={() => {
                          handleNavigation("/profile?tab=profile");
                        }}
                        className="py-4 cursor-pointer"
                      >
                        <p className="text-secondary-dark text-lg">Profile</p>
                      </div>
                      <div className="h-[0.2px] bg-gray-300"></div>
                    </li>
                    <li className="items-center text-center">
                      <div
                        onClick={() => {
                          handleNavigation("/profile?tab=favorites");
                        }}
                        className="py-4 cursor-pointer"
                      >
                        <p className="text-secondary-dark text-lg">Favorites</p>
                      </div>
                      <div className="h-[0.2px] bg-gray-300"></div>
                    </li>

                    <li className="items-center text-center">
                      <div
                        onClick={async () => {
                          if (isLogoutLoading) return;
                          await handleSignOut();
                          setOpen(false);
                        }}
                        className="py-4 cursor-pointer flex justify-center"
                      >
                        {isLogoutLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <p className="text-secondary-dark text-lg">Log Out</p>
                        )}
                      </div>
                    </li>
                  </>
                ) : (
                  <div className="flex justify-center py-4">
                    <PrimaryButton
                      title="Login"
                      padding="py-3"
                      uppercase
                      handleSubmit={() => {
                        navigate("/login");
                        setOpen(false);
                      }}
                      className="bg-[#FF5757] flex text-white font-[500] capitalize hover:bg-[#E14C4C] w-full sm:w-[7rem]"
                    />
                  </div>
                )} */}
              </ul>

              {/* Drawer Footer */}
              <div className="w-full text-center flex flex-col gap-4 items-center py-4">
                <div className="flex w-full flex-col gap-2 text-small md:text-small">
                  <hr />
                  <span>
                    &copy; Copyright {new Date().getFullYear()} -{" "}
                    {(new Date().getFullYear() + 1).toString().slice(-2)}
                  </span>
                  <span>RoamIQ. All rights reserved</span>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
      </AiContainer>
    </div>
  );
};

export default AiHeader;
