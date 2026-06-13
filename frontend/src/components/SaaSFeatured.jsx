import { useEffect, useState } from "react";
import FeatureCard from "./FeatureCard";

const SaaSFeatureBlock = ({
  title,
  underlineImg,
  description1,
  imagePosition,
  imageFit,
  image,
  height,
  mobileHeight,
  rowReverse = false,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine layout based on screen width
  const isMobile = windowWidth <= 768;
  const isLaptop = windowWidth > 768 && windowWidth <= 1440;

  // Define dynamic height and objectFit
  const dynamicHeight = isMobile
    ? mobileHeight || "15rem"
    : isLaptop
    ? "33rem"
    : height || "28rem";

  const dynamicFit = imageFit || (isMobile ? "contain" : "cover");

  return (
    <div
      data-aos="fade-up"
      className="cursor-pointer w-full"
      style={{
        padding: "0rem 0rem",
        backgroundColor: "#fff",
      }}
    >
      <div
        className={`flex gap-10 lg:gap-10 items-strech w-full justify-between flex-col ${rowReverse ? "flex-col lg:flex-row-reverse" : "flex-col lg:flex-row"} `}
      >
        {/* Description Column */}
        <div
          style={{
            flex: 1,
            fontSize: "1rem",
            lineHeight: "1.6",
            maxWidth: "100%",
          }}
        >
          <div className="relative">
            <h1 style={{ padding: 0 }}>
              <span className="flex flex-col text-secondary-dark items-center font-medium text-title uppercase">
                {title}
              </span>
            </h1>
            <div className="w-1/4 h-[19px] absolute top-[99%] left-[38%]">
              <img
                style={{ width: "100%", height: "100%" }}
                src="/blue-line.png"
                alt="underline"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 gap-x-12 lg:gap-x-12 py-4 md:py-5 w-full">
            {description1.map((item, index) => (
              <FeatureCard key={index} icon={item.image} title={item.title} />
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div
          style={{
            flex: 2,
            display: "flex",
            justifyContent: "center",
          }}
          className="border-[1px] border-gray-200 rounded-xl overflow-hidden w-full"
        >
          <img
            src={image}
            alt="feature"
            style={{
              width: "100%",
              height: dynamicHeight,
              objectFit: dynamicFit,
              padding: "1rem",
              objectPosition: imagePosition ? imagePosition : "top",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SaaSFeatureBlock;
