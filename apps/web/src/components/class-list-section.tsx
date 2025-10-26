"use client";

import { ClassCard } from "./resuable/class-card";

// 샘플 데이터
const sampleClasses = [
  {
    id: 1,
    title: "하루 10분으로 평생 편해지는 <성인 ADHD 탈출법>",
    tutor: "김개발",
    salePrice: 89000,
    originalPrice: 120000,
    rating: 4.9,
    reviewCount: 1234,
    likeCount: 567,
    thumbnail: "https://placehold.co/400x300/6366F1/ffffff/png?text=Python",
    isOnline: true,
    discountRate: 26,
  },
  {
    id: 2,
    title: "처음 시작하는 일러스트레이터 디자인",
    tutor: "박디자인",
    salePrice: 75000,
    originalPrice: 100000,
    rating: 4.8,
    reviewCount: 892,
    likeCount: 423,
    thumbnail: "https://placehold.co/400x300/EC4899/ffffff/png?text=Design",
    isOnline: true,
    discountRate: 25,
  },
  {
    id: 3,
    title: "직장인을 위한 영어회화 마스터",
    tutor: "이영어",
    salePrice: 95000,
    originalPrice: 130000,
    rating: 4.7,
    reviewCount: 756,
    likeCount: 389,
    thumbnail: "https://placehold.co/400x300/10B981/ffffff/png?text=English",
    isOnline: false,
    discountRate: 27,
  },
  {
    id: 4,
    title: "홈트레이닝으로 시작하는 필라테스",
    tutor: "최운동",
    salePrice: 68000,
    originalPrice: 90000,
    rating: 4.9,
    reviewCount: 1045,
    likeCount: 612,
    thumbnail: "https://placehold.co/400x300/F59E0B/ffffff/png?text=Pilates",
    isOnline: true,
    discountRate: 24,
  },
];

export function ClassListSection() {
  return (
    <section className="py-12">
      <div className="app-container px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">주간 BEST 인기 클래스 20</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {sampleClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              href={`/service/${classItem.id.toString()}`}
              category={"VOD"}
              title={classItem.title}
              tutor={classItem.tutor}
              discountRate={classItem.discountRate}
              originalPrice={classItem.originalPrice}
              salePrice={classItem.salePrice}
              reviewCount={classItem.reviewCount}
              reviewRating={classItem.rating}
              thumbnailUrl={classItem.thumbnail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
