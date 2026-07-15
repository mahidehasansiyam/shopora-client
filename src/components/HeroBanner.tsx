"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    title: "Summer Sale — Up to 50% Off",
    subtitle:
      "Refresh your wardrobe with the season's hottest trends. Limited time only.",
    cta: "Shop Now",
    href: "/explore",
    bgClass: "from-violet-700 to-purple-900",
  },
  {
    title: "New Arrivals Are Here",
    subtitle:
      "Discover the latest drops in electronics, fashion, and home essentials.",
    cta: "Explore New",
    href: "/explore",
    bgClass: "from-indigo-700 to-blue-900",
  },
  {
    title: "Free Shipping on Orders Over $50",
    subtitle:
      "Shop your favorites and enjoy complimentary delivery. No code needed.",
    cta: "Start Shopping",
    href: "/explore",
    bgClass: "from-purple-800 to-pink-900",
  },
];

export default function HeroBanner() {
  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      loop
      className="[&_.swiper-pagination-bullet-active]:bg-white [&_.swiper-button-next]:text-white [&_.swiper-button-prev]:text-white"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.title}>
          <div
            className={`flex min-h-[70vh] items-center justify-center bg-gradient-to-br ${slide.bgClass} px-4`}
          >
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg text-white/80 sm:text-xl">
                {slide.subtitle}
              </p>
              <Link
                href={slide.href}
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-purple-900 transition-opacity hover:opacity-90"
              >
                {slide.cta} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
