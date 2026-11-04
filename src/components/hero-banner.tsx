"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/hero.jpg",
    title: "Production Cyclorama & Sound Stage",
    description: "Equipped with overhead grid, acoustic treatment, and professional lighting.",
  },
  {
    id: 2,
    image: "/hero2.jpg",
    title: "Creative Art & Photography Studio",
    description: "High ceilings, natural daylight windows, and adaptable set layouts.",
  },
  {
    id: 3,
    image: "/hero3.jpg",
    title: "Podcast Lounge & Audio Suite",
    description: "Tuned acoustics, broadcast microphones, and multi-cam podcast setup.",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay slideshow every 5 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <section className="relative overflow-hidden bg-[#f8f9fa] dark:bg-[#111113] py-12 md:py-16 lg:py-24 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-900 border border-amber-300 dark:bg-[#2a2213] dark:text-[#f5a623] dark:border-[#59431b] mb-6 shadow-sm transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Peer-to-peer creative spaces
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-zinc-950 dark:text-white tracking-tight leading-[1.08] mb-6 transition-colors">
              Book the room where your next idea gets made.
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg transition-colors">
              Photo cycs, sound stages, podcast lounges and recording suites, listed by the people who run them.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="/studios"
                className="w-full sm:w-auto text-center px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                Explore Studios
              </Link>
              <Link
                href="#host-space"
                className="w-full sm:w-auto text-center px-7 py-3.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 dark:bg-[#1a1a1e] dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
              >
                Host Your Space
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Image Slideshow */}
          <div
            className="lg:col-span-7 flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Image Frame */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-zinc-200 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800/80 shadow-2xl">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 700px"
                      className="object-cover object-center"
                    />
                    {/* Subtle gradient vignette to blend captions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                    
                    {/* Slide Caption Overlay */}
                    <div className="absolute bottom-5 left-6 right-6 text-white z-20">
                      <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-1 drop-shadow-sm">
                        Hero slide {index + 1} of {totalSlides}: Studio Photo
                      </p>
                      <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
                        {slide.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-200 line-clamp-1 drop-shadow-sm">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Controls Bar */}
            <div className="flex items-center justify-between mt-6 px-2">
              {/* Pagination Indicators */}
              <div className="flex items-center gap-2">
                {slides.map((_, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 transition-all duration-300 rounded-full ${
                        isActive
                          ? "w-8 bg-amber-500"
                          : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700/80 dark:hover:bg-zinc-500"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  );
                })}
              </div>

              {/* Navigation Arrow Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-[#16161a] text-zinc-700 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition active:scale-95 focus:outline-none shadow-sm"
                  aria-label="Previous slide"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-[#16161a] text-zinc-700 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition active:scale-95 focus:outline-none shadow-sm"
                  aria-label="Next slide"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
