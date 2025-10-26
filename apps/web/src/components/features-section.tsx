"use client";

import {
  FileCheck,
  Heart,
  DollarSign,
  Shield,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "1",
    icon: FileCheck,
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-100",
    title: "컨설팅 신청하고",
    description:
      "각 분야 전문가들에게 1:1 컨설팅을 받을 수 있어요",
  },
  {
    id: "2",
    icon: Heart,
    iconColor: "text-pink-600",
    iconBgColor: "bg-pink-100",
    title: "SNS 계정 키우고",
    description:
      "누구나 쉽게 인스타그램, 유튜브 등 3개월이면 충분해요",
  },
  {
    id: "3",
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-100",
    title: "사업, 협찬 성공까지",
    description:
      "나의 꿈과 취미 등 경제 활동을 진행할 수 있어요",
  },
  {
    id: "4",
    icon: Shield,
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-100",
    title: "누구나 안전하게",
    description:
      "개정 보안 전문가들 통해 안전하게 운영할 수 있어요",
  },
];

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6">
      {/* 아이콘 영역 */}
      <div
        className={`${feature.iconBgColor} rounded-2xl p-8 transition-transform hover:scale-105`}
      >
        <Icon className={`${feature.iconColor} size-16`} strokeWidth={1.5} />
      </div>

      {/* 텍스트 영역 */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="app-container">
        {/* 선택적: 섹션 제목 */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            트렌디와 함께하는 방법
          </h2>
          <p className="mt-4 text-gray-600">
            전문가와 함께 당신의 꿈을 실현하세요
          </p>
        </div>

        {/* 특징 카드 그리드 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
