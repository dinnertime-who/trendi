"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러를 로깅 서비스에 보낼 수 있습니다
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-9xl font-bold text-primary">오류</h1>
        <h2 className="mt-4 text-xl sm:text-3xl font-semibold text-gray-800">
          문제가 발생했습니다
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-600">
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        {error.digest && (
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            오류 코드: {error.digest}
          </p>
        )}
        <div className="mt-8 flex gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="rounded-md bg-black px-4 py-2 text-sm sm:text-base font-medium text-white hover:bg-gray-800"
          >
            다시 시도
          </Button>
          <Button variant="outline" asChild>
            <a
              href="/"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm sm:text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              홈으로 돌아가기
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
