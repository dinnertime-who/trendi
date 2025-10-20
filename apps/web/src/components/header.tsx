"use client";

import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-primary">TRENDI</div>
        </Link>

        {/* 네비게이션 메뉴 - 데스크톱 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/search?type=vod"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            VOD
          </Link>
          <Link
            href="/search?type=class"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            온/오프라인 클래스
          </Link>
          <Link
            href="/search?type=membership"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            멤버십
          </Link>
          <Link
            href="/search?type=ebook"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            전자책
          </Link>
          <Link
            href="/search?type=studio"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            TRENDI 스튜디오
          </Link>
          <Link
            href="/search?type=business"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            기업교육
          </Link>
        </nav>

        {/* 검색바 */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="배우고 싶은 것을 검색해보세요"
              className="pl-10"
            />
          </div>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            로그인
          </Button>
          <Button size="sm" className="hidden md:flex">
            회원가입
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
