import Link from "next/link";
import { ClassCard } from "@/components/resuable/class-card";

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
    id: 3,
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
    id: 4,
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
];

export default function SearchPage() {
  return (
    <div>
      <section className="py-12">
        <div className="app-container px-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">주간 BEST 인기 클래스 20</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {[
              ...sampleClasses,
              ...sampleClasses,
              ...sampleClasses,
              ...sampleClasses,
              ...sampleClasses,
              ...sampleClasses,
            ].map((classItem, index) => (
              <ClassCard
                key={index}
                href={
                  `/service/${classItem.id.toString()}` as React.ComponentProps<
                    typeof Link
                  >["href"]
                }
                category={"VOD"}
                title={classItem.title}
                tutor={classItem.tutor}
                originalPrice={classItem.originalPrice}
                salePrice={classItem.salePrice}
                discountRate={classItem.discountRate}
                reviewCount={classItem.reviewCount}
                reviewRating={classItem.rating}
                thumbnailUrl={classItem.thumbnail}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
