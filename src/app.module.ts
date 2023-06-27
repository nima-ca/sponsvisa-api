import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "./jwt/jwt.module";
import { ConfigModule } from "@nestjs/config";
import { validationSchema } from "./common/config/config.schema";
import { config } from "./common/config/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { CompanyModule } from "./company/company.module";
import * as path from "path";
import { AuthMiddleware } from "./auth/auth.middleware";
import { LoggerMiddleware } from "./common/log/logger.middleware";
import { CommentModule } from "./comment/comment.module";
import { VoteModule } from './vote/vote.module';
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
        `../src/i18n/generated/i18n.generated.ts`,
      ),
    }),
    AuthModule,
    JwtModule,
    PrismaModule,
    CompanyModule,
    CommentModule,
    VoteModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(`*`);
    consumer.apply(AuthMiddleware).forRoutes(`*`);
  }
}
