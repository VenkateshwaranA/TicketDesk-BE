import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.TICKETS_PORT || 3013;
  await app.listen(port as number);
}

bootstrap();


