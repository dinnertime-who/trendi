import { CategorySection } from "@/components/category-section";
import { ClassListSection } from "@/components/class-list-section";
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategorySection />
        <ClassListSection />
      </main>
    </div>
  );
}
