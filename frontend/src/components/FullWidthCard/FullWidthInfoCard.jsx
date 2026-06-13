import React from "react";

const FullWidthInfoCard = ({ sections }) => {
  return (
    <div className="container mx-auto px-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6 my-6">
          {/* Image Section */}
          <div className="md:w-1/2 p-4">
            <img
              src={section.image}
              alt="Section Visual"
              className="w-full rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="md:w-1/2 p-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {section.heading}
            </h2>
            <p className="text-gray-600 mt-2">{section.description}</p>
            <button className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
              {section.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FullWidthInfoCard;
