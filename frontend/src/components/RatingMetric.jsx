// RatingMetric.jsx
import React from "react";

const RatingMetric = ({ icon, title, rating }) => {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[80px]">
      <div className="text-sm text-gray-700">{title}</div>
      <div className="text-base font-semibold">{rating}</div>
      <div className="text-2xl">{icon}</div>
    </div>
  );
};

export default RatingMetric;
