export const configuration = () => {
  const {
    DATABASE_URL,
    REDIS_URL,
    ALLOWED_ORIGINS,
    PORT,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,
  } = process.env;

  if (
    !DATABASE_URL ||
    !REDIS_URL ||
    !ALLOWED_ORIGINS ||
    !PORT ||
    !JWT_SECRET ||
    !JWT_EXPIRES_IN ||
    !REFRESH_TOKEN_SECRET ||
    !REFRESH_TOKEN_EXPIRES_IN
  ) {
    console.error("DATABASE_URL=", DATABASE_URL);
    console.error("REDIS_URL=", REDIS_URL);
    console.error("ALLOWED_ORIGINS=", ALLOWED_ORIGINS);
    console.error("PORT=", PORT);
    console.error("JWT_SECRET=", JWT_SECRET ? "[HIDDEN]" : undefined);
    console.error("JWT_EXPIRES_IN=", JWT_EXPIRES_IN);
    console.error(
      "REFRESH_TOKEN_SECRET=",
      REFRESH_TOKEN_SECRET ? "[HIDDEN]" : undefined,
    );
    console.error("REFRESH_TOKEN_EXPIRES_IN=", REFRESH_TOKEN_EXPIRES_IN);

    throw new Error("Missing environment variables");
  }

  return {
    databaseUrl: DATABASE_URL,
    redisUrl: REDIS_URL,
    allowedOrigins: ALLOWED_ORIGINS.split(","),
    port: Number(PORT || "") || 8000,
    jwt: {
      secret: JWT_SECRET,
      expiresIn: Number(JWT_EXPIRES_IN) || 900, // 기본 15분 (900초)
    },
    refreshToken: {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: Number(REFRESH_TOKEN_EXPIRES_IN) || 604800, // 기본 7일 (604800초)
    },
  };
};

export type Configuration = ReturnType<typeof configuration>;
