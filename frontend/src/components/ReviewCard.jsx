// components/ReviewCard.jsx
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import renderStars from "../utils/renderStarts";

const ReviewCard = ({ review, handleClick, reviewTextClassName = "" }) => {
  const {
    name,
    avatar,
    duration,
    stars,
    location,
    message,
    reviewText,
    rating,
    description,
    starCount,
    reviewerName,
  } = review;

  return (
    <div className="flex flex-col gap-2 p-0 lg:p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-blue flex items-center justify-center text-sm font-semibold text-white uppercase">
            {(name || reviewerName || "")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
        <div>
          <p className="font-semibold">{name || reviewerName}</p>
          <p className="text-sm text-gray-500">{duration}</p>
        </div>
      </div>

      {/* Stars and Date */}
      <div className="flex  items-center gap-4 text-sm text-gray-700">
        <div className="flex gap-1">{renderStars(starCount || rating)}</div>
        <span className="text-secondary-dark"> {location}</span>
      </div>

      {/* Review */}
      <p
        className={`text-sm text-gray-700 line-clamp-3 ${reviewTextClassName}`}
      >
        {message || reviewText || description}
      </p>

      <span
        onClick={handleClick}
        className="text-small font-medium underline cursor-pointer"
      >
        Show more
      </span>
    </div>
  );
};

export default ReviewCard;
