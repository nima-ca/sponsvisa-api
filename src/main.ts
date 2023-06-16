import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./httpExceptions/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add i18n validation
  app.useGlobalPipes(
    new I18nValidationPipe({
      stopAtFirstError: true,
      forbidUnknownValues: true,
    }),
  );

  // add versioning to app
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(
    new AllExceptionFilter(),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  await app.listen(3000);
}
bootstrap();
