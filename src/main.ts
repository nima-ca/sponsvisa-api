import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";

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

  await app.listen(3000);
}
bootstrap();
