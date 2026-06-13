import React, { useMemo, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const FALLBACK_CENTER = { lat: 15.501, lng: 73.8294 };
const CONTAINER_STYLE = { width: "100%", height: "100%" };

// --- Helpers ---
const isValidCoord = (n) => typeof n === "number" && Number.isFinite(n);

function getAverageCenter(points) {
  const valid = points.filter(
    (p) => isValidCoord(p.lat) && isValidCoord(p.lng)
  );
  if (valid.length === 0) return FALLBACK_CENTER;

  const { latSum, lngSum } = valid.reduce(
    (acc, p) => ({ latSum: acc.latSum + p.lat, lngSum: acc.lngSum + p.lng }),
    { latSum: 0, lngSum: 0 }
  );
  return { lat: latSum / valid.length, lng: lngSum / valid.length };
}

// --- Marker ---
const MarkerItem = React.memo(function MarkerItem({
  loc,
  clusterer,
  isHovered,
  onHover,
  onLeave,
  onClick,
  isMobile,
}) {
  const [tapped, setTapped] = useState(false);

  const position = useMemo(() => {
    const lat = loc.lat + (Math.random() - 0.5) * 0.0001;
    const lng = loc.lng + (Math.random() - 0.5) * 0.0001;
    return { lat, lng };
  }, [loc.lat, loc.lng]);

  const handleMarkerClick = () => {
    if (isMobile) {
      if (!tapped) {
        setTapped(true);
        onHover(loc.id);
        // reset after 2s if user doesn’t tap again
        setTimeout(() => setTapped(false), 2000);
      } else {
        onClick(loc);
      }
    } else {
      onClick(loc);
    }
  };

  return (
    <Marker
      position={position}
      clusterer={clusterer}
      onMouseOver={() => !isMobile && onHover(loc.id)}
      onMouseOut={() => !isMobile && onLeave(loc.id)}
      onClick={handleMarkerClick}
    >
      {(isHovered || (isMobile && tapped)) && (
        <InfoWindow position={position}>
          <div className="w-40 max-w-[160px] rounded-xl shadow-md bg-white p-0 preset">
            <img
              src={loc.image}
              alt={loc.name}
              className="w-full h-20 object-cover rounded-md"
            />
            <div className="flex flex-row items-center justify-between">
              <div className="mt-1 font-semibold text-xs text-black truncate">
                {loc.name}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <FaStar />
                <span className="text-gray-600">{loc.ratings || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-600 font-semibold">
                {loc.location}
              </span>
              <span className="text-black font-semibold">
                Reviews(
                <span className="font-bold">
                  {loc.reviewCount || loc.totalReviews || loc.reviews || 0}
                </span>
                )
              </span>
            </div>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
});

// --- Map ---
export default function Map({
  locations = [],
  disableNavigation = false,
  disableTwoFingerScroll = false,
}) {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });
  const [hoveredId, setHoveredId] = useState(null);

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.innerWidth < 768,
    []
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      gestureHandling: disableTwoFingerScroll ? "none" : "greedy",
    }),
    [disableTwoFingerScroll]
  );

  const mapCenter = useMemo(() => {
    if (locations.length === 1) {
      const only = locations[0];
      if (isValidCoord(only.lat) && isValidCoord(only.lng)) {
        return { lat: only.lat, lng: only.lng };
      }
    }
    if (locations.length > 1) return getAverageCenter(locations);
    return FALLBACK_CENTER;
  }, [locations]);

  const handleHover = useCallback(
    (id) => {
      if (hoveredId !== id) setHoveredId(id);
    },
    [hoveredId]
  );

  const handleLeave = useCallback(
    (id) => {
      if (hoveredId === id) setHoveredId(null);
    },
    [hoveredId]
  );

  const handleMarkerClick = useCallback(
    (loc) => {
      if (disableNavigation && loc?.googleMap) {
        window.open(loc.googleMap, "_blank", "noopener,noreferrer");
        return;
      }
      if (!disableNavigation) {
        navigate(`/listings/${encodeURIComponent(loc.name)}`, {
          state: { companyId: loc?.companyId, type: loc?.companyType },
        });
      }
    },
    [disableNavigation, navigate]
  );

  const markerData = useMemo(
    () =>
      locations
        .filter((l) => isValidCoord(l.lat) && isValidCoord(l.lng))
        .map((l) => ({
          ...l,
          _key: `${l.lat}-${l.lng}-${l.id ?? l._id ?? l.name ?? Math.random()}`,
        })),
    [locations]
  );

  if (!isLoaded) return <div>Loading...</div>;
  const clusterOptions = {
    styles: [
      {
        url: `data:image/svg+xml;utf-8,
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
          <circle cx="15" cy="15" r="15" fill="rgba(37,99,235,0.7)" />
        </svg>`,
        height: 30,
        width: 30,
        textColor: "#000",
        textSize: 10, // bumped a bit so numbers don’t look squished
        fontFamily: "poppins",
      },
    ],
  };

  return (
    <GoogleMap
      mapContainerStyle={CONTAINER_STYLE}
      center={mapCenter}
      zoom={12}
      options={mapOptions}
    >
      <MarkerClusterer options={clusterOptions}>
        {(clusterer) =>
          markerData.map((loc) => (
            <MarkerItem
              key={loc._key}
              loc={loc}
              clusterer={clusterer}
              isHovered={hoveredId === loc.id}
              onHover={handleHover}
              onLeave={handleLeave}
              onClick={handleMarkerClick}
              isMobile={isMobile}
            />
          ))
        }
      </MarkerClusterer>
    </GoogleMap>
  );
}
