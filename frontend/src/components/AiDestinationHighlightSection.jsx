import { AiFillStar } from "react-icons/ai";

const HighlightCard = ({ item, kind, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(item)}
    className="flex w-full flex-col gap-2 rounded-lg bg-white text-left transition-transform hover:scale-[1.01]"
  >
    <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gray-100">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          loading="lazy"
        />
      )}
    </div>
    <div className="flex min-w-0 flex-col gap-1 px-4">
      <p className="line-clamp-2 text-xs font-semibold md:text-sm">
        {item.title}
      </p>
      {(item.location || item.meta) && (
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-gray-600 md:text-sm">
          <span className="truncate">{item.location}</span>
          <span className="flex shrink-0 items-center gap-1">
            {kind === "venue" && <AiFillStar size={14} />}
            {item.meta}
          </span>
        </div>
      )}
    </div>
  </button>
);

const AiDestinationHighlightSection = ({
  title,
  items,
  kind,
  onCardClick,
  onViewMore,
  sectionRef,
  mobile = false,
}) => {
  if (!items?.length) return null;

  if (mobile) {
    return (
      <div ref={sectionRef} className="mb-6 scroll-mt-24">
        <h2 className="mb-4 text-sm font-semibold leading-tight text-secondary-dark sm:text-base md:text-subtitle">
          {title}
        </h2>
        <div className="custom-scrollbar-hide flex snap-x snap-mandatory flex-nowrap gap-4 overflow-x-auto pb-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-[calc(85%-0.5rem)] flex-shrink-0 snap-start md:w-[calc(33.33%-1rem)]"
            >
              <HighlightCard item={item} kind={kind} onClick={onCardClick} />
            </div>
          ))}
        </div>
        {onViewMore && (
          <div className="mt-0 text-right">
            <button
              type="button"
              onClick={onViewMore}
              className="text-sm font-semibold text-primary-blue hover:underline"
            >
              View more &rarr;
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="col-span-full mb-6 mt-6 scroll-mt-24 border-t border-gray-300 pt-6"
    >
      <h2 className="mb-5 text-subtitle font-semibold text-secondary-dark">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-0 md:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <HighlightCard
            key={item.id}
            item={item}
            kind={kind}
            onClick={onCardClick}
          />
        ))}
      </div>
      {onViewMore && (
        <div className="mt-0 text-right">
          <button
            type="button"
            onClick={onViewMore}
            className="text-sm font-semibold text-primary-blue hover:underline"
          >
            View more &rarr;
          </button>
        </div>
      )}
      {!onViewMore && (
        <div className="mt-0 text-right">
          <span className="text-sm font-semibold text-primary-blue">
            View more &rarr;
          </span>
        </div>
      )}
    </div>
  );
};

export default AiDestinationHighlightSection;
