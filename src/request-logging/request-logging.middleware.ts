import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/custom-logger.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: CustomLogger) {}
  async use(req: Request, res: Response, next: () => void) {
    try {
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
      res.on('error', (error) => {
        throw error;
      });
      await next();
    } catch (error) {
      let customError;
      if (error instanceof HttpException) {
        const status = error.getStatus();
        res.status(status).json({
          statusCode: status,
          message: error.message,
        });
        customError = {
          statusCode: status,
          message: error.message,
          error: error,
        };
      } else {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        res.status(status).json({
          statusCode: status,
          message: 'Internal server error',
        });
        customError = {
          statusCode: status,
          message: error.message,
          error: error,
        };
      }

      this.loggingService.error(customError);
    }
  }
}
