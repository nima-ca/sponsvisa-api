import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "./jwt/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./config/config.schema";
import { config } from "./config/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    I18nModule.forRoot({
      fallbackLanguage: `en`,
      loaderOptions: {
        path: path.join(__dirname, `/i18n/`),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: [`lang`] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(
        __dirname,
        `../src/generated/i18n.generated.ts`,
      ),
    }),
    AuthModule,
    JwtModule,
    PrismaModule,
  ],
})
export class AppModule {}
