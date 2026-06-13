import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
// import { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AiHeader from "../components/AiHeader";
import AiSidebar from "../components/AiSidebar";
import AiFooter from "../components/AiFooter";
import BackToTopButton from "../components/BackToTopButton";
import AiStickyBackBreadcrumb from "../components/AiStickyBackBreadcrumb";

const EXCLUDED_STICKY_BAR_PATHS = new Set([]);

const HIDE_STICKY_BAR_EXACT_PATHS = new Set([
  "/home",
  "/home-logged-in",
  "/search",
]);

const HIDE_STICKY_BAR_PREFIXES = [
  "/ai-login",
  "/ai-signup",
  "/ai-forgot-password",
  "/ai-reset-password",
];

const toTitle = (value) =>
  decodeURIComponent(value || "")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const normalizeBreadcrumbLabel = (segment) => {
  const normalized = (segment || "").toLowerCase();
  if (normalized === "ai-blogs") return "Blogs";
  if (normalized === "ai-news") return "News";
  if (normalized === "ai-events") return "Events";
  if (normalized === "ai-venues") return "Venues";
  if (normalized === "ai-about") return "About";
  if (normalized === "ai-career") return "Career";
  if (normalized === "ai-faq") return "FAQs";
  if (normalized === "ai-privacy") return "Privacy";
  if (normalized === "ai-terms-and-conditions") return "T&C";
  if (normalized === "ai-contact") return "Contact";
  if (normalized === "ai-content-and-copyright")
    return "Content and Copyright Policy";
  if (normalized === "ai-content-use-removal")
    return "Content Use & Removal Policy";
  return toTitle(segment);
};

const NomadAiLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const formData = useSelector((state) => state.location.formValues);
  console.log("formData from layout : ", formData);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ behavior: "smooth", top: "0" });
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, location.search]);

  const shouldShowStickyBar = (() => {
    if (EXCLUDED_STICKY_BAR_PATHS.has(location.pathname)) return false;
    if (HIDE_STICKY_BAR_EXACT_PATHS.has(location.pathname)) return false;
    if (
      HIDE_STICKY_BAR_PREFIXES.some((prefix) =>
        location.pathname.startsWith(prefix),
      )
    ) {
      return false;
    }
    return true;
  })();

  const routeBreadcrumbs = (() => {
    if (
      location.pathname === "/world-rankings" ||
      location.pathname === "/ai-verticals" ||
      location.pathname === "/ai-profile" ||
      location.pathname === "/ai-listings" ||
      location.pathname.startsWith("/manual-search") ||
      location.pathname.startsWith("/search/worldranking/results") ||
      location.pathname.startsWith("/search/workfromanywhere/results") ||
      location.pathname.startsWith("/search/increaseyoursavings/results") ||
      location.pathname.startsWith("/search/advanceyourcareer/results") ||
      location.pathname.startsWith("/search/findyourcommunity/results") ||
      location.pathname.startsWith("/ai-listings-list") ||
      location.pathname.startsWith("/visa-support") ||
      location.pathname.startsWith("/overall-activation-support") ||
      location.pathname.startsWith("/new-company-setup") ||
      location.pathname.startsWith("/consultation") ||
      location.pathname.startsWith("/workation") ||
      location.pathname.startsWith("/become-a-contributor") ||
      location.pathname.startsWith("/ai-about") ||
      location.pathname.startsWith("/ai-privacy") ||
      location.pathname.startsWith("/ai-career") ||
      location.pathname.startsWith("/ai-terms-and-conditions") ||
      location.pathname.startsWith("/ai-faq") ||
      location.pathname.startsWith("/ai-contact") ||
      location.pathname.startsWith("/ai-career") ||
      location.pathname.startsWith("/ai-content-and-copyright") ||
      location.pathname.startsWith("/ai-content-use-removal") ||
      location.pathname.startsWith("/ai-contact")
    ) {
      return [];
    }

    const customBreadcrumbs = location.state?.stickyBreadcrumbs;
    if (Array.isArray(customBreadcrumbs) && customBreadcrumbs.length > 0) {
      return customBreadcrumbs
        .map((item, index) => {
          const isLast = index === customBreadcrumbs.length - 1;
          return {
            label: item?.label,
            onClick:
              !isLast && item?.path
                ? () =>
                    navigate(item.path, {
                      state: {
                        ...location.state,
                      },
                    })
                : null,
            truncate: Boolean(isLast || item?.truncate),
          };
        })
        .filter((item) => item.label);
    }

    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [];

    const isContentDetailPage =
      location.pathname === "/ai-blogs/ai-blog-details" ||
      location.pathname === "/ai-news/ai-news-details";
    const detailStateName = location.state?.selectedStateLabel;

    return segments
      .map((segment, index) => {
        const isLast = index === segments.length - 1;
        return {
          label:
            isLast && isContentDetailPage && detailStateName
              ? toTitle(detailStateName)
              : normalizeBreadcrumbLabel(segment),
          onClick: isLast
            ? null
            : () => navigate(`/${segments.slice(0, index + 1).join("/")}`),
          truncate: isLast,
        };
      })
      .filter((item) => item.label);
  })();

  const isAiProductPage = location.pathname.startsWith("/ai-listings/");
  const isBreadcrumbLoading =
    isAiProductPage && Boolean(location.state?.breadcrumbLoading);

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden sm:block">
        <AiSidebar />
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/35 sm:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        >
          <AiSidebar
            isMobileOverlay
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-50 w-full">
          <AiHeader
            onMobileSidebarToggle={() => setIsMobileSidebarOpen(true)}
          />
        </div>
        {shouldShowStickyBar && (
          <div className="w-full bg-white/95">
            <div className="px-3 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
              <AiStickyBackBreadcrumb
                onBack={() => navigate(-1)}
                breadcrumbs={routeBreadcrumbs}
                isLoading={isBreadcrumbLoading}
                sticky={false}
                textSizeClassName="text-[10px] md:text-sm lg:text-base"
              />
            </div>
          </div>
        )}

        <div
          id="roamiq-ai-scroll-container"
          ref={contentRef}
          className="flex-1 overflow-auto custom-scrollbar-hide"
        >
          <div className="px-1 md:px-6 lg:px-6 xl:px-10 2xl:px-12 min-h-[calc(100vh-100px)]">
            <Outlet />
          </div>
          {/* <Toaster /> */}
          {(location.pathname !== "/verticals" ||
            window.innerWidth >= 1024) && <AiFooter />}
        </div>
        <BackToTopButton scrollContainerRef={contentRef} />
      </div>
    </div>
  );
};

export default NomadAiLayout;
