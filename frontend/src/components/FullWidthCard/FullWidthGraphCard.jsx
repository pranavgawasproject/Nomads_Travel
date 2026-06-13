import React from "react";

const FullWidthGraphCard = ({ sections }) => {
  return (
    <div className="container mx-auto px-6">
      {sections.map((section, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-8 my-6 gap-6">
          {/* Left Section: Text Content */}
          <div className="md:w-1/2 px-6">
            <h2 className="text-3xl font-bold text-gray-900 text-left mb-4">
              {section.heading}
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              {section.bulletPoints.map((point, i) => (
                <li key={i} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section: Image */}
          <div className="md:w-1/2 p-4">
            <img
              src={section.image}
              alt="Graph"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FullWidthGraphCard;
