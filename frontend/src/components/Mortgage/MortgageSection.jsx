import React from "react";
import MortgageCard from "./MortgageCard";

const mortgageData = [
  {
    image:
      "https://huspy.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165304%2F564x376%2Fe7c4232d15%2Fnon_resident_mortgages.jpeg&w=1920&q=75",
    title: "Resident mortgage",
    description:
      "Using our extensive knowledge of the Dubai home loan market and property transaction process, we'll take the hassle out of getting your mortgage.",
    buttonText: "Get pre-approved",
  },
  {
    image:
      "https://huspy.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165304%2F564x376%2Fe7c4232d15%2Fnon_resident_mortgages.jpeg&w=1920&q=75",
    title: "Non-resident mortgage",
    description:
      "If you're looking to buy in Dubai, Abu Dhabi, or anywhere else in the Dubai, we can assist with our low-documentation exclusive mortgage offers.",
    buttonText: "Speak with an expert",
  },
  {
    image:
      "https://huspy.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165304%2F564x376%2Fe7c4232d15%2Fnon_resident_mortgages.jpeg&w=1920&q=75",
    title: "Equity release / Buyouts",
    description:
      "We can help you unlock equity from a property you already own, or refinance an existing mortgage if you're currently paying too much.",
    buttonText: "Find out more",
  },
  {
    image:
      "https://huspy.com/_next/image?url=https%3A%2F%2Fa.storyblok.com%2Ff%2F165304%2F564x376%2Fe7c4232d15%2Fnon_resident_mortgages.jpeg&w=1920&q=75",
    title: "Commercial finance",
    description:
      "Whether you're looking to buy a new building or release equity on an existing one, our experienced mortgage consultants have the answer.",
    buttonText: "Book a call",
  },
];

const MortgageSection = () => {
  return (
    <div className="py-12 px-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Mortgage leaders for a reason. We can help you with the following
        services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mortgageData.map((mortgage, index) => (
          <MortgageCard key={index} {...mortgage} />
        ))}
      </div>
    </div>
  );
};

export default MortgageSection;
