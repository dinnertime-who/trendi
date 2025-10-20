"use client";

import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ClassCardProps {
  id: number;
  title: string;
  tutor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  likeCount: number;
  thumbnail: string;
  isOnline?: boolean;
  discount?: number;
}

export function ClassCard({
  title,
  tutor,
  price,
  originalPrice,
  rating,
  reviewCount,
  likeCount,
  thumbnail,
  isOnline = true,
  discount,
}: ClassCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            {discount}% 할인
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          {/* 온/오프라인 뱃지 */}
          <Badge variant="outline" className="text-xs">
            {isOnline ? "온라인" : "오프라인"}
          </Badge>

          {/* 클래스 제목 */}
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* 튜터 이름 */}
          <p className="text-xs text-muted-foreground">{tutor}</p>

          {/* 평점 및 리뷰 */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center text-yellow-500">
              <Star className="h-3 w-3 fill-current" />
              <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">({reviewCount})</span>
            <span className="text-muted-foreground">♥ {likeCount}</span>
          </div>

          {/* 가격 */}
          <div className="flex items-center space-x-2">
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice.toLocaleString()}원
              </span>
            )}
            <span className="text-lg font-bold">
              {price.toLocaleString()}원
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
