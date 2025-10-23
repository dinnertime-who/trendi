import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DialogService } from "@/components/dialog-service/dialog-service";
import { pretendard } from "@/config/font";
import { ReactQueryProvider } from "@/lib/react-query/provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    default: "DITREN - 지금 바로 시작하는 특별한 클래스",
    template: "%s | DITREN - 지금 바로 시작하는 특별한 클래스",
  },
  description: "DITREN - 지금 바로 시작하는 특별한 클래스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={cn(pretendard.className, pretendard.variable, "antialiased")}
      >
        <ReactQueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </ReactQueryProvider>

        <DialogService />
      </body>
    </html>
  );
}
