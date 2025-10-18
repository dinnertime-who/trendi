import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl sm:text-3xl font-semibold text-gray-800">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
