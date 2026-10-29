
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: "15m",
          issuer: config.getOrThrow<string>("JWT_ISSUER"),
          audience: config.getOrThrow<string>("JWT_AUDIENCE"),
          algorithm: "HS256",
        },
        verifyOptions: {
          issuer: config.getOrThrow<string>("JWT_ISSUER"),
          audience: config.getOrThrow<string>("JWT_AUDIENCE"),
          algorithms: ["HS256"],
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}