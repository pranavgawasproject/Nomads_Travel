import React from "react";
import InfoItem from "./InfoItem";

const InfoBox = ({ title, items }) => {
  return (
    <div className="bg-black/80 p-3 rounded-md max-w-md border border-white/20 my-4">
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <div>
        {items.map((item, index) => (
          <InfoItem
            key={index}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default InfoBox;
