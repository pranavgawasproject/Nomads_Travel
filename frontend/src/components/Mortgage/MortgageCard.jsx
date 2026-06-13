import React from "react";

const MortgageCard = ({ image, title, description, buttonText }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 w-full max-w-sm bg-white">
      <img
        src={image}
        alt={title}
        className="w-full h-72 object-cover rounded-md"
      />
      <h3 className="text-lg font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <button className="mt-4 px-4 py-2 border font-semibold rounded-md hover:bg-gray-100 w-full">
        {buttonText}
      </button>
    </div>
  );
};

export default MortgageCard;
