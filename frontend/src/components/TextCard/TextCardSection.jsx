import TextCard from "./TextCard";

const TextCardSection = () => {
    const cardData = [
      {
        title: "Mortgage",
        description: "Find a mortgage rate that fits your needs."
      },
      {
        title: "Properties",
        description: "Find top properties, from off-plan to move-in ready."
      }
    ];
  
    return (
      <div className="flex justify-center gap-6 flex-wrap">
        {cardData.map((card, index) => (
          <TextCard key={index} {...card} />
        ))}
      </div>
    );
  };
  
  export default TextCardSection;