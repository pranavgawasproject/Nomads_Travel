import { useState, useRef, useEffect } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import PrimaryButton from "../PrimaryButton";

const InclusionsCard = ({ inclusions, handleTrigger }) => {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const visibleInclusions =
    isMobile && !showAll ? inclusions.slice(0, 4) : inclusions;

    const handleSubmit=()=>{
      setShowAll(!showAll)
      handleTrigger()
    }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <h3 className="text-headline font-semibold mb-4">Services Included:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleInclusions.map((service, index) => (
          <div
            key={index}
            className="px-4 py-2 bg-gray-100 rounded-3xl text-gray-800 text-sm font-medium text-center"
          >
            {service}
          </div>
        ))}
      </div>

      {/* See More / See Less Button for mobile */}
      {isMobile && inclusions.length > 4 && (
        <div className="text-center flex justify-center mt-6">
          <PrimaryButton
            title={`${showAll ? "See less" : "See More"}`}
            handleSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default InclusionsCard;
