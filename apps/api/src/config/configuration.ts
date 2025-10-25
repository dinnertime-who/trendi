export const configuration = () => {
  const {
    DATABASE_URL, // 데이터베이스 연결 URL
    REDIS_URL, // Redis 연결 URL
    ALLOWED_ORIGINS, // CORS 허용
    PORT, // 서버 실행 포트
    ACCESS_TOKEN_SECRET, // 액세스 토큰 시크릿 키
    ACCESS_TOKEN_EXPIRES_IN, // 액세스 토큰 만료 시간
    REFRESH_TOKEN_SECRET, // 리프레시 토큰 시크릿 키
    REFRESH_TOKEN_EXPIRES_IN, // 리프레시 토큰 만료 시간
  } = process.env;

  if (
    !DATABASE_URL ||
    !REDIS_URL ||
    !ALLOWED_ORIGINS ||
    !PORT ||
    !ACCESS_TOKEN_SECRET ||
    !ACCESS_TOKEN_EXPIRES_IN ||
    !REFRESH_TOKEN_SECRET ||
    !REFRESH_TOKEN_EXPIRES_IN
  ) {
    console.error("DATABASE_URL=", DATABASE_URL);
    console.error("REDIS_URL=", REDIS_URL);
    console.error("ALLOWED_ORIGINS=", ALLOWED_ORIGINS);
    console.error("PORT=", PORT);
    console.error(
      "ACCESS_TOKEN_SECRET=",
      ACCESS_TOKEN_SECRET ? "[HIDDEN]" : undefined,
    );
    console.error("ACCESS_TOKEN_EXPIRES_IN=", ACCESS_TOKEN_EXPIRES_IN);
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
    accessToken: {
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: Number(ACCESS_TOKEN_EXPIRES_IN) || 900, // 기본 15분 (900초)
    },
    refreshToken: {
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: Number(REFRESH_TOKEN_EXPIRES_IN) || 604800, // 기본 7일 (604800초)
    },
  };
};

export type Configuration = ReturnType<typeof configuration>;
