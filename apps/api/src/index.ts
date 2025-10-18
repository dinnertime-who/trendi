import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      // 모바일 앱 (origin 없음)
      if (!origin) return "*";

      const { ALLOWED_ORIGINS } = env<{ ALLOWED_ORIGINS: string }>(c);
      const allowedOrigins = ALLOWED_ORIGINS?.split(",") || [];

      // 웹 (허용된 출처)
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return allowedOrigins[0];
    },
    credentials: true, // ✅ 필수
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  }),
);

// CSRF는 웹 브라우저만 체크
app.use("*", async (c, next) => {
  const origin = c.req.header("origin");
  const userAgent = c.req.header("user-agent") || "";

  // 모바일 앱인지 확인
  const isMobileApp = !origin || userAgent.includes("Trendi/");

  if (!isMobileApp) {
    // 웹 브라우저면 CSRF 검증
    const { ALLOWED_ORIGINS } = env<{ ALLOWED_ORIGINS: string }>(c);
    const allowedOrigins = ALLOWED_ORIGINS?.split(",") || [];
    return csrf({ origin: allowedOrigins })(c, next);
  }

  return next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT || "8000", 10),
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  },
);
