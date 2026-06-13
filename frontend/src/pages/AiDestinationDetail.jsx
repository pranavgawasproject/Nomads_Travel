import { CalendarDays, MapPin, Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { annualEvents, popularVenues } from "../data/aiDestinationHighlights";

const reviews = [
  {
    initials: "VF",
    name: "Valentina Ferrao",
    text: "A memorable experience with a welcoming atmosphere and plenty to discover.",
  },
  {
    initials: "AC",
    name: "Avtar Chodankar",
    text: "Very well set up, easy to visit, and worth adding to a Goa itinerary.",
  },
];

const AiDestinationDetail = ({ type }) => {
  const location = useLocation();
  const fallback = type === "event" ? annualEvents[0] : popularVenues[0];
  const item = location.state?.item || fallback;
  const isEvent = type === "event";

  return (
    <main className="mx-auto w-full max-w-[75rem] px-4 pb-8 lg:px-0">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-black md:text-title">
          {item.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm md:text-base">
          <p className="flex items-center gap-2">
            {isEvent ? <CalendarDays size={17} /> : <MapPin size={17} />}
            {isEvent ? item.subtitle : `Address: ${item.address}`}
          </p>
          {!isEvent && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address || item.title)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 underline"
            >
              Get Direction
            </a>
          )}
        </div>
      </header>

      <div className="h-64 w-full overflow-hidden rounded-2xl md:h-[23rem]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="my-5 grid gap-3 border-b border-gray-200 pb-5 text-base font-semibold md:grid-cols-3 md:text-lg">
        <span>{item.category}</span>
        <span className="flex items-center gap-1 md:justify-center">
          {isEvent ? (
            item.meta
          ) : (
            <>
              <Star size={18} fill="currentColor" /> {item.meta}
            </>
          )}
        </span>
        <span className="md:text-right">
          {isEvent ? item.location : item.region}
        </span>
      </div>

      <section className="space-y-5 border-b border-gray-200 pb-8 text-sm leading-relaxed md:text-base">
        <p>{item.description}</p>
        <p>
          This placeholder details page follows the supplied product-page mock.
          Verified schedules, facilities, directions, and visitor information
          can be connected when the destination content source is available.
        </p>
        <p>
          Explore responsibly, confirm local timings before travelling, and
          check official sources for the latest information.
        </p>
      </section>

      <section className="py-8">
        <div className="mb-8 text-center">
          <button
            type="button"
            className="rounded-full bg-primary-blue px-8 py-3 text-sm font-semibold text-white"
          >
            WRITE A REVIEW
          </button>
        </div>
        <div className="space-y-7">
          {reviews.map((review) => (
            <article key={review.initials}>
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-blue text-xs font-semibold text-white">
                  {review.initials}
                </span>
                <strong className="text-sm">{review.name}</strong>
              </div>
              <div className="mb-1 flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm">{review.text}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-5 text-[0.5rem] leading-relaxed text-gray-500">
        <p>
          <b>Source:</b> All above content, images and details are placeholder
          content for the supplied mockup and will be replaced with verified
          publicly available information.
        </p>
      </div>
    </main>
  );
};

export default AiDestinationDetail;
