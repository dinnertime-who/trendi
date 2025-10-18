import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { test } from "../services/test.service.js";

const testRoute = new Hono().get(
  "/",
  zValidator(
    "query",
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
  async (c) => {
    const result = await test();
    return c.json({ message: result }, 200);
  },
);

export { testRoute };
export type TestRouteType = typeof testRoute;
