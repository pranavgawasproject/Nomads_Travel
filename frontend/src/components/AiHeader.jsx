import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/roamiq-logo-black.png";
import { useSelector } from "react-redux";
import { Avatar, Popover, CircularProgress } from "@mui/material";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { ChevronDown } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useNomadLoginState, {
  clearStoredLoginState,
} from "../hooks/useNomadLoginState";
import useLogout from "../hooks/useLogout";

const NAV_ITEMS = [
  { label: "Home", path: "/home" },
  { label: "Explore", path: "/ai-verticals" },
  { label: "Rankings", path: "/world-rankings" },
  { label: "Career", path: "/ai-career" },
  { label: "About", path: "/ai-about" },
];

const AiHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();
  const logout = useLogout();
  const hasNomadLoginState = useNomadLoginState();
  const isLoggedIn = Boolean(auth?.user) || hasNomadLoginState;
  const userInitial = auth?.user?.fullName?.charAt(0)?.toUpperCase() || "A";
  const openPopover = Boolean(anchorEl);

  // Scroll detection for header opacity
  useEffect(() => {
    const scrollContainer = document.getElementById(
      "roamiq-ai-scroll-container"
    );
    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 10);
    };

    handleScroll();
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

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
        }
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
    if (authPages.has(location.pathname)) return "/home";
    return `${location.pathname}${location.search}`;
  };

  const isActivePath = (path) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-xl border-b border-glass-border"
            : "bg-surface/80 backdrop-blur-xl border-b border-transparent"
        }`}
      >
        <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/home"
              className="flex items-center gap-2.5 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                <img
                  src={logo}
                  alt="RoamIQ"
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </div>
              <span className="hidden sm:block text-lg font-bold text-white tracking-tight">
                Roam<span className="text-accent">IQ</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (hidden on mobile) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Auth buttons or Avatar */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:block">
                  <button
                    onClick={handleAvatarClick}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-glass-border hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {userInitial}
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </div>
                {/* Mobile avatar */}
                <div className="sm:hidden">
                  <button onClick={handleAvatarClick}>
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                      {userInitial}
                    </div>
                  </button>
                </div>

                <Popover
                  open={openPopover}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  slotProps={{
                    paper: {
                      sx: {
                        marginTop: "8px",
                        borderRadius: "16px",
                        overflow: "visible",
                        backgroundColor: "#1a1d2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      },
                    },
                  }}
                >
                  <div className="p-2 min-w-[180px]">
                    <div className="px-3 py-2 mb-1 border-b border-glass-border">
                      <p className="text-sm font-medium text-white truncate max-w-[160px]">
                        {auth?.user?.fullName || "Explorer"}
                      </p>
                      {auth?.user?.email && (
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">
                          {auth.user.email}
                        </p>
                      )}
                    </div>
                    <Link
                      to="/ai-profile?tab=profile"
                      onClick={handlePopoverClose}
                      className="block w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/ai-profile?tab=favorites"
                      onClick={handlePopoverClose}
                      className="block w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      Favorites
                    </Link>
                    <div className="my-1 border-t border-glass-border" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isLogoutLoading}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLogoutLoading ? (
                        <CircularProgress size={16} sx={{ color: "#f87171" }} />
                      ) : (
                        <FiLogOut size={16} />
                      )}
                      <span>Sign Out</span>
                    </button>
                  </div>
                </Popover>
              </>
            ) : (
              <>
                <Link
                  to={`/ai-login${location.search}`}
                  state={{
                    redirectTo: getNomadLoginRedirectPath(),
                  }}
                  className="hidden sm:inline-flex btn-ghost text-sm py-2 px-4"
                >
                  Login
                </Link>
                <Link
                  to={`/ai-signup${location.search}`}
                  state={{
                    redirectTo: getNomadLoginRedirectPath(),
                  }}
                  className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <HiX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-down menu panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-surface-50 border-b border-glass-border shadow-glass transition-transform duration-300 ${
            mobileMenuOpen
              ? "translate-y-0"
              : "-translate-y-full"
          }`}
        >
          <nav className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-accent bg-accent/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}

            {/* Mobile auth buttons */}
            <div className="mt-3 pt-3 border-t border-glass-border flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/ai-profile?tab=profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {userInitial}
                    </div>
                    <span>{auth?.user?.fullName || "Profile"}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <FiLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={`/ai-login${location.search}`}
                    state={{ redirectTo: getNomadLoginRedirectPath() }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-ghost text-sm py-3 text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to={`/ai-signup${location.search}`}
                    state={{ redirectTo: getNomadLoginRedirectPath() }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm py-3 text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AiHeader;
