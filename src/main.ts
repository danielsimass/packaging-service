import './telemetry';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Packaging API')
    .setDescription(
      'API para otimização de empacotamento de produtos em caixas de papelão',
    )
    .setVersion('1.0')
    .addTag(
      'packaging',
      'Endpoints para processamento de pedidos e empacotamento',
    )
    .addTag('auth', 'Endpoints de geração e validação de API Keys')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description:
          'API Key para autenticação. Configure a variável API_KEY no arquivo .env',
      },
      'ApiKey',
    )
    .addServer('http://localhost:3000', 'Servidor de desenvolvimento')
    .addServer('https://api.example.com', 'Servidor de produção')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/docs',
    apiReference({
      content: document,
      cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
      theme: 'elysiajs',
    })
  );
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Aplicação rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/docs`);
}
void bootstrap();
