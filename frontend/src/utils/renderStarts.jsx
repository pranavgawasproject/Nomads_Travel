// src/utils/renderStars.js
import React from "react";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

const renderStars = (rating, size = 16) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<AiFillStar key={`full-${i}`} size={size} className="text-black" />);
  }

  if (hasHalfStar) {
    stars.push(<AiTwotoneStar key="half" size={size} className="text-black" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<AiOutlineStar key={`empty-${i}`} size={size} className="text-black" />);
  }

  return stars;
};

export default renderStars;
