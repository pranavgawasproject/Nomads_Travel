import { FaStar } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { BsChatSquareQuote } from "react-icons/bs";
import { MdOutlineBadge } from "react-icons/md";

const ContentHighlight = () => {
  return (
    <section className="bg-[#f8f6f4] py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl font-light font-serif leading-tight text-gray-900">
            Helping you make{" "}
            <span className="italic font-semibold">confident</span> property
            decisions
          </h2>
          <div className="mt-6 flex items-center text-gray-600 font-medium cursor-pointer hover:underline">
            <FaStar className="mr-2 text-gray-400" />
            WHY CHOOSE EXPLORER HOMES?
          </div>
        </div>

        <div className="grid grid-cols-2 border-l border-gray-300 pl-10">
          <div className="flex items-start gap-3 p-6 ">
            <FaStar className="text-xl text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">OVER 10 YEARS</h3>
              <p className="text-sm text-gray-600 mt-1">of Real Estate Expertise</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-6 border-l">
          <IoHomeOutline className="text-xl text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">5.000+ VILLAS SOLD</h3>
              <p className="text-sm text-gray-600 mt-1">across Dubai</p>
            </div>
          </div>
        
         <div className="flex items-start gap-3 p-6 border-t ">
            <BsChatSquareQuote className="text-xl text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">5/5 • GOOGLE RATING</h3>
              <p className="text-sm text-gray-600 mt-1">Trusted by homebuyers</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-6 border-l border-t">
            <MdOutlineBadge className="text-xl text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-sm text-gray-900">CERTIFIED CONSULTANTS</h3>
              <p className="text-sm text-gray-600 mt-1">with local market expertise</p>
            </div>
          </div>
       
        </div>
      </div>
    </section>
  );
};

export default ContentHighlight;
