import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { I18nValidationExceptionFilter, I18nValidationPipe } from "nestjs-i18n";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./common/httpExceptions/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add versioning to app
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // add swagger module
  const config = new DocumentBuilder()
    .setTitle(`Sponsvisa-API`)
    .setDescription(`Here you can find API documentations`)
    .setVersion(`1.0`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api`, app, document);

  // add i18n validation
  app.useGlobalPipes(
    new I18nValidationPipe({
      stopAtFirstError: true,
      forbidUnknownValues: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new AllExceptionFilter(),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: `same-site`,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
