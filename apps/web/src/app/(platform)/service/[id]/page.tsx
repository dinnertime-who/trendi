import { Award, Clock, Heart, Star, Users } from "lucide-react";
import Image from "next/image";
import { ScrollNavigation } from "@/components/scroll-navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 목업 데이터 (실제로는 API에서 가져옴)
const mockServiceData = {
  id: "1",
  title: "하루 10분으로 평생 편해지는 성인 ADHD 탈출법",
  instructor: {
    name: "멘탈탄탄",
    title: "정신건강의학 전문의",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor",
    bio: "고려대 의대 졸업 및 석사",
    subscribers: "4만+ 구독자",
  },
  thumbnail:
    "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800",
  rating: 5.0,
  reviewCount: 20,
  wishlistCount: 371,
  price: {
    original: 1400000,
    discounted: 252000,
    duration: "12개월",
  },
  badge: "얼리버드",
  challenge: "6주 환급 챌린지",
  description: `
    이 강의는 성인 ADHD로 고민하는 분들을 위한 실용적인 해결책을 제시합니다.

    정신건강의학 전문의가 직접 알려드리는 체계적인 방법으로
    하루 10분만 투자하면 평생 편안한 삶을 살 수 있습니다.
  `,
  curriculum: [
    { id: 1, title: "ADHD 이해하기", duration: "15분", isPreview: true },
    { id: 2, title: "집중력 향상 기법", duration: "20분", isPreview: false },
    { id: 3, title: "시간 관리 전략", duration: "18분", isPreview: false },
    { id: 4, title: "감정 조절 방법", duration: "22분", isPreview: false },
    { id: 5, title: "실생활 적용 팁", duration: "25분", isPreview: false },
  ],
  reviews: [
    {
      id: 1,
      author: "김*진",
      rating: 5.0,
      date: "2025-01-15",
      content:
        "정말 도움이 많이 되었습니다. 전문의의 설명이 이해하기 쉽고 실용적이에요.",
    },
    {
      id: 2,
      author: "이*수",
      rating: 5.0,
      date: "2025-01-10",
      content: "체계적인 커리큘럼과 친절한 설명 감사합니다!",
    },
  ],
  features: [
    { icon: Clock, label: "총 5시간 분량" },
    { icon: Users, label: "1,234명 수강" },
    { icon: Award, label: "수료증 제공" },
  ],
};

export default async function ServicePage({ params }: PageProps) {
  const { id: _id } = await params;
  // TODO: API에서 실제 데이터 가져오기 (const service = await fetchService(id))
  const service = mockServiceData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <section className="bg-white border-b">
        <div className="app-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 이미지 */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                <Image
                  src={service.thumbnail}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* 제목 및 기본 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="destructive">{service.badge}</Badge>
                  <Badge variant="secondary">{service.challenge}</Badge>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {service.title}
                </h1>

                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <div className="flex items-center gap-1">
                    <Avatar className="size-8">
                      <AvatarImage
                        src={service.instructor.avatar}
                        alt={service.instructor.name}
                      />
                      <AvatarFallback>
                        {service.instructor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {service.instructor.name}
                    </span>
                    <span className="text-gray-500">
                      · {service.instructor.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating}</span>
                    <span className="text-gray-500">
                      ({service.reviewCount}개 평가)
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-500">
                    <Heart className="size-4" />
                    <span>{service.wishlistCount}명이 찜</span>
                  </div>
                </div>

                {/* 특징 */}
                <div className="flex items-center gap-6 pt-4">
                  {service.features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <Icon className="size-4" />
                        <span>{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 오른쪽: 가격 카드 (sticky) */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 line-through">
                        ₩{service.price.original.toLocaleString()}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ₩{service.price.discounted.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {service.price.duration}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 font-medium mt-1">
                        {Math.round(
                          ((service.price.original - service.price.discounted) /
                            service.price.original) *
                            100,
                        )}
                        % 할인
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      지금 수강하기
                    </Button>

                    <Button className="w-full" variant="outline" size="lg">
                      <Heart className="size-4" />
                      찜하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 콘텐츠 섹션 */}
      <section className="py-8">
        <div className="app-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* 스크롤 네비게이션 */}
              <ScrollNavigation
                items={[
                  { id: "intro", label: "클래스 소개" },
                  { id: "curriculum", label: "커리큘럼" },
                  { id: "reviews", label: "리뷰" },
                  { id: "instructor", label: "강사 소개" },
                ]}
              />

              {/* 클래스 소개 */}
              <Card id="intro" className="mb-8 scroll-mt-20">
                <CardHeader>
                  <CardTitle>클래스 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 커리큘럼 */}
              <Card id="curriculum" className="mb-8 scroll-mt-20">
                <CardHeader>
                  <CardTitle>커리큘럼</CardTitle>
                  <CardDescription>
                    총 {service.curriculum.length}개 강의
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {service.curriculum.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-full bg-gray-100 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            {item.isPreview && (
                              <Badge
                                variant="secondary"
                                className="mt-1 text-xs"
                              >
                                미리보기 가능
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 리뷰 */}
              <Card id="reviews" className="mb-8 scroll-mt-20">
                <CardHeader>
                  <CardTitle>수강생 리뷰</CardTitle>
                  <CardDescription>
                    {service.reviewCount}개의 리뷰 · 평균 {service.rating}점
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {service.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-0"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="size-10">
                            <AvatarFallback>{review.author[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{review.author}</div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                                <span>{review.rating}</span>
                              </div>
                              <span className="text-gray-500">
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 강사 정보 */}
              <Card id="instructor" className="scroll-mt-20">
                <CardHeader>
                  <CardTitle>강사 소개</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="size-16">
                      <AvatarImage
                        src={service.instructor.avatar}
                        alt={service.instructor.name}
                      />
                      <AvatarFallback>
                        {service.instructor.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">
                        {service.instructor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {service.instructor.title}
                      </p>
                      <p className="text-gray-700">{service.instructor.bio}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        유튜브 {service.instructor.subscribers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 오른쪽 빈 공간 (가격 카드와 정렬) */}
            <div className="lg:col-span-1" />
          </div>
        </div>
      </section>
    </div>
  );
}
