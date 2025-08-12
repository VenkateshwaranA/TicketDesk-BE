import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.USERS_PORT || 3012;
  await app.listen(port as number);
}

bootstrap();


