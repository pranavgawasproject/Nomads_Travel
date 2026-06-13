import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Jobrole = ({jobRoles}) => {

  const [openIndex, setOpenIndex] = useState(null);
  const {pathname} = useLocation();
 const isHost = pathname.includes("host")
  const customLink = isHost ? `/ai-career/job` : `/ai-career/job`

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="flex flex-col gap-4">
      {jobRoles.map((section, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div key={idx} className="border-b pb-4 overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => toggleAccordion(idx)}
              className="w-full flex justify-between items-center py-6 text-left text-3xl font-bold focus:outline-none">
              {section.title}
              <FaChevronDown
                className={`text-gray-600 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Body with Transition */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}>
              <div className="space-y-4 mt-2">
                {section.jobs.map((job, jobIdx) => (
                  <div key={job.id}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 ">
                      <div className="md:w-1/2 lg:w-1/2 sm:w-full xs:w-full md:py-8 lg:py-6">
                        <p className="font-bold text-2xl">
                          {jobIdx + 1}. {job.title}
                        </p>
                        {job.subtitle && (
                          <p className="text-sm text-black ">{job.subtitle}</p>
                        )}
                      </div>
                      <div className="text-right flex items-center gap-10 sm:justify-between xs:justify-between md:justify-end lg:justify-end md:w-1/2 lg:w-1/2  sm:w-full xs:w-full">
                        <p className="text-sm font-semibold text-gray-900">
                          {job.type} | {job.mode} | {job.location}
                        </p>
                        <div className="flex justify-end mt-1">
                          {/* <Link
                            to={`/ai-career`}
                            className="border-2 border-gray-600 p-2 rounded-md hover:bg-black hover:text-white transition-colors">
                            <FaChevronRight />
                          </Link> */}
                          <Link
                            to={`${customLink}/${job.id}`}
                            className="border-2 border-gray-600 p-2 rounded-md hover:bg-black hover:text-white transition-colors">
                            <FaChevronRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                    {section.jobs.length > 1 &&
                      jobIdx < section.jobs.length - 1 && (
                        <hr className="mt-4" />
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Jobrole;
