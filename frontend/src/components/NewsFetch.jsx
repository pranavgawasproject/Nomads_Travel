// src/components/NewsFetch.jsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import humanDate from "../utils/humanDate.js";
import { useSelector } from "react-redux";

const extractImageFromContent = (content) => {
  const match = content?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};

const NewsCard = ({ a }) => {
  const navigate = useNavigate();

  const fallbackImg = extractImageFromContent(a.content || a.description);
  const thumbnail = a.mainImage || fallbackImg;

  return (
    <article
      onClick={() => navigate("news-details", { state: { content: a } })}
      className="group relative rounded-xl border bg-white transition hover:shadow-md cursor-pointer overflow-hidden max-w-full"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        {/* <div className="sm:w-56 shrink-0 block"> */}
        <div className="w-full sm:w-56 shrink-0 block">
          <div className="h-40 sm:h-36 rounded-lg overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={a.mainTitle}
                className="block h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <h3 className="mt-1 text-lg font-semibold leading-snug text-gray-900 line-clamp-2">
            {a.mainTitle}
          </h3>

          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {a.mainContent}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">{a.author || "News Desk"}</span>
            <time dateTime={a.date}>{a.date ? humanDate(a.date) : ""}</time>
          </div>
        </div>
      </div>
    </article>
  );
};
const normalizeLabel = (label) =>
  label
    ? label
        .replace(/\+/g, " ")
        .replace(/[\u2010-\u2015\u2212\u{FE63}\u{FF0D}]/gu, "-")
        .trim()
    : label;

const buildExactKeyword = (label) => {
  if (!label) return null;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `^${escaped}$`; // match the complete destination, not substrings
};

const NewsFetch = () => {
  const [searchParams] = useSearchParams();
  const formData = useSelector((state) => state.location.formValues);

  const urlDest = normalizeLabel(searchParams.get("dest"));
  const reduxDest = normalizeLabel(formData?.location || formData?.state);

  const dest = urlDest || reduxDest || "";

  const params = useMemo(() => {
    if (!dest) return undefined;

    return {
      keyword: buildExactKeyword(dest),
    };
  }, [dest]);

  const { data, isPending, isError } = useQuery({
    queryKey: ["ai-news", dest],
    queryFn: async () => {
      const res = await axios.get("/news/get-news", {
        params,
      });

      return res.data;
    },
    enabled: !!dest,
    refetchOnWindowFocus: false,
  });

  const articles = dest && Array.isArray(data) ? data : [];

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
        <h2 className="text-title font-semibold text-host">News</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {dest && isPending && (
          <div className="h-screen">
            <span className="text-sm text-gray-500">Loading…</span>
          </div>
        )}
        {dest && isError && (
          <div className="h-screen">
            <span className="text-sm text-red-600">Could not load news.</span>
          </div>
        )}
        {articles.map((a) => (
          <NewsCard key={a.guid || a._id} a={a} />
        ))}
      </div>

      {!dest && (
        <p className="text-sm text-gray-500 mt-4">
          No news available for this location.
        </p>
      )}

      {dest && !isPending && !isError && articles.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No news found for {dest}.</p>
      )}
    </div>
  );
};

export default NewsFetch;
