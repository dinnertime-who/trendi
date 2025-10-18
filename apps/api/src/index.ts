import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", async (c, next) => {
  const { ALLOWED_ORIGINS } = env<{ ALLOWED_ORIGINS: string | undefined }>(c);
  console.log("ALLOWED_ORIGINS", ALLOWED_ORIGINS);
  const allowedOrigins = ALLOWED_ORIGINS?.split(",") || [];
  const corsMiddlewareHandler = cors({
    origin: allowedOrigins,
  });
  return corsMiddlewareHandler(c, next);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/test", (c) => {
  return c.json({ env: process.env });
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
