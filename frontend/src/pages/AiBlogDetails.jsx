import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import humanDate from "../utils/humanDate";

const AiBlogDetails = () => {
  // const newsContent = [
  //   {
  //     id: 1,
  //     title: "Content Title 1",
  //     image: "https://wallpapercave.com/wp/w8Lgiy5.jpg",
  //     content:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnisdolorum reprehenderit natus quo facilis ea facere iste illum fugiattenetur, mollitia assumenda pariatur sunt voluptatem itaque quisdolore voluptas! Minima molestias tenetur modi tempore velit laborumaccusantium cupiditate nemo culpa nesciunt ex enim eligendiobcaecati ducimus, harum alias provident atque dolore perferendisquam deserunt deleniti maiores optio! Accusamus omnis libero cumquerem autem voluptates. Quas, cum eos. Dolores, tempore sit?",
  //   },
  //   {
  //     id: 2,
  //     title: "Content Title 2",
  //     image: "https://wallpapercave.com/wp/w8Lgiy5.jpg",
  //     content:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnisdolorum reprehenderit natus quo facilis ea facere iste illum fugiattenetur, mollitia assumenda pariatur sunt voluptatem itaque quisdolore voluptas! Minima molestias tenetur modi tempore velit laborumaccusantium cupiditate nemo culpa nesciunt ex enim eligendiobcaecati ducimus, harum alias provident atque dolore perferendisquam deserunt deleniti maiores optio! Accusamus omnis libero cumquerem autem voluptates. Quas, cum eos. Dolores, tempore sit?",
  //   },
  //   {
  //     id: 3,
  //     title: "Content Title 3",
  //     image: "https://wallpapercave.com/wp/w8Lgiy5.jpg",
  //     content:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnisdolorum reprehenderit natus quo facilis ea facere iste illum fugiattenetur, mollitia assumenda pariatur sunt voluptatem itaque quisdolore voluptas! Minima molestias tenetur modi tempore velit laborumaccusantium cupiditate nemo culpa nesciunt ex enim eligendiobcaecati ducimus, harum alias provident atque dolore perferendisquam deserunt deleniti maiores optio! Accusamus omnis libero cumquerem autem voluptates. Quas, cum eos. Dolores, tempore sit?",
  //   },
  //   {
  //     id: 4,
  //     title: "Content Title 4",
  //     image: "https://wallpapercave.com/wp/w8Lgiy5.jpg",
  //     content:
  //       "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Omnisdolorum reprehenderit natus quo facilis ea facere iste illum fugiattenetur, mollitia assumenda pariatur sunt voluptatem itaque quisdolore voluptas! Minima molestias tenetur modi tempore velit laborumaccusantium cupiditate nemo culpa nesciunt ex enim eligendiobcaecati ducimus, harum alias provident atque dolore perferendisquam deserunt deleniti maiores optio! Accusamus omnis libero cumquerem autem voluptates. Quas, cum eos. Dolores, tempore sit?",
  //   },
  // ];
  const location = useLocation();
  const { content } = location.state;
  console.log("content : ", content);
  const newsContent = content?.sections || [];

  const [activeImage, setActiveImage] = useState(null);

  const handleImageOpen = (imageUrl) => {
    if (imageUrl) {
      setActiveImage(imageUrl);
    }
  };

  const handleImageClose = () => {
    setActiveImage(null);
  };

  const renderContent = (text) => <p className="whitespace-pre-line">{text}</p>;

  const goToHostsContentCopyright = () => {
    if (window.location.hostname.includes("localhost")) {
      window.location.href =
        "http://hosts.localhost:5173/content-and-copyright";
    } else {
      window.location.href = "https://hosts.yourdomain.com/content-and-copyright";
    }
  };

  return (
    <div className="animate-fade-in min-w-[70%] max-w-[80rem] lg:max-w-[75rem] mx-0 md:mx-auto p-4 lg:p-0">
      {/* <button
        type="button"
        onClick={handleBackButtonClick}
        aria-label="Go back"
        className="inline-flex items-center justify-center rounded-full border border-accent p-1 text-accent"
      >
        <ArrowLeft size={16} />
      </button> */}
      <div className="flex flex-col gap-8">
        <section className="space-y-8">
          <h1 className="text-title leading-normal font-bold">
            {content?.mainTitle ||
              content?.title ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit."}
          </h1>
          <div className="h-96 rounded-xl w-full overflow-hidden">
            <img
              src={
                content?.mainImage ||
                content?.image ||
                "https://wallpapercave.com/wp/w8Lgiy5.jpg"
              }
              alt="main-image"
              className="object-cover h-full w-full cursor-pointer"
              onClick={() =>
                handleImageOpen(
                  content?.mainImage ||
                    content?.image ||
                    "https://wallpapercave.com/wp/w8Lgiy5.jpg",
                )
              }
            />
          </div>
          {renderContent(
            content?.mainContent ||
              content?.content ||
              "Main Content goes here",
          )}
        </section>
        <hr />
        <section className="flex flex-col gap-8">
          {newsContent &&
            newsContent.map((item) => (
              <article key={item.id} className="space-y-4">
                <h1 className="text-card-title font-bold">{item.title}</h1>
                {item.image && (
                  <div className="h-96 rounded-xl w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt="main-image"
                      className="object-cover h-full w-full cursor-pointer"
                      onClick={() => handleImageOpen(item.image)}
                    />
                  </div>
                )}
                {renderContent(item.content)}
              </article>
            ))}
        </section>
        <hr />
        <footer className="flex w-full justify-between items-center">
          <p>{content?.author || ""}</p>
          <p>{humanDate(content?.date) || new Date().toLocaleString()}</p>
          <p>
            {typeof content?.source === "object"
              ? content?.source?.name || "Source"
              : content?.source || "Source"}
          </p>
        </footer>
      </div>
      <hr className="mt-5 mb-0 lg:mt-10 lg:mb-0" />

      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={handleImageClose}
        >
          <div
            className="relative max-h-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute -right-3 -top-3 rounded-full bg-surface-200 px-2 py-1 text-sm font-semibold text-gray-300 shadow-card"
              onClick={handleImageClose}
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img
              src={activeImage}
              alt="Expanded content"
              className="max-h-[85vh] w-full rounded-lg object-contain shadow-xl"
            />
          </div>
        </div>
      )}

      {/* Content & Source Disclaimer */}
      <div className="text-[0.5rem] text-gray-500 leading-relaxed mt-5">
        <p className="mb-2">
          <b>Source:</b> All above content, images and details have been sourced
          from publicly available information.
        </p>
        <p className="mb-2">
          <b>Content and Copyright Disclaimer:</b> RoamIQ is a explorer services and
          informational platform that aggregates and presents publicly available
          information about co-working spaces, co-living spaces, serviced
          apartments, hostels, workation spaces, meeting rooms, working cafés
          and related lifestyle or travel services. All such information
          displayed on its platform, including images, brand names, or
          descriptions is shared solely for informational and reference purposes
          to help explorers/users discover and compare global explorer-friendly
          information and services on its central platform.
        </p>
        <p className="mb-2">
          RoamIQ does not claim ownership of any third-party logos, images,
          descriptions, or business information displayed on the platform. All
          trademarks, brand names, and intellectual property remain the
          exclusive property of their respective owners and platforms. The
          inclusion of third-party information does not imply endorsement,
          partnership, or affiliation unless explicitly stated.
        </p>
        <p className="mb-2">
          The content featured from other websites and platforms on RoamIQ is not
          used for direct monetization, resale, or advertising gain. RoamIQ’s
          purpose is to inform and connect remote workers and travelers and remote working
          professionals by curating publicly available data in a transparent,
          good-faith manner for the ease of its users and to support and grow
          the businesses who are providing these services with intent to grow
          them and the ecosystem.
        </p>
        <p className="mt-2">
          Read the entire{" "}
          <span
            className="underline text-accent cursor-pointer"
            onClick={goToHostsContentCopyright}
          >
            Content and Copyright
          </span>{" "}
          by clicking the link in our website footer.
        </p>
      </div>
    </div>
  );
};

export default AiBlogDetails;
