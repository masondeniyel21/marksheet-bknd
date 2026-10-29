
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { DbModule } from "./db/db.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "test", "production")
          .default("development"),
        PORT: Joi.number().port().default(3001),
        DATABASE_URL: Joi.string().default("./data/school.db"),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_ISSUER: Joi.string().required(),
        JWT_AUDIENCE: Joi.string().required(),
        FRONTEND_URL: Joi.string().uri().required(),
      }),
    }),
    DbModule,
    AuthModule,
  ],
})
export class AppModule {}