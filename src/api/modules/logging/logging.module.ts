import { DynamicModule, Module } from '@nestjs/common';
import { APP_LOGGER_PORT } from '../../../contexts/_shared/application/ports/logger.port';
import {
  BuildPinoLoggerOptions,
  PinoLoggerAdapter,
} from '../../../infrastructure/adapters/pinoLogger.adapter';
import { LoggerService } from './logger.service';
import { normalizeLoggerConfig } from './loggingConfig.utils';
import { RequestLoggingMiddleware } from './requestLogging.middleware';

export interface LoggerModuleOptions extends BuildPinoLoggerOptions {
  service: string;
  global: boolean;
  includeStack: boolean;
}

export interface LoggerModuleAsyncOptions {
  useFactory: (...args: any[]) => LoggerModuleOptions;
  inject: any[];
  imports: any[];
}

@Module({})
export class LoggingModule {
  static forRootAsync(options: LoggerModuleAsyncOptions): DynamicModule {
    const loggerOptionsProvider = {
      provide: 'LOGGER_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject,
    };

    return {
      imports: options.imports,
      module: LoggingModule,
      providers: [
        loggerOptionsProvider,
        RequestLoggingMiddleware,
        {
          provide: LoggerService,
          useFactory: (options: LoggerModuleOptions) => {
            const loggerConfig = normalizeLoggerConfig(options);
            return new LoggerService(loggerConfig, options.includeStack);
          },
          inject: ['LOGGER_OPTIONS'],
        },
      ],
      exports: [LoggerService, RequestLoggingMiddleware],
    };
  }
}
