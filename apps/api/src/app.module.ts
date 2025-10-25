import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthenticatedGuard } from "./common/jwt/guards/authenticated.guard";
import { JwtModule } from "./common/jwt/jwt.module";
import { RequestUserMiddleware } from "./common/jwt/middlewares/request-user.middleware";
import { configuration } from "./config/configuration";

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthenticatedGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestUserMiddleware).forRoutes("*splat");
  }
}
