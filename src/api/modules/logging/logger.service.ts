import { Injectable } from '@nestjs/common';
import {
  type BuildPinoLoggerOptions,
  PinoLoggerAdapter,
} from 'src/infrastructure/adapters/pinoLogger.adapter';

@Injectable()
export class LoggerService extends PinoLoggerAdapter {
  constructor(options: BuildPinoLoggerOptions, includeStack: boolean) {
    super(options, includeStack);
  }
}
