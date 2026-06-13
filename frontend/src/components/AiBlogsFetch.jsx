import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import humanDate from "../utils/humanDate";
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

const BlogCard = ({ b, stateName }) => {
  const fallbackImg = extractImageFromContent(b.content || b.description);
  const thumbnail = b.mainImage || fallbackImg;
  const navigate = useNavigate();

  return (
    <article
      onClick={() =>
        navigate("ai-blog-details", {
          state: { content: b, selectedStateLabel: stateName },
        })
      }
      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer transition"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={b.mainTitle}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-44 bg-gray-100" />
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{b.mainTitle}</h3>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {b.mainContent}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">{b.author || "Author"}</span>
          <time dateTime={b.date}>{b.date ? humanDate(b.date) : ""}</time>
        </div>
      </div>
    </article>
  );
};

const AiBlogsFetch = () => {
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
    queryKey: ["blogs", dest],
    queryFn: async () => {
      const res = await axios.get("/blogs/get-blogs", {
        params,
      });

      return res.data;
    },
    enabled: !!dest,
    refetchOnWindowFocus: false,
  });

  const blogs = dest && Array.isArray(data) ? data : [];

  return (
    <div className="hidden lg:flex flex-col gap-6 px-1 md:px-10 my-6 min-w-[75%] max-w-[80rem] lg:max-w-full mx-0 lg:mx-auto w-full">
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-col xs:flex-col md:flex-row lg:flex-row">
        <h2 className="text-title font-semibold text-host">Blog</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {dest && isPending && (
          <div className="h-screen">
            <span className="text-sm text-gray-500">Loading…</span>
          </div>
        )}

        {dest && isError && (
          <div className="h-screen">
            <span className="text-sm text-red-600">Could not load blogs.</span>
          </div>
        )}

        {blogs.map((b) => (
          <BlogCard key={b.guid || b._id} b={b} stateName={stateName} />
        ))}
      </div>

      {!dest && (
        <p className="text-sm text-gray-500 mt-4">
          No blog posts available for this location.
        </p>
      )}

      {dest && !isPending && !isError && blogs.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          No blog posts found for {dest}.
        </p>
      )}
    </div>
  );
};

export default AiBlogsFetch;
