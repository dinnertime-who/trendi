import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.ALLOWED_ORIGIN?.split(",") ?? [
        "http://localhost:3000",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
