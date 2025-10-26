"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { Autoplay } from "swiper/modules";

type Href = React.ComponentProps<typeof Link>["href"];

const banners: {
  id: string;
  title: string;
  image: string;
  href: Href;
}[] = [
  {
    id: "1",
    title: "Main Middle Banner 1",
    image:
      "https://placehold.co/1250x180/6366F1/ffffff/png?text=Main+Middle+Banner+1",
    href: "/sign-in" as Href,
  },
  {
    id: "2",
    title: "Main Middle Banner 2",
    image:
      "https://placehold.co/1250x180/6366F1/ffffff/png?text=Main+Middle+Banner+2",
    href: "/sign-in" as Href,
  },
];

export function MainMiddleBanner() {
  return (
    <section className="py-6 lg:py-12">
      <div className="app-container px-4 ">
        <Swiper
          modules={[Autoplay]}
          speed={500}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          className="rounded-xl overflow-hidden"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="">
              <Link href={banner.href}>
                <Image
                  src={banner.image}
                  alt={banner.title}
                  width={1250}
                  height={180}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
