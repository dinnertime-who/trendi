import { csrf as csrfMiddleware } from "hono/csrf";
import type { MiddlewareHandler } from "hono/types";
import { getEnv } from "../../config/env.js";

export const csrf: MiddlewareHandler = async (c, next) => {
  const origin = c.req.header("origin");
  const userAgent = c.req.header("user-agent") || "";

  // 모바일 앱인지 확인
  const isMobileApp = !origin || userAgent.includes("Trendi/");

  if (!isMobileApp) {
    // 웹 브라우저면 CSRF 검증
    const allowedOrigins = getEnv(c).ALLOWED_ORIGINS.split(",") || [];
    return csrfMiddleware({ origin: allowedOrigins })(c, next);
  }

  return next();
};
