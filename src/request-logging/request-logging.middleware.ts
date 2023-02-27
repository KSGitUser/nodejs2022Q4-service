import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/custom-logger.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: CustomLogger) {}
  async use(req: Request, res: Response, next: () => void) {
    const { method, baseUrl, query, body } = req;

    res.on('finish', () => {
      const response = {
        statusCode: res.statusCode,
        message: res.statusMessage,
      };
      this.loggingService.logReq(
        { method, url: baseUrl, query, body },
        response,
      );
    });
    await next();
  }
}
