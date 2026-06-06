import React from "react";
import { Link } from "react-router-dom";
import StickyNavbar from "./../components/layout/StickyNavbar";
const images = [
  { id: 1, src: "https://picsum.photos/1200/600" },
  { id: 2, src: "https://picsum.photos/600/600" },
  { id: 3, src: "https://picsum.photos/601/600" },
  { id: 4, src: "https://picsum.photos/1200/601" },
  { id: 5, src: "https://picsum.photos/602/600" },
  { id: 6, src: "https://picsum.photos/603/600" },
  { id: 7, src: "https://picsum.photos/1200/602" },
  { id: 8, src: "https://picsum.photos/604/600" },
  { id: 9, src: "https://picsum.photos/605/600" },
];

const Work: React.FC = () => {
  return (
    <>
      {" "}
      <StickyNavbar />
      <div className="w-full bg-white/10 px-4 md:px-10 lg:px-20 py-10 space-y-10">
        <div className=""></div>
        {/* Header */}
        <div className="max-w-3xl ">
          <h1 className="text-head font-primary tracking-widest uppercase leading-tight">
            Our Work
          </h1>
          <p className="mt-4 text-black/90 font-secondary text-body ">
            Explore our latest projects showcasing creativity, design, and
            innovation.
          </p>
        </div>

        {/* Image Grid */}
        <div className="space-y-6">
          {/* 100% Image */}
          <ImageCard src={images[0].src} full />

          {/* 50% / 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageCard src={images[1].src} />
            <ImageCard src={images[2].src} />
          </div>

          {/* 100% Image */}
          <ImageCard src={images[3].src} full />

          {/* 50% / 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageCard src={images[4].src} />
            <ImageCard src={images[5].src} />
          </div>

          {/* 100% Image */}
          <ImageCard src={images[6].src} full />

          {/* 50% / 50% */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageCard src={images[7].src} />
            <ImageCard src={images[8].src} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Work;

// 🔹 Reusable Image Card Component
const ImageCard = ({ src, full }: { src: string; full?: boolean }) => {
  return (
    <div
      className={`relative w-full ${full ? "h-[300px] md:h-[450px]" : "h-[300px]"}`}
    >
      <img
        src={src}
        alt="work"
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* Button */}
      <Link
        to={"/detail"}
        className="absolute bottom-4 left-4 bg-black text-white text-center text-body font-mono md:px-4 md:pt-2 md:pb-2 px-[6px] py-[4px] rounded-full hover:bg-white hover:text-black transition"
      >
        Show More
      </Link>
    </div>
  );
};
