import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
  private logger = new Logger();
  private logDir = process.env.LOG_FILE || './logs';

  constructor() {
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    const logDirectory = path.dirname(this.logDir);
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
  }

  log(message: string, context?: string) {
    this.logger.log(message, context);
    this.writeLog('LOG', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
    this.writeLog('ERROR', message, context, trace);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
    this.writeLog('WARN', message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
    this.writeLog('DEBUG', message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
    this.writeLog('VERBOSE', message, context);
  }

  private writeLog(level: string, message: string, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] [${context || 'APP'}] ${message}${trace ? '\n' + trace : ''}\n`;

    fs.appendFileSync(this.logDir, logMessage, 'utf-8');
  }
}
