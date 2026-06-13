const FeatureCard = ({ title, icon }) => {
  return (
    <div
      className="w-full rounded-xl"
    >
      <div className="flex justify-center items-center gap-4 py-4 flex-col border-b-4 border-y-gray-200 transition-all hover:border-black">
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            overflow: "hidden",
            objectFit: "contain",
            whiteSpace:'none'
          }}
        >
          <img
            style={{ width: "100%", height: "100%" }}
            src={icon}
            alt="image"
          />
        </div>

        <p
          className="text-secondary-dark text-tiny lg:text-[0.6rem] font-medium"
         
        >
          {title.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
