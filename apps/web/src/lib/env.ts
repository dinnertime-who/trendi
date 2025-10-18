import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_BASE_URL: z.url(),

  NEXT_PUBLIC_IMAGE_DOMAIN: z.string(),
});

const serverEnvSchema = z.object({});

export function validateEnv() {
  publicEnvSchema.parse(process.env);
  serverEnvSchema.parse(process.env);
}

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_IMAGE_DOMAIN: process.env.NEXT_PUBLIC_IMAGE_DOMAIN,
});

export const serverEnv = serverEnvSchema.parse(process.env);
