import React from "react";
import icons from "../assets/icons";

// Master fixed amenities dictionary by vertical
const fixedAmenitiesMap = {
  coworking: [
    "Private Desk",
    "Private Storage",
    "Air Conditioning",
    "High Speed Wi-Fi",
    "Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Meeting Room",
    "Cafeteria",
    "Printing Services",
    "CCTV Secure",
    "Purified Water",
    "Custom Solutions",
  ],
  coliving: [
    "Shared Space",
    "Private Space",
    "Private Storage",
    "Air Conditioning",
    "Wi-Fi",
    "High Speed Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Cafeteria",
    "Printing Services",
    "Laundry Facilities",
    "CCTV Secure",
    "Swimming Pool",
  ],
  workation: [
    "Shared Space",
    "Private Space",
    "Private Storage",
    "Air Conditioning",
    "Wi-Fi",
    "High Speed Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Cafeteria",
    "Printing Services",
    "Laundry Facilities",
    "CCTV Secure",
    "Swimming Pool",
  ],
  privatestay: [
    "Private Space",
    "Private Storage",
    "Television",
    "Air Conditioning",
    "Wi-Fi",
    "High Speed Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Cafeteria",
    "Printing Services",
    "Washing Machine",
    "CCTV Secure",
    "Swimming Pool",
  ],
  hostel: [
    "Shared Space",
    "Private Space",
    "Private Storage",
    "Air Conditioning",
    "Wi-Fi",
    "High Speed Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Cafeteria",
    "Printing Services",
    "Laundry Facilities",
    "CCTV Secure",
    "Swimming Pool",
  ],
  cafe: [
    "Private Desk",
    "Private Storage",
    "Air Conditioning",
    "High Speed Wi-Fi",
    "Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Visitor allowed",
    "Cafeteria",
    "Printing Services",
    "CCTV Secure",
    "Water Purifier",
    "Custom Solutions",
  ],
  meetingroom: [
    "Private Meeting Room",
    "Smart Television",
    "Air Conditioning",
    "High Speed Wi-Fi",
    "Wi-Fi",
    "IT Support",
    "Tea & Coffee",
    "Reception Support",
    "Admin Support",
    "Housekeeping",
    "Community",
    "Maintenance",
    "Power Backup",
    "Visitor allowed",
    "Cafeteria",
    "Printing Services",
    "CCTV Secure",
    "Water Purifier",
    "Custom Solutions",
  ],
};

// Normalize key for matching
const normalizeKey = (str) => str.toLowerCase().replace(/[\s&]/g, "").trim();

export default function AmenitiesList({ type = "coworking", inclusions = [] }) {
  // Normalize all backend inclusions once
  const normalizedInclusions = inclusions.map(normalizeKey);

  const hasHighSpeedWiFi = normalizedInclusions.includes(
    normalizeKey("High Speed Wi-Fi")
  );
  const hasWiFi = normalizedInclusions.includes(normalizeKey("Wi-Fi"));

  // Pick correct fixed amenities list
  let fixedAmenities = fixedAmenitiesMap[type?.toLowerCase()] || [];

  // Apply exclusion rule
  if (hasHighSpeedWiFi) {
    fixedAmenities = fixedAmenities.filter(
      (a) => normalizeKey(a) !== normalizeKey("Wi-Fi")
    );
  } else if (hasWiFi) {
    fixedAmenities = fixedAmenities.filter(
      (a) => normalizeKey(a) !== normalizeKey("High Speed Wi-Fi")
    );
  }

  // Sort: available first, then unavailable; both groups sorted alphabetically
  const sortedAmenities = [...fixedAmenities].sort((a, b) => {
    const aAvailable = normalizedInclusions.includes(normalizeKey(a));
    const bAvailable = normalizedInclusions.includes(normalizeKey(b));

    if (aAvailable && !bAvailable) return -1; // a before b
    if (!aAvailable && bAvailable) return 1; // b before a
    return a.localeCompare(b); // both same availability -> alphabetical
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8 lg:gap-y-10 lg:gap-x-12">
      {sortedAmenities.map((amenity) => {
        const key = normalizeKey(amenity);
        const isAvailable = normalizedInclusions.includes(key);
        const iconSrc = icons[key] || "/icons/default.webp";

        return (
          <div
            key={amenity}
            className="flex items-center gap-3 w-full"
          >
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden relative rounded-lg bg-gray-50 p-1">
              <img
                src={iconSrc}
                className="h-full w-full object-contain"
                alt={amenity}
              />
              {!isAvailable && (
                <div className="absolute h-full w-[2px] -top-1 left-[45%] -rotate-45 bg-gray-400 opacity-60" />
              )}
            </div>
            <p
              className={`text-left text-secondary-dark font-medium leading-tight text-xs md:text-small uppercase ${!isAvailable ? "line-through text-gray-400" : ""
                }`}
            >
              {amenity}
            </p>
          </div>
        );
      })}
    </div>
  );
}
