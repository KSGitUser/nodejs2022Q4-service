import { ConsoleLogger } from '@nestjs/common';
import { LogLevel } from 'ts-loader/dist/logger';

export class CustomLogger extends ConsoleLogger {
  logLevel: number;
  constructor() {
    super();
    this.logLevel =
      parseInt(process.env.LOG_LEVEL, 10) >= 0
        ? parseInt(process.env.LOG_LEVEL, 10)
        : 3;
  }

  logOutLogs(...data) {
    console.log(...data);
  }

  logReq(request: any, response: any) {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(`Request: ${request.method} ${request.url}`);
      console.log(`Query Parameters: ${JSON.stringify(request.query)}`);
      console.log(`Body: ${JSON.stringify(request.body)}`);
      console.log(`Response: ${JSON.stringify(response)}`);
    }
  }

  log(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      this.logOutLogs(message, ...optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= LogLevel.ERROR) {
      this.logOutLogs(message, ...optionalParams);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= LogLevel.WARN) {
      this.logOutLogs(message, ...optionalParams);
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      this.logOutLogs(message, ...optionalParams);
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (this.logLevel >= LogLevel.INFO) {
      this.logOutLogs(message, ...optionalParams);
    }
  }
}
