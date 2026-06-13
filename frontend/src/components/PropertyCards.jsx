import { useState } from "react";
import { FaEye } from "react-icons/fa";
import PropertyModal from "./PropertyModal";
import { BiCheck } from "react-icons/bi";

const PropertyCards = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCardClick = (property) => {
    setSelectedProperty(property);
    setOpenModal(true);
  };

  return (
    <section className="flex justify-center items-center">
      <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col transition hover:shadow-md"
          >
            <div className="relative" onClick={() => handleCardClick(property)}>
              <img
                src={property.image}
                alt="Property"
                className="h-72 w-full object-cover cursor-pointer"
              />
              <button
                className="absolute top-4 right-4 bg-white text-sm font-medium rounded-full px-4 py-1 shadow hover:bg-gray-100 flex items-center gap-1"
              >
                View Demo
                <FaEye className="text-sm" />
              </button>
            </div>

            <div className="p-5 flex flex-col flex-grow space-y-6">
              {/* Location */}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {property.propertyLocation}
                </h2>
                <p className="text-sm text-gray-500">{property.city}</p>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-body font-bold text-gray-800 mb-3">
                  Property Details
                </h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="Purchase Price" value={property.purchasePrice} />
                  <DetailRow label="Purchase Type" value={property.purchaseType} />
                  <DetailRow label="Property Status" value={property.propertyStatus} />
                  <DetailRow label="Rental Term" value={property.rentalTerm} />
                  <DetailRow label="Monthly Rental" value={property.monthlyRental} />
                  <DetailRow label="ROI" value={property.roi} />
                </div>
              </div>

              {/* Investor Details */}
              <div>
                <h3 className="text-body font-bold text-gray-800 mb-3">
                  Investor Details
                </h3>
                <div className="space-y-2 text-sm">
                  <DetailRow label="Investor Name" value={<span className="blur-sm">{property.investorName}</span>} />
                  <DetailRow label="Investor Country" value={property.investorCountry} />
                  <DetailRow label="Investment on Platform" value={property.investmentOnPlatform} />
                  <DetailRow label="Next Fresh Investment" value={property.nextFreshInvestment} />
                </div>
              </div>

              {/* Dubai Residency */}
              <div className="flex justify-between">
                <h3 className="text-body font-bold text-gray-800 mb-3">
                  Dubai Resident VISA
                </h3>
                <h3 className="text-body font-bold text-gray-800 mb-3">
                  {property.dubaiResidencyStatus}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <PropertyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        property={selectedProperty}
      />
    </section>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <BiCheck />
    <span className="text-gray-500">{label}</span>
    <span className="ml-auto text-gray-900 font-medium">{value}</span>
  </div>
);

export default PropertyCards;