import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PackagingModule } from './packaging/packaging.module';
import { ApiKeyAuthGuard } from './auth/api-key-auth.guard';
import { LoggerModule } from 'nestjs-pino';
import { LoggerConfigModule } from './logger/logger.module';
import { LoggerConfigService } from './logger/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule.forRootAsync({
      imports: [LoggerConfigModule],
      inject: [LoggerConfigService],
      useFactory: (loggerConfig: LoggerConfigService) => {
        return loggerConfig.getPinoHttpOptions();
      },
    }),
    AuthModule, 
    PackagingModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyAuthGuard,
    },
  ],
})
export class AppModule {}
