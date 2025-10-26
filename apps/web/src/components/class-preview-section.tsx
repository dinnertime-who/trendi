import { ClassPreviewCard } from "./class-preview-card";

const sampleClasses = [
  {
    id: 1,
    title: "하루 10분으로 평생 편해지는 <성인 ADHD 탈출법>",
    tutor: "김개발",
    thumbnailUrl: "https://placehold.co/300x400/6366F1/ffffff/png?text=Python",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 2,
    title: "처음 시작하는 일러스트레이터 디자인",
    tutor: "박디자인",
    thumbnailUrl: "https://placehold.co/300x400/EC4899/ffffff/png?text=Design",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 3,
    title: "직장인을 위한 영어회화 마스터",
    tutor: "이영어",
    thumbnailUrl: "https://placehold.co/300x400/10B981/ffffff/png?text=English",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: 4,
    title: "홈트레이닝으로 시작하는 필라테스",
    tutor: "최운동",
    thumbnailUrl: "https://placehold.co/300x400/F59E0B/ffffff/png?text=Pilates",
    videoUrl:
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];

export function ClassPreviewSection() {
  return (
    <section className="py-12">
      <div className="app-container px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">이번 주 트렌디 PICK</h2>
          <div className="text-sm text-gray-500">
            예비 인플루언서들의 화려한 변신, 트렌디 프리미엄 패키지
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {sampleClasses.map((classItem) => (
            <ClassPreviewCard
              key={classItem.id}
              href={`/search?id=${classItem.id}`}
              title={classItem.title}
              tutor={classItem.tutor}
              thumbnailUrl={classItem.thumbnailUrl}
              videoUrl={classItem.videoUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
