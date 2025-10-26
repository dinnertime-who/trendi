"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

type Props = {
  title: string;
  tutor: string;
  thumbnailUrl: string;
  videoUrl: string;
  href: React.ComponentProps<typeof Link>["href"];
};

export function ClassPreviewCard({
  title,
  tutor,
  thumbnailUrl,
  videoUrl,
  href,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (!videoRef.current) return;

    videoRef.current.style.display = "block";
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    if (!videoRef.current) return;

    videoRef.current.style.display = "none";
    videoRef.current.pause();
  };

  return (
    <Link
      href={href}
      className="group relative rounded-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        <Image src={thumbnailUrl} alt={title} width={300} height={400} />
      </div>

      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute top-0 left-0 border-0 right-0 w-full h-full object-cover hidden"
        controls={false}
        muted
        loop
        playsInline
      >
        <track kind="captions" src={videoUrl} />
      </video>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-800/50 to-transparent text-white">
        <h3 className="text-xs sm:text-body font-semibold text-balance break-keep line-clamp-2">
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm">{tutor}</p>
      </div>
    </Link>
  );
}
