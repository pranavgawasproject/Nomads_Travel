import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";

const AiStickyBackBreadcrumb = ({
  onBack,
  breadcrumbs = [],
  isLoading = false,
  className = "",
  rowClassName = "",
  topClassName = "top-[70px]",
  textSizeClassName = "",
  label = null,
  sticky = true,
}) => {
  const stickyClassName = sticky ? `sticky ${topClassName}` : "";

  return (
    <div
      className={`${stickyClassName} z-40 bg-white/95 py-3 backdrop-blur-sm md:px-10 ${className}`}
    >
      <div className={`flex items-center gap-2 ${rowClassName}`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sky-500 bg-white text-sky-500"
          aria-label="Go back"
        >
          <HiOutlineArrowLeft size={18} />
        </button>

        {label ? <span className="text-lg font-semibold text-primary-blue sm:hidden">{label}</span> : null}

        {isLoading ? (
          <div className="ml-1 flex items-center gap-2" aria-live="polite">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
            <span className={`text-primary-blue ${textSizeClassName}`}>Loading...</span>
          </div>
        ) : breadcrumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className={`flex items-center text-primary-blue ${textSizeClassName}`}
          >
            <span className="mx-1 md:mx-2">{">"}</span>
            {breadcrumbs.map((item, index) => (
              <span key={`${item.label}-${index}`}>
                {item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-primary-blue transition-colors hover:text-primary-dark"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={item.truncate ? "inline-block max-w-[80px] truncate align-bottom md:max-w-none" : ""}>
                    {item.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span className="mx-1 md:mx-2">{">"}</span>
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
