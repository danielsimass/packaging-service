import { randomUUID } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';

import { Injectable } from '@nestjs/common';
import { Params } from 'nestjs-pino';

@Injectable()
export class LoggerConfigService {
  public readonly level = process.env.PINO_LOG_LEVEL || 'info';

  getPinoHttpOptions(): Params {
    return {
      pinoHttp: {
        level: this.level,
        customLogLevel: (_, res: ServerResponse & { raw?: ServerResponse }, err) => {
          const statusCode = res?.raw?.statusCode ?? res?.statusCode;
          if (statusCode >= 500 || err) return 'error';
          if (statusCode >= 400) return 'warn';
          return 'info';
        },
        serializers: {
          req(req: IncomingMessage) {
            return {
              method: req.method,
              url: req.url,
            };
          },
          res(res: ServerResponse<IncomingMessage>) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
        customProps: (req: IncomingMessage) => ({
          requestId: req.headers['x-request-id'] ?? randomUUID(),
          userAgent: req.headers['user-agent'],
        }),
        transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
      },
    };
  }
}
