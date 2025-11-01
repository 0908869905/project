import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',')
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend server is running on: http://localhost:${port}`);
}

bootstrap();
