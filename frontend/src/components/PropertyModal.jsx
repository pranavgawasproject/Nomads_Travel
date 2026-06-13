import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";
import MuiModal from "./Modal";
import useIsMobile from "../hooks/useIsMobile";

const PropertyModal = ({ open, onClose, property }) => {
  const isSmallScreen = useIsMobile();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slides: { perView: 1, spacing: 16 },
    created: () => setLoaded(true),
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  // Reset current slide when property changes
  useEffect(() => {
    if (slider) {
      slider.current?.moveToIdx(0);
    }
  }, [property, slider]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;
      if (e.key === "ArrowLeft") {
        slider.current?.prev();
      } else if (e.key === "ArrowRight") {
        slider.current?.next();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, slider, onClose]);

  if (!property) return null;

  const goPrev = (e) => {
    e.stopPropagation();
    slider.current?.prev();
  };

  const goNext = (e) => {
    e.stopPropagation();
    slider.current?.next();
  };

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      title={property.propertyLocation}
      maxWidth={isSmallScreen ? "xs" : "md"}
      fullScreen={isSmallScreen}
    >
      <div className="relative h-auto w-full flex flex-col">
        {/* Image Slider */}
        <div className="flex-grow flex items-center justify-center">
          <div
            ref={sliderRef}
            className="keen-slider rounded-lg overflow-hidden w-full"
          >
            {property.images && property.images.length > 0 ? (
              property.images.map((img, idx) => (
                <div
                  key={idx}
                  className="keen-slider__slide flex justify-center items-center bg-gray-100"
                >
                  <div className="w-full h-[250px] md:h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={img}
                      alt={`${property.name} - Image ${idx + 1}`}
                      className="w-full h-full object-contain"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="keen-slider__slide flex justify-center items-center bg-gray-100">
                <div className="text-gray-500">No images available</div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {loaded && property.images && property.images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="w-8 h-8 md:w-10 md:h-10 flex font-bold text-center justify-center items-center absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 md:p-2 rounded-full shadow z-10"
              aria-label="Previous image"
            >
              &#8592;
            </button>
            <button
              onClick={goNext}
              className="w-8 h-8 md:w-10 md:h-10 flex font-bold text-center justify-center items-center absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white text-black p-1 md:p-2 rounded-full shadow z-10"
              aria-label="Next image"
            >
              &#8594;
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full z-10">
              {currentSlide + 1} / {property.images.length}
            </div>
          </>
        )}

        {/* Property Details (can be expanded) */}
        <div className="bg-gray-50 rounded-lg">
          {property.description && (
            <p className="text-sm md:text-base text-gray-700 mb-2">
              {property.description}
            </p>
          )}
          {/* You can add more property details here */}
        </div>
      </div>
    </MuiModal>
  );
};

export default PropertyModal;
