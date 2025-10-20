import { Menu } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/resuable/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-(--header-height) w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="app-container flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-x-4 w-full">
          <Logo />
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* 우측 액션 버튼 */}
        <div className="flex items-center">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden md:flex font-semibold",
            )}
          >
            로그인
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
