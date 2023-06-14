import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./httpExceptions/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add dto validation
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      forbidUnknownValues: true,
    }),
  );

  // add versioning to app
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(3000);
}
bootstrap();
