import { CategorySection } from "@/components/category-section";
import { ClassListSection } from "@/components/class-list-section";
import { ClassPreviewSection } from "@/components/class-preview-section";
import { CtaBanner } from "@/components/cta-banner";
import { ExampleInfluencers } from "@/components/example-influencers";
import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { MainMiddleBanner } from "@/components/main-middle-banner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <ClassListSection />
        <ClassListSection />

        <MainMiddleBanner />

        <ClassPreviewSection />

        <div className="app-container text-3xl font-bold text-center flex flex-col gap-4 py-12">
          <div>인스타그램 & 블로그 & 유튜브까지!</div>
          <div>나만의 SNS 채널로 팔로워와 수익을 동시에 키워보세요</div>
        </div>

        <ExampleInfluencers />

        {/* <HeroBanner /> */}
        <FeaturesSection />
        <CtaBanner />
      </main>
    </div>
  );
}
