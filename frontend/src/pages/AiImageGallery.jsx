import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/masonry.css";
import "react-photo-album/columns.css";
import { useKeenSlider } from "keen-slider/react";
import TransparentModal from "../components/TransparentModal";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setFormValues } from "../features/locationSlice.js";
import { ArrowLeft } from "lucide-react";

const AiImageGallery = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { company: companyParam } = useParams();
  const dispatch = useDispatch();
  const {
    images = [],
    companyName,
    selectedImageId,
    continent = "Asia",
    country,
    state: companyState,
    companyType,
  } = location.state || {};
  const imageRefs = useRef({});
  const [imageLoadStatus, setImageLoadStatus] = useState({});

  const [photos, setPhotos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged: (s) => setCurrentIndex(s.track.details.rel),
  });

  useEffect(() => {
    const loadImageDimensions = async () => {
      const promises = images.map(
        (img) =>
          new Promise((resolve) => {
            const image = new Image();
            image.src = img.url;
            image.onload = () => {
              resolve({
                src: img.url,
                width: image.naturalWidth,
                height: image.naturalHeight,
                key: img._id,
              });
            };
            image.onerror = () => {
              resolve({
                src: img.url,
                width: 4,
                height: 3,
                key: img._id,
              });
            };
          }),
      );

      const loadedPhotos = await Promise.all(promises);
      setPhotos(loadedPhotos);
    };

    loadImageDimensions();
  }, [images]);

  useEffect(() => {
    if (selectedImageId && imageRefs.current[selectedImageId]) {
      imageRefs.current[selectedImageId].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [photos, selectedImageId]);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);

    // Wait for the modal and slider to render
    setTimeout(() => {
      instanceRef.current?.moveToIdx(index);
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrev = () => {
    instanceRef.current?.prev();
  };

  const goToNext = () => {
    instanceRef.current?.next();
  };

  const resolvedCompanyName = companyName || companyParam || "Unknown";

  const getCompanyTypeBreadcrumbLabel = (value) => {
    const companyTypeLabelMap = {
      coworking: "Co-Working",
      hostel: "Hostel",
      coliving: "Co-Living",
      meetingroom: "MeetingRooms",
      cafe: "Cafes",
      workation: "Workation",
    };

    return companyTypeLabelMap[value?.toLowerCase()] || value;
  };

  const breadcrumbItems = [
    { key: "continent", label: continent, isLink: true },
    { key: "country", label: country, isLink: true },
    { key: "state", label: companyState, isLink: true },
    {
      key: "companyType",
      label: getCompanyTypeBreadcrumbLabel(companyType),
      isLink: true,
    },
    {
      key: "companyName",
      label: resolvedCompanyName,
      isLink: Boolean(companyName || companyParam),
      onClick: () => {
        const target = companyParam || companyName;
        if (!target) return;
        navigate(`/ai-listings/${encodeURIComponent(target)}`);
      },
    },
    { key: "gallery", label: "Gallery", isLink: false },
  ].filter((item) => item.label);

  useEffect(() => {
    const trail = [
      { label: continent, path: "/ai-verticals" },
      {
        label: country,
        path: `/ai-verticals?country=${encodeURIComponent(
          country || "",
        )}&state=${encodeURIComponent(companyState || "")}`,
      },
      {
        label: companyState,
        path: `/ai-verticals?country=${encodeURIComponent(
          country || "",
        )}&state=${encodeURIComponent(companyState || "")}`,
      },
      {
        label: getCompanyTypeBreadcrumbLabel(companyType),
        path: `/ai-listings-list?country=${encodeURIComponent(
          country || "",
        )}&location=${encodeURIComponent(
          companyState || "",
        )}&category=${encodeURIComponent(companyType || "")}`,
      },
      {
        label: resolvedCompanyName,
        path: `/ai-listings/${encodeURIComponent(companyParam || companyName || "")}`,
      },
      { label: "Gallery", truncate: true },
    ].filter((item) => item.label);

    if (trail.length === 0) return;
    const currentTrail = location.state?.stickyBreadcrumbs || [];
    if (JSON.stringify(currentTrail) === JSON.stringify(trail)) return;

    navigate(location.pathname + location.search, {
      replace: true,
      state: {
        ...location.state,
        stickyBreadcrumbs: trail,
      },
    });
  }, [
    companyName,
    companyParam,
    companyState,
    companyType,
    continent,
    country,
    location.pathname,
    location.search,
    location.state,
    navigate,
    resolvedCompanyName,
  ]);

  const handleBreadcrumbNavigate = (breadcrumbKey) => {
    const normalizeValue = (value) =>
      typeof value === "string" ? value.trim().toLowerCase() : value;

    const normalizedContinent = normalizeValue(continent);
    const normalizedCountry = normalizeValue(country);
    const normalizedLocation = normalizeValue(companyState);
    const normalizedCategory = normalizeValue(companyType);

    const isCompanyTypeClick = breadcrumbKey === "companyType";

    dispatch(
      setFormValues({
        continent: normalizedContinent || "",
        country: normalizedCountry || "",
        location: normalizedLocation || "",
        category: isCompanyTypeClick ? normalizedCategory || "" : "",
        count: "",
      }),
    );

    if (isCompanyTypeClick) {
      navigate(
        `/ai-listings-list?country=${normalizedCountry || ""}&location=${
          normalizedLocation || ""
        }&category=${normalizedCategory || ""}`,
      );
      return;
    }

    navigate(
      `/ai-verticals?country=${normalizedCountry || ""}&state=${
        normalizedLocation || ""
      }`,
    );
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6 flex flex-col gap-4">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="hidden my-4 items-center text-primary-blue text-[10px] md:text-sm lg:text-base"
        >
          <button
            type="button"
            onClick={handleBackButtonClick}
            aria-label="Go back"
            className="inline-flex items-center justify-center rounded-full border border-primary-blue p-1 text-primary-blue"
          >
            <ArrowLeft size={14} />
          </button>
          <span className="mx-1 md:mx-2">{">"}</span>
          {breadcrumbItems.map((item, index) => (
            <span key={`${item.label}-${index}`}>
              {item.isLink ? (
                <button
                  type="button"
                  onClick={
                    item.onClick || (() => handleBreadcrumbNavigate(item.key))
                  }
                  className="text-primary-blue hover:text-primary-dark transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="truncate max-w-[80px] md:max-w-none inline-block align-bottom">
                  {item.label}
                </span>
              )}
              {index < breadcrumbItems.length - 1 ? (
                <span className="mx-1 md:mx-2">{">"}</span>
              ) : null}
            </span>
          ))}
        </nav>
        <h1 className="text-title font-semibold text-secondary-dark">
          {resolvedCompanyName} Gallery
        </h1>
      </div>
      <ColumnsPhotoAlbum
        photos={photos}
        spacing={8}
        columns={(containerWidth) => {
          if (containerWidth < 640) return 1;
          if (containerWidth < 1024) return 2;
          return 2;
        }}
        renderPhoto={({ photo, wrapperStyle, imageProps }) => {
          const isLoaded = imageLoadStatus[photo.key];

          return (
            <div
              style={wrapperStyle}
              key={photo.key}
              ref={(el) => {
                if (el) imageRefs.current[photo.key] = el;
              }}
              className="relative"
            >
              {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
              )}
              <img
                {...imageProps}
                onLoad={() =>
                  setImageLoadStatus((prev) => ({ ...prev, [photo.key]: true }))
                }
                className={`rounded-md cursor-pointer transition ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                alt="gallery"
              />
            </div>
          );
        }}
        onClick={({ index }) => openModal(index)} // Optional: if you keep the modal feature
      />

      <TransparentModal
        open={isModalOpen}
        onClose={closeModal}
        title=""
        headerBackground="black"
      >
        <div className="flex items-center justify-between w-full">
          <button
            onClick={goToPrev}
            className="text-white hidden  border-white border-2 bg-black hover:bg-gray-600 w-12 h-12 p-0 lg:flex items-center justify-center rounded-full"
          >
            <IoIosArrowBack />
          </button>
          <div ref={sliderRef} className="keen-slider w-full">
            {photos.map((photo, idx) => (
              <div
                key={photo.key}
                className="keen-slider__slide flex justify-center items-center"
              >
                <img
                  src={photo.src}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-[90vh] object-contain rounded-md"
                />
              </div>
            ))}
          </div>
          <button
            onClick={goToNext}
            className="text-white hidden  border-white border-2 bg-black hover:bg-gray-600 w-12 h-12 p-2 lg:flex items-center justify-center rounded-full"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </TransparentModal>
    </div>
  );
};

export default AiImageGallery;
