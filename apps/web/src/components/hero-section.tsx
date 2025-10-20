"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    id: 1,
    title: "2025년 새해 특별 할인",
    description: "지금 바로 시작하는 나만의 클래스",
    bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
    image: "https://placehold.co/1200x400/4F46E5/ffffff/png?text=New+Year+Sale",
  },
  {
    id: 2,
    title: "인기 클래스 모음",
    description: "수강생들이 선택한 베스트 클래스",
    bgColor: "bg-gradient-to-r from-pink-500 to-rose-600",
    image: "https://placehold.co/1200x400/EC4899/ffffff/png?text=Best+Classes",
  },
  {
    id: 3,
    title: "VOD로 언제 어디서나",
    description: "내 시간에 맞춰 자유롭게 학습하세요",
    bgColor: "bg-gradient-to-r from-green-500 to-teal-600",
    image: "https://placehold.co/1200x400/10B981/ffffff/png?text=VOD+Classes",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      {/* 슬라이드 */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className={`h-full ${banner.bgColor} flex items-center justify-center`}
            >
              <div className="container mx-auto px-4 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl mb-8">{banner.description}</p>
                <Button size="lg" variant="secondary">
                  클래스 둘러보기
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </section>
  );
}
