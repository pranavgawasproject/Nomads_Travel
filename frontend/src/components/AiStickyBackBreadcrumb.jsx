import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";

const AiStickyBackBreadcrumb = ({
  onBack,
  breadcrumbs = [],
  isLoading = false,
  className = "",
  rowClassName = "",
  topClassName = "top-16",
  textSizeClassName = "",
  label = null,
  sticky = true,
}) => {
  const stickyClassName = sticky ? `sticky ${topClassName}` : "";

  return (
    <div
      className={`${stickyClassName} z-40 bg-surface/95 py-3 backdrop-blur-sm ${className}`}
    >
      <div className={`flex items-center gap-2 ${rowClassName}`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors duration-200"
          aria-label="Go back"
        >
          <HiOutlineArrowLeft size={16} />
        </button>

        {label ? (
          <span className="text-sm font-semibold text-accent sm:hidden">
            {label}
          </span>
        ) : null}

        {isLoading ? (
          <div className="ml-1 flex items-center gap-2" aria-live="polite">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <span className={`text-accent ${textSizeClassName}`}>
              Loading...
            </span>
          </div>
        ) : breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className={`flex items-center text-gray-400 ${textSizeClassName}`}
          >
            <span className="mx-1 text-gray-600 md:mx-2">›</span>
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`}>
                {item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-accent/80 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span
                    className={
                      item.truncate
                        ? "inline-block max-w-[80px] truncate align-bottom text-gray-300 md:max-w-none"
                        : "text-gray-300"
                    }
                  >
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span className="mx-1 text-gray-600 md:mx-2">›</span>
                ) : null}
              </span>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
};

export default AiStickyBackBreadcrumb;
