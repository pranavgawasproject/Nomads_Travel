import image from "../../assets/image1.jpg";
import geography from "../../assets/geography-second.jpg";
import roi from "../../assets/roi.jpg";
import endToEndBridg from "../../assets/bridg.avif";
import resident from "../../assets/resident_mortgage.jpg";
import nonResident from "../../assets/non_resident_mortgage.jpg";
import equity from "../../assets/equity_mortgage.jpg";
import { BiCheck } from "react-icons/bi";


const imageMap = {
  geography,
  roi,
  endToEndBridg,
  resident,
  nonResident,
  equity,
  default: "",
};

const AnimatedCard = ({ imageSrc, title, description }) => {
  const resolvedImage = imageMap[imageSrc] || imageMap["default"];

  return (
    <div className="bg-white rounded-xl shadow-md text-start flex flex-col justify-start p-6 w-full lg:w-full h-full gap-4">
      <div className="flex justify-center w-full items-center h-52 rounded-xl overflow-hidden">
        <img
          src={resolvedImage}
          style={{ imageRendering: "auto" }}
          alt="Card Icon"
          className="h-full w-full object-contain scale-125"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-title md:text-headline font-semibold leading-snug">{title}</h3>
        {Array.isArray(description)? <ul className="mt-1 space-y-1">
          {description?.map((text, i) => (
            <li key={i} className="flex items-center gap-2">
               <BiCheck />
              <p className="text-gray-500 text-sm md:text-small">{text}</p>
            </li>
          ))}
        </ul>:
        <p className="text-body">{description}</p>}
      </div>
    </div>
  );
};

export default AnimatedCard;
