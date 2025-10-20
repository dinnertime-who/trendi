"use client";

import { ClassCard } from "./class-card";

// 샘플 데이터
const sampleClasses = [
  {
    id: 1,
    title: "왕초보도 쉽게 배우는 파이썬 프로그래밍",
    tutor: "김개발",
    price: 89000,
    originalPrice: 120000,
    rating: 4.9,
    reviewCount: 1234,
    likeCount: 567,
    thumbnail: "https://placehold.co/400x300/6366F1/ffffff/png?text=Python",
    isOnline: true,
    discount: 26,
  },
  {
    id: 2,
    title: "처음 시작하는 일러스트레이터 디자인",
    tutor: "박디자인",
    price: 75000,
    originalPrice: 100000,
    rating: 4.8,
    reviewCount: 892,
    likeCount: 423,
    thumbnail: "https://placehold.co/400x300/EC4899/ffffff/png?text=Design",
    isOnline: true,
    discount: 25,
  },
  {
    id: 3,
    title: "직장인을 위한 영어회화 마스터",
    tutor: "이영어",
    price: 95000,
    originalPrice: 130000,
    rating: 4.7,
    reviewCount: 756,
    likeCount: 389,
    thumbnail: "https://placehold.co/400x300/10B981/ffffff/png?text=English",
    isOnline: false,
    discount: 27,
  },
  {
    id: 4,
    title: "홈트레이닝으로 시작하는 필라테스",
    tutor: "최운동",
    price: 68000,
    originalPrice: 90000,
    rating: 4.9,
    reviewCount: 1045,
    likeCount: 612,
    thumbnail: "https://placehold.co/400x300/F59E0B/ffffff/png?text=Pilates",
    isOnline: true,
    discount: 24,
  },
  {
    id: 5,
    title: "유튜브 영상 편집 A to Z",
    tutor: "정편집",
    price: 79000,
    originalPrice: 110000,
    rating: 4.8,
    reviewCount: 923,
    likeCount: 478,
    thumbnail: "https://placehold.co/400x300/8B5CF6/ffffff/png?text=Video",
    isOnline: true,
    discount: 28,
  },
  {
    id: 6,
    title: "감성 사진 촬영과 보정 기초",
    tutor: "강사진",
    price: 85000,
    originalPrice: 115000,
    rating: 4.7,
    reviewCount: 667,
    likeCount: 334,
    thumbnail: "https://placehold.co/400x300/06B6D4/ffffff/png?text=Photo",
    isOnline: false,
    discount: 26,
  },
  {
    id: 7,
    title: "초보자를 위한 기타 레슨",
    tutor: "송음악",
    price: 72000,
    originalPrice: 95000,
    rating: 4.9,
    reviewCount: 834,
    likeCount: 456,
    thumbnail: "https://placehold.co/400x300/EF4444/ffffff/png?text=Guitar",
    isOnline: true,
    discount: 24,
  },
  {
    id: 8,
    title: "직장인 재테크 실전 전략",
    tutor: "윤재테크",
    price: 99000,
    originalPrice: 140000,
    rating: 4.8,
    reviewCount: 1156,
    likeCount: 723,
    thumbnail: "https://placehold.co/400x300/14B8A6/ffffff/png?text=Finance",
    isOnline: true,
    discount: 29,
  },
];

export function ClassListSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">주간 BEST 인기 클래스 20</h2>
          <p className="text-muted-foreground">
            수강생들이 가장 많이 선택한 베스트 클래스를 만나보세요
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleClasses.map((classItem) => (
            <ClassCard key={classItem.id} {...classItem} />
          ))}
        </div>
      </div>
    </section>
  );
}
