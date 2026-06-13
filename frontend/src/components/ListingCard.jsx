import { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineHeart,
  AiTwotoneHeart,
} from "react-icons/ai";

import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

import useAuth from "../hooks/useAuth";
import { showErrorAlert } from "../utils/alerts";

const ListingCard = ({
  item,
  handleNavigation,
  showVertical = true,
  imageOverlayLabel,
}) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  // Track initial liked state per card
  const [isInitiallyLiked, setIsInitiallyLiked] = useState(
    item?.isLiked || false,
  );

  const { auth } = useAuth();
  const user = auth?.user || {};
  const userId = auth?.user?._id || auth?.user?.id;

  // const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();

  const { mutate: likeListing } = useMutation({
    mutationFn: async ({ listingId, isLiked, userId }) => {
      const { data } = await axiosPrivate.patch(`/user/like`, {
        listingId,
        isLiked,
        userId,
      });
      return data;
    },
    onSuccess: (data) => {
      // toast.success(data?.message || "Updated successfully");
      // ✅ Update local favorites immediately for better UX
      setFavorites(data.likes || []);
    },
    onError: (err) => {
      showErrorAlert(err.response?.data?.message || "Something went wrong");
    },
  });

  const toggleFavorite = (id) => {
    if (!userId) {
      // toast.error("You need to login to access this feature");
      navigate("/login");
      return;
    }

    // Determine the current like state based on both backend and local data
    const isCurrentlyLiked = favorites.includes(id) || isInitiallyLiked;
    const newLikedState = !isCurrentlyLiked; // what we’re switching to

    // Optimistically update UI
    if (newLikedState) {
      setFavorites((prev) => [...prev, id]);
    } else {
      setFavorites((prev) => prev.filter((fav) => fav !== id));
    }

    // Sync both trackers
    setIsInitiallyLiked(newLikedState);

    // Trigger backend
    likeListing({ listingId: id, isLiked: newLikedState, userId });
  };

  useEffect(() => {
    if (!user?._id) return;

    axiosPrivate.get(`/user/likes/${user._id}`).then((res) => {
      const likedIds = res.data?.map((item) => item._id) || [];
      setFavorites(likedIds);
    });
  }, [user?._id]);

  // useEffect(() => {
  //   if (!user?._id) return;
  //   const fetchLikes = async () => {
  //     try {
  //       const res = await axiosPrivate.get(`/api/user/likes/${user._id}`);
  //       const likedIds = res.data?.map((item) => item._id) || [];
  //       setFavorites(likedIds);
  //     } catch (err) {
  //       console.error("Failed to load liked listings:", err);
  //     }
  //   };
  //   fetchLikes();
  // }, [user?._id]);

  const typeLabels = {
    coworking: "CoWorking",
    coliving: "CoLiving",
    hostel: "Hostel",
    privatestay: "Private Stay",
    cafe: "Cafe",
    workation: "Workation",
    meetingroom: "Meeting Rooms",
  };

  const thumbnailImage = item?.images?.[0]?.url;

  const typeMap = {
    coworking: "Co-Working",
    meetingroom: "Meetings",
    privatestay: "Private Stay",
    hostel: "Hostel",
    coliving: "Coliving",
    cafe: "Cafe",
  };

  const displayType =
    typeMap[item.companyType?.toLowerCase()] || item.companyType;

  return (
    <div
      onClick={handleNavigation}
      // className="flex flex-col gap-2 h-56 w-[95%] bg-white  rounded-lg  transition-all cursor-pointer">
      className="flex flex-col gap-2 w-full bg-white rounded-lg transition-all cursor-pointer"
    >
      {/* <div className="h-full w-full overflow-hidden rounded-3xl border-2 relative"> */}
      <div className="w-full aspect-square overflow-hidden rounded-3xl relative">
        <img
          src={
            thumbnailImage ||
            "https://biznest.co.in/assets/img/projects/subscription/Managed%20Workspace.webp"
          }
          alt={item.companyName}
          className="w-full h-full object-cover hover:scale-105 transition-all"
          loading="lazy"
        />

        {imageOverlayLabel && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="bg-black/55 text-white text-sm font-medium px-3 py-1 rounded-full">
              {imageOverlayLabel}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 pb-4 w-full h-full pl-0 pointer-events-none">
          <div className="flex flex-col items-end h-full justify-between">
            <button
              type="button"
              className="cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation(); // ✅ stop navigation only for heart
                toggleFavorite(item._id);
              }}
            >
              {favorites.includes(item._id) || isInitiallyLiked ? (
                <AiFillHeart className="text-[#ff5757]" size={22} />
              ) : (
                <AiTwotoneHeart className="text-white" size={22} />
              )}
            </button>

            {showVertical && (
              <div className="bg-white rounded-lg px-2">
                <span className="font-normal text-xs leading-normal">
                  {/* {item.companyType || "Test"} */}
                  {displayType}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[25%] flex flex-col gap-1 pl-4 pr-1">
        <div className="flex w-full justify-between items-center">
          <div className="w-full">
            <p
              className="text-xs md:text-sm font-semibold truncate"
              title={item.companyTitle || "Title"}
            >
              {item.companyTitle || "title"}
            </p>
          </div>
        </div>

        <div className="flex w-full justify-between items-center">
          <p
            className="text-xs md:text-sm text-gray-600 font-medium truncate"
            title={`${item.city || "Unknown"}`}
          >
            {`${item.city || "Unknown"}`}
          </p>

          <div className="flex items-center gap-1 text-gray-600">
            <AiFillStar size={14} className="md:w-4 md:h-4" />
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              ({item.ratings || 0})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
