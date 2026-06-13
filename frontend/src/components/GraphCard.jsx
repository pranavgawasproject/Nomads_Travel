import React from "react";
import { ReactFitty } from "react-fitty";
import { BiCheck } from "react-icons/bi";
import useIsMobile from "../hooks/useIsMobile";

const GraphCard = ({ data, reverse }) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col items-center gap-20">
      <div
        className={`flex flex-col ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } gap-10 md:gap-4 lg:gap-6`}
      >
        {/* Image without fixed height */}
        {!isMobile && (
          <div className="w-full mb-3 md:w-full lg:w-[50%] h-full md:h-[33rem] lg:h-[33rem] overflow-hidden border-[1px] rounded-lg border-gray-300 bg-[#F4F3F3]">
            <img
              src={data.imageSrc}
              alt="image"
              className="w-full md:h-full object-contain md:object-contain object-center"
            />
          </div>
        )}

        {/* Text section with fixed height */}
        <div className="flex flex-1 flex-col h-[33rem] gap-5">
          <ReactFitty className="font-semibold">{data.title}</ReactFitty>

          {isMobile && (
            <div className="w-full md:w-full lg:w-[50%] h-full md:h-[33rem] lg:h-[33rem] overflow-hidden border-[1px] rounded-lg border-gray-300 bg-[#F4F3F3]">
              <img
                src={data.imageSrc}
                alt="image"
                className="w-full md:h-full object-contain md:object-contain"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4 lg:justify-between lg:gap-0 mt-4">
            {data.items.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div>
                  <BiCheck size={20} />
                </div>
                <p className="text-subtitle">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphCard;
