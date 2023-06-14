import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "./jwt/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./config/config.schema";
import { config } from "./config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    AuthModule,
    JwtModule,
  ],
})
export class AppModule {}
