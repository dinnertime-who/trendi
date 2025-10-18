import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";

export const notoSansKR = Noto_Sans_KR({
  display: "swap",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-kr",
});

export const pretendard = localFont({
  src: "./pretendard/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
