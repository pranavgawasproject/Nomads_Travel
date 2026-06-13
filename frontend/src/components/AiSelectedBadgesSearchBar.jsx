import React from "react";
import {
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { dedupeAiSearchBadges } from "../utils/aiSearchBarBadges.js";

const badgeClassName =
  "inline-flex min-h-[40px] min-w-[5rem] items-center rounded-full border border-black/30 px-4 py-2 text-xs font-medium text-black/85";

const AiSelectedBadgesSearchBar = ({
  badges = [],
  stateLabel = "",
  onBack,
  onClear,
  heading = null,
  className = "",
  fullWidth = false,
}) => {
  const visibleBadges = dedupeAiSearchBadges(badges);
  const widthClassName = fullWidth
    ? "max-w-none"
    : "max-w-[50rem] lg:max-w-[61rem] xl:max-w-[61rem]";

  return (
    <div className={`hidden lg:block ${className}`}>
      {heading && (
        <div className={`mx-auto mt-4 w-full ${widthClassName}`}>
          {heading}
        </div>
      )}

      <div
        className={`mx-auto flex min-h-[58px] w-full items-center rounded-full border border-black/15 bg-white px-4 py-2 shadow-[0_2px_6px_rgba(0,0,0,0.03)] ${widthClassName} ${heading ? "mt-2" : "mt-4"}`}
      >
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-hidden">
          {visibleBadges.map((badgeLabel, index) => (
            <div key={`${badgeLabel}-${index}`} className={badgeClassName}>
              <span className="whitespace-normal break-words">{badgeLabel}</span>
            </div>
          ))}
          {/* {stateLabel && <span className={badgeClassName}>{stateLabel}</span>} */}
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-black/70 transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Clear search and go back"
          >
            <HiOutlineX size={24} />
          </button>
          <HiOutlineSearch size={34} className="text-black/90" />
        </div>
      </div>
    </div>
  );
};

export default AiSelectedBadgesSearchBar;
