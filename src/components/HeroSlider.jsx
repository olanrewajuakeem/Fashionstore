import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const slides = [
  {
    image: assets.header_img,
    title: "New Fashion Trends",
    subtitle: "Discover the latest arrivals",
    button: "Shop Now"
  },
  {
    image: assets.banner,
    title: "Exclusive Collections",
    subtitle: "Upgrade your wardrobe today",
    button: "Explore"
  },
  {
    image: assets.banner1,
    title: "Summer Sale",
    subtitle: "Get up to 50% off",
    button: "Grab Deals"
  }
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-black overflow-hidden">
      <div className="w-full h-full relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <img
                src={slide.image}
                alt={slide.title}
                className="max-h-[80%] object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center text-white text-center md:text-left mt-6 md:mt-0 px-4">
              <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
              <p className="mt-3 text-lg md:text-2xl">{slide.subtitle}</p>
              <button className="mt-5 bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all w-max">
                {slide.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
