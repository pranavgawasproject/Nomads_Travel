import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axios";

const escapeKeyword = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeKeyword = (value) => {
  if (!value) return "";

  return decodeURIComponent(value)
    .replace(/\+/g, " ")
    .replace(/[\u2010-\u2015\u2212\u{FE63}\u{FF0D}]/gu, "-")
    .trim();
};

const hasLocationContent = async (path, keyword) => {
  const params = keyword ? { keyword: escapeKeyword(keyword) } : undefined;
  const response = await axios.get(path, { params });

  return Array.isArray(response.data) && response.data.length > 0;
};

const useLocationContentAvailability = ({ enabled, keyword }) => {
  const normalizedKeyword = normalizeKeyword(keyword);

  const { data: hasNews = false } = useQuery({
    queryKey: ["header-location-news", normalizedKeyword],
    queryFn: () => hasLocationContent("/news/get-news", normalizedKeyword),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: hasBlogs = false } = useQuery({
    queryKey: ["header-location-blogs", normalizedKeyword],
    queryFn: () => hasLocationContent("/blogs/get-blogs", normalizedKeyword),
    enabled,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    hasBlogs,
    hasNews,
    hasNewsOrBlogs: hasNews || hasBlogs,
  };
};

export default useLocationContentAvailability;
