import { ConsoleLogger } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string, ...args) {
    // add your tailored logic here
    super.error(message, stack, context, ...args);
  }

  logReq(request: any, response: any) {
    console.log(`Request: ${request.method} ${request.url}`);
    console.log(`Query Parameters: ${JSON.stringify(request.query)}`);
    console.log(`Body: ${JSON.stringify(request.body)}`);
    console.log(`Response: ${JSON.stringify(response)}`);
  }
}
