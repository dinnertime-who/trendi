import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { cors } from "./middlewares/security/cors.js";
import { csrf } from "./middlewares/security/csrf.js";
import { testRoute } from "./routes/test.route.js";

const app = new Hono();

// CORS 적용
app.use("*", cors);
// CSRF 적용
app.use("*", csrf);
// 보안 헤더 적용
app.use("*", secureHeaders());

app.route("/test", testRoute);

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT || "8000", 10),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
