import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios.js";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import humanDate from "../utils/humanDate.js";
import { useSelector } from "react-redux";

const extractImageFromContent = (content) => {
  const match = content?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};

const normalizeLabel = (label) =>
  label
    ? label
        .replace(/\+/g, " ")
        .replace(/[\u2010-\u2015\u2212\u{FE63}\u{FF0D}]/gu, "-")
        .trim()
    : "";

const buildExactKeyword = (label) => {
  if (!label) return null;
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return `^${escaped}$`;
};

const NewsCard = ({ a, stateName }) => {
  const navigate = useNavigate();

  const fallbackImg = extractImageFromContent(a.content || a.description);
  const thumbnail = a.mainImage || fallbackImg;

  return (
    <article
      onClick={() =>
        navigate("ai-news-details", {
          state: { content: a, selectedStateLabel: stateName },
        })
      }
      className="group relative rounded-xl border bg-white transition hover:shadow-md cursor-pointer overflow-hidden max-w-full"
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="w-full sm:w-56 shrink-0 block">
          <div className="h-40 sm:h-36 rounded-lg overflow-hidden">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={a.mainTitle}
                className="h-full w-full object-cover group-hover:scale-105 transition"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-snug line-clamp-2">
            {a.mainTitle}
          </h3>

          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {a.mainContent}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
            <span className="truncate">{a.author || a.source || "Source"}</span>
            <time dateTime={a.date}>{a.date ? humanDate(a.date) : ""}</time>
          </div>
        </div>
      </div>
    </article>
  );
};

const AiNewsFetch = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const formData = useSelector((state) => state.location.formValues);

  const urlDest = normalizeLabel(
    searchParams.get("dest") || searchParams.get("location"),
  );
  const reduxDest = normalizeLabel(formData?.location || formData?.state);

  const dest = urlDest || reduxDest || "";
  const stateName = location.state?.selectedStateLabel || dest;

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

  const news = dest && Array.isArray(data) ? data : [];

  return (
    <div className="hidden lg:flex flex-col gap-6 px-1 md:px-10 my-6 min-w-[75%] max-w-[80rem] lg:max-w-full mx-0 lg:mx-auto w-full">
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

        {news.map((a) => (
          <NewsCard key={a.guid || a._id} a={a} stateName={stateName} />
        ))}
      </div>

      {!dest && (
        <p className="text-sm text-gray-500 mt-4">
          No news available for this location.
        </p>
      )}

      {dest && !isPending && !isError && news.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No news found for {dest}.</p>
      )}
    </div>
  );
};

export default AiNewsFetch;
