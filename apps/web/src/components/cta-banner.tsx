"use client";

import Image from "next/image";

interface CtaBannerProps {
  backgroundImage?: string;
  title?: string[];
  subtitle?: string[];
}

export function CtaBanner({
  backgroundImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000",
  title = [
    "사업의 필수가 되어버린 인플루언서 계정",
    "이제 누구나 쉽게 진입할 수 있습니다",
  ],
  subtitle = [
    "자영업, 모델, 쇼핑몰, 부업 어떠한 분야도",
    "전문가의 꿈꾼한 계정 분석과 컨설팅 후",
    "최고의 매출을 약속합니다",
  ],
}: CtaBannerProps) {
  return (
    <section className="relative w-full h-[500px] lg:h-[600px] overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Office background"
          fill
          className="object-cover"
          priority={false}
          sizes="100vw"
        />
        {/* 다크 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative h-full flex items-center justify-center">
        <div className="app-container text-center space-y-8 px-4">
          {/* 메인 제목 */}
          <div className="space-y-2">
            {title.map((line, index) => (
              <h2
                key={index}
                className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight"
              >
                {line}
              </h2>
            ))}
          </div>

          {/* 서브 텍스트 */}
          <div className="space-y-3 mt-8">
            {subtitle.map((line, index) => (
              <p
                key={index}
                className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
