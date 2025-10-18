import type { Context } from "hono";
import { env } from "hono/adapter";
import { z } from "zod";

const envSchema = z.object({
  ALLOWED_ORIGINS: z.string(),
});

type Env = z.infer<typeof envSchema>;

let loadedEnv: Env | null = null;

export const getEnv = (c: Context) => {
  if (!loadedEnv) {
    loadedEnv = envSchema.parse(env<z.infer<typeof envSchema>>(c));
  }
  return loadedEnv;
};
