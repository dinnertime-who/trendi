"use client";

import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Dumbbell,
  Music,
  Palette,
  Target,
  TrendingUp,
  Video,
} from "lucide-react";
import Link from "next/link";

const categories = [
  { id: 1, name: "실시간 랭킹", icon: TrendingUp, color: "text-red-500" },
  { id: 2, name: "목표 달성", icon: Target, color: "text-blue-500" },
  { id: 3, name: "VOD", icon: Video, color: "text-purple-500" },
  { id: 4, name: "비즈니스", icon: Briefcase, color: "text-green-500" },
  { id: 5, name: "디자인", icon: Palette, color: "text-pink-500" },
  { id: 6, name: "음악", icon: Music, color: "text-indigo-500" },
  { id: 7, name: "운동", icon: Dumbbell, color: "text-orange-500" },
  { id: 8, name: "개발", icon: Code, color: "text-cyan-500" },
  { id: 9, name: "사진", icon: Camera, color: "text-teal-500" },
  { id: 10, name: "외국어", icon: BookOpen, color: "text-yellow-600" },
];

export function CategorySection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="app-container lg:px-6">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-x-2 gap-y-5 max-w-4xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/search?category=${category.id}`}
                className="flex flex-col items-center justify-center bg-white group text-center"
              >
                <div
                  className={`${category.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-8 w-8" />
                </div>
                <span className="mt-2 text-xs font-medium break-keep md:text-sm tracking-[-0.025em]">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
