import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { DbModule } from "./common/db/db.module";
import { AuthenticatedGuard } from "./common/jwt/guards/authenticated.guard";
import { JwtModule } from "./common/jwt/jwt.module";
import { RequestUserMiddleware } from "./common/jwt/middlewares/request-user.middleware";
import { configuration } from "./config/configuration";
import { AuthModule } from "./modules/auth/auth.module";

@Module({
  imports: [
    JwtModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AuthModule,
    DbModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthenticatedGuard }, //
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestUserMiddleware).forRoutes("*splat");
  }
}
