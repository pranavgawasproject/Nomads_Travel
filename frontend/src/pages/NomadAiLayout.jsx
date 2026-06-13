import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import AiHeader from "../components/AiHeader";
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

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ behavior: "smooth", top: "0" });
    }
  }, [location.pathname]);

  const shouldShowStickyBar = (() => {
    if (EXCLUDED_STICKY_BAR_PATHS.has(location.pathname)) return false;
    if (HIDE_STICKY_BAR_EXACT_PATHS.has(location.pathname)) return false;
    if (
      HIDE_STICKY_BAR_PREFIXES.some((prefix) =>
        location.pathname.startsWith(prefix)
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
    <div className="flex min-h-screen flex-col bg-surface text-gray-200">
      {/* Fixed Top Header */}
      <AiHeader />

      {/* Main Content Area */}
      <main
        id="roamiq-ai-scroll-container"
        ref={contentRef}
        className="flex-1 overflow-auto custom-scrollbar-hide pt-16"
      >
        {/* Sticky Breadcrumb Bar */}
        {shouldShowStickyBar && (
          <div className="w-full bg-surface/95 backdrop-blur-sm border-b border-glass-border">
            <div className="section-container">
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

        {/* Page Content */}
        <div className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </div>

        {/* Footer */}
        <AiFooter />
      </main>

      {/* Back to Top */}
      <BackToTopButton scrollContainerRef={contentRef} />
    </div>
  );
};

export default NomadAiLayout;
