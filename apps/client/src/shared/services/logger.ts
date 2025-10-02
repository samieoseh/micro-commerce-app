import { ENV } from '../constants';

type LogLevel = 'log' | 'info' | 'warn' | 'error';

class Logger {
  private isDev = ENV.IS_DEV;

  private print(level: LogLevel, ...args: any[]) {
    if (!this.isDev) return;

    const timestamp = new Date().toISOString();
    // eslint-disable-next-line no-console
    console[level](`[${timestamp}]`, ...args);
  }

  log(...args: any[]) {
    this.print('log', ...args);
  }

  info(...args: any[]) {
    this.print('info', ...args);
  }

  warn(...args: any[]) {
    this.print('warn', ...args);
  }

  error(...args: any[]) {
    this.print('error', ...args);
  }
}

export const logger = new Logger();