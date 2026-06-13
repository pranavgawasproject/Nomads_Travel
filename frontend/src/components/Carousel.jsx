import { useKeenSlider } from "keen-slider/react";
import { useEffect } from "react";

const Carousel = ({ carouselItems }) => {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1, // default for mobile
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 769px)": {
        slides: { perView: 2, spacing: 14 }, // tablets
      },
      "(min-width: 1025px)": {
        slides: { perView: 5, spacing: 16 }, // desktops
      },
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      slider?.current.next();
    }, 40000);

    return () => {
      clearInterval(interval);
    };
  }, [slider]);

  return (
    <div ref={sliderRef} className="keen-slider">
      {carouselItems.map((item, index) => (
        <div
          key={index}
          className="keen-slider__slide relative h-[340px] rounded-xl overflow-hidden bg-cover bg-center "
          style={{
            backgroundImage: `url(${item.image || "/placeholder.jpg"})`,
          }}>
          {/* Bottom overlay with solid black background */}
          <div className="absolute bottom-0 left-0 right-0 z-10 text-white text-subtitle font-semibold uppercase text-center">
            <div className="bg-gradient-to-t from-black/90 via-black/80 to-transparent px-2 py-3">
              {item.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
