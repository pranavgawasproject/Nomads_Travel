import React from "react";

const Amenities = ({ image, title, isAvailable }) => {
  return (
    <div className="flex flex-row gap-1 w-full lg:w-40 items-center">
      <div className="h-10 w-10 overflow-hidden relative  rounded">
        <img
          src={image || ""}
          className="h-full w-full object-contain"
          alt={title || ""}
        />
        {!isAvailable && (
          <div className="absolute h-full w-[2px] -top-1 left-[45%] -rotate-45 bg-black" />
        )}
      </div>
      <p
        className={`text-center text-secondary-dark w-full text-[0.89rem] uppercase ${
          !isAvailable ? "line-through" : ""
        }`}
      >
        {title || ""}
      </p>
    </div>
  );
};

export default Amenities;
