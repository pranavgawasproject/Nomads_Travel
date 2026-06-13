import AnimatedCard from "./AnimatedCard";
  
  const AnimatedCardSection = () => {
    const cardData = [
        {
          imageSrc: "/images/Dubai-map.png",
          title: "Trusted by over 8000+ Dubai homebuyers",
          description: "Our experts have over 20 years of experience working for leading global and Dubai banks."
        },
        {
          imageSrc: "/images/mortgage-options.png",
          title: "Tailor-made mortgage options",
          description: "Our commitment: Your terms, your dream home financing option. Let us help you find your perfect match."
        },
        {
          imageSrc: "/images/process.png",
          title: "Hassle-free from start to finish",
          description: "We guide you throughout the entire mortgage process - from pre-approval to disbursal."
        }
      ];
  
    return (
      <div className="flex justify-center gap-6 flex-wrap">
        {cardData.map((card, index) => (
          <AnimatedCard key={index} {...card} />
        ))}
      </div>
    );
  };
  
  export default AnimatedCardSection;
  