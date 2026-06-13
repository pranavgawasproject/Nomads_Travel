import React from 'react';

const LeafWrapper = ({ children, height, width, align = "" }) => {
  return (
    <div className={`flex ${align || "items-start"} gap-2`}>
      <div
        style={{ height: height || "100%", width: width || "5rem" }}
      >
        <img
          src="/svg/LeafL.svg"
          alt="leaf-front"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="mt-0">{children}</div>
      <div
        style={{ height: height || "100%", width: width || "5rem" }}
      >
        <img
          src="/svg/LeafR.svg"
          alt="leaf-rear"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default LeafWrapper;
