import { cors as corsMiddleware } from "hono/cors";
import { getEnv } from "../../config/env.js";

export const cors = corsMiddleware({
  origin: (origin, c) => {
    // 모바일 앱 (origin 없음)
    if (!origin) return "*";

    const allowedOrigins = getEnv(c).ALLOWED_ORIGINS.split(",") || [];

    // 웹 (허용된 출처)
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return allowedOrigins[0];
  },
  credentials: true, // ✅ 필수
  allowHeaders: ["Authorization", "Content-Type"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
});
