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
      className={`fixed bottom-6 right-6 z-[65] flex h-10 w-10 items-center justify-center rounded-full bg-glass border border-glass-border text-accent backdrop-blur-xl shadow-glass transition-all duration-300 hover:bg-accent/10 hover:border-accent/30 hover:shadow-glow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/30 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <HiArrowSmUp className="text-xl" />
    </button>
  );
};

export default BackToTopButton;
