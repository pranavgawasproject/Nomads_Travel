import { useEffect, useState } from "react";
import { HiArrowSmUp } from "react-icons/hi";

const BackToTopButton = ({ scrollContainerRef, threshold = 240 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current;

    if (!scrollContainer) {
      return undefined;
    }

    const updateVisibility = () => {
      setIsVisible(scrollContainer.scrollTop > threshold);
    };

    updateVisibility();
    scrollContainer.addEventListener("scroll", updateVisibility, {
      passive: true,
    });

    return () => {
      scrollContainer.removeEventListener("scroll", updateVisibility);
    };
  }, [scrollContainerRef, threshold]);

  const handleBackToTop = () => {
    scrollContainerRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleBackToTop}
      className={`fixed bottom-14 right-6 z-[65] flex h-12 w-12 items-center justify-center rounded-full bg-primary-blue text-white shadow-lg transition-all duration-300 hover:bg-primary-blue focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <HiArrowSmUp className="text-2xl" />
    </button>
  );
};

export default BackToTopButton;
