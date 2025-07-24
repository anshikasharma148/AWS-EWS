"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/effect-fade";

// ✅ Import images correctly from the `public` folder
const images = ["/images/slider3.png", "/images/slider2.png", "/images/slider1.png"];

export default function AuthSlider() {
  return (
    <div className="w-1/2 h-screen hidden md:flex flex-col justify-center items-center bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        effect="fade" // ✅ Adds soft transition effect
        speed={1500}  // ✅ Slower transition for smooth effect
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="w-full h-full flex justify-center items-center">
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-none"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
