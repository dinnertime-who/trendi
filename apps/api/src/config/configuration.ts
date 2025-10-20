export const configuration = () => {
  const { DATABASE_URL, REDIS_URL, ALLOWED_ORIGINS, PORT } = process.env;

  if (!DATABASE_URL || !REDIS_URL || !ALLOWED_ORIGINS || !PORT) {
    console.error("DATABASE_URL=", DATABASE_URL);
    console.error("REDIS_URL=", REDIS_URL);
    console.error("ALLOWED_ORIGINS=", ALLOWED_ORIGINS);
    console.error("PORT=", PORT);

    throw new Error("Missing environment variables");
  }

  return {
    databaseUrl: DATABASE_URL,
    redisUrl: REDIS_URL,
    allowedOrigins: ALLOWED_ORIGINS.split(","),
    port: Number(PORT || "") || 8000,
  };
};

export type Configuration = ReturnType<typeof configuration>;
