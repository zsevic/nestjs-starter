import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { setupApiDocs } from 'common/config/api-docs';
import { AllExceptionsFilter } from 'common/filters';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';
import { AppModule } from 'modules/app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enableCors({
    credentials: true,
    origin: configService.get('CLIENT_URL'),
  });
  app.enableShutdownHooks();
  app.get(AppModule).subscribeToShutdown(() => app.close());

  app.use(cookieParser());
  app.use(loggerMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  setupApiDocs(app);

  await app.listen(configService.get('PORT')).then(() => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}

bootstrap();

process.on('unhandledRejection', function handleUnhandledRejection(
  err: Error,
): void {
  const logger = new Logger(handleUnhandledRejection.name);
  logger.error(err.stack);
});
