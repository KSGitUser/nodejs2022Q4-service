import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { CustomLogger } from '../logger/custom-logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: CustomLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    this.loggingService.error(exception);
  }
}
