"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./example-influencers.style.css";
import { Autoplay } from "swiper/modules";

const influencers = [
  {
    id: 1,
    name: "John Doe",
    image: "/img1.png",
  },
  {
    id: 2,
    name: "Jane Doe",
    image: "/img2.png",
  },
];

export function ExampleInfluencers() {
  return (
    <div className="space-y-4">
      <Swiper
        speed={6000}
        loop={true}
        className=""
        modules={[Autoplay]}
        centeredSlides={true}
        slidesPerView={"auto"}
        freeMode={true}
        spaceBetween={10}
        allowTouchMove={false}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
      >
        {[
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
        ].map((influencer, index) => (
          <SwiperSlide key={index} style={{ width: "max-content" }}>
            <Image
              src={influencer.image}
              alt={influencer.name}
              width={230}
              height={300}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        speed={6500}
        loop={true}
        className=""
        modules={[Autoplay]}
        centeredSlides={true}
        slidesPerView={"auto"}
        freeMode={true}
        spaceBetween={10}
        allowTouchMove={false}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
      >
        {[
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
          ...influencers,
        ].map((influencer, index) => (
          <SwiperSlide key={index} style={{ width: "max-content" }}>
            <Image
              src={influencer.image}
              alt={influencer.name}
              width={230}
              height={300}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
