import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import compression from "compression";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { Configuration } from "./config/configuration";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(compression());

  const configService = app.get<ConfigService<Configuration>>(ConfigService);
  const allowedOrigins = configService.getOrThrow("allowedOrigins", {
    infer: true,
  });
  app.enableCors({
    origin: (origin, callback) => {
      // allow mobile app
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.length === 0 && origin === "http://localhost:3000") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  const port = configService.getOrThrow("port", { infer: true });
  await app.listen(port);
}
bootstrap();
