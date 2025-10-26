"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface InfluencerProfile {
  id: string;
  name: string;
  image: string;
  tags: string[];
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

const influencersData = [
  {
    id: "1",
    name: "메다스",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Midas",
    tags: ["댄스", "보컬그룹에", "AI"],
  },
  {
    id: "2",
    name: "중스",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jungs",
    tags: ["PRD 제작", "B급 마케터"],
  },
  {
    id: "3",
    name: "오자은",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=OJaEun",
    tags: ["웹개발자", "디자인 다재다능"],
  },
  {
    id: "4",
    name: "루비",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
    tags: ["인플루언서", "SNS 다재다능"],
  },
  {
    id: "5",
    name: "베베트",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bebete",
    tags: ["콘텐츠 마케터", "힙 영업자"],
  },
  {
    id: "6",
    name: "제이드",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jade",
    tags: ["팀 리더자", "OE 멘사녀"],
  },
  {
    id: "7",
    name: "프래디",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Freddy",
    tags: ["토요,크리에", "카페이야이야"],
  },
];

// 원형 배치를 위한 위치 계산 함수
function calculateCircularPosition(
  index: number,
  total: number,
  radius: number = 40,
): { top: string; left: string } {
  // 시작 각도를 -90도로 설정 (12시 방향부터 시작)
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  // 중심점 (50%, 50%)에서 반지름만큼 떨어진 위치 계산
  const x = 50 + radius * Math.cos(angle);
  const y = 50 + radius * Math.sin(angle);
  return { top: `${y}%`, left: `${x}%` };
}

// 원형 배치된 인플루언서 배열 생성
const influencers: InfluencerProfile[] = influencersData.map((data, index) => ({
  ...data,
  position: calculateCircularPosition(index, influencersData.length),
}));

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#2B2F3A] py-16 lg:py-24">
      <div className="app-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="z-10 space-y-6">
            <p className="text-sm text-gray-400 lg:text-base">
              업계 최고의 전문가들이 컨설팅하고 있어요
            </p>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white lg:text-5xl">
                학생, 주부, 직장인 누구나
              </h1>
              <h2 className="text-3xl font-bold text-white lg:text-5xl">
                최고의 인플루언서가 될 수 있어요
              </h2>
            </div>
            <Button
              asChild
              className="bg-[#84EF6B] text-gray-900 hover:bg-[#6FD955] px-8 py-6 text-base font-semibold"
              size="lg"
            >
              <Link href="/sign-in">트렌디 시작하기</Link>
            </Button>
          </div>

          {/* 오른쪽: 인플루언서 카드들 */}
          <div className="relative hidden h-[400px] lg:block">
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={influencer.position}
              >
                <div className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-transform hover:scale-105">
                  <Avatar className="size-16">
                    <AvatarImage src={influencer.image} alt={influencer.name} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      {influencer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">
                      {influencer.name}
                    </p>
                    <div className="mt-1 flex flex-wrap justify-center gap-1">
                      {influencer.tags.map((tag, index) => (
                        <span key={index} className="text-xs text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 모바일: 인플루언서 카드들 (그리드 형태) */}
          <div className="grid grid-cols-3 gap-4 lg:hidden">
            {influencers.slice(0, 6).map((influencer) => (
              <div
                key={influencer.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
              >
                <Avatar className="size-12">
                  <AvatarImage src={influencer.image} alt={influencer.name} />
                  <AvatarFallback className="bg-gray-600 text-white">
                    {influencer.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">
                    {influencer.name}
                  </p>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {influencer.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-[10px] text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
