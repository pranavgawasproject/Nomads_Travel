import { useLocation } from "react-router-dom";
import GlobalListingsMap from "./GlobalListingsMap";
import GlobalListingsList from "./GlobalListingsList"; // Assuming you split list logic
import AiGlobalListingsMap from "./AiGlobalListingsMap";
import AiGlobalListingsList from "./AiGlobalListingsList";

const AiGlobalListings = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const view = params.get("view");

  return (
    // <div className="pt-4 lg:pt-6">
    <div className="">
      {view === "map" ? <AiGlobalListingsMap /> : <AiGlobalListingsList />}
    </div>
  );
};

export default AiGlobalListings;
