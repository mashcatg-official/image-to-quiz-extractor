type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const CURRENT_LOG_LEVEL: LogLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'error';

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[CURRENT_LOG_LEVEL];
};

const formatError = (error: unknown): unknown => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any).details && { details: (error as any).details },
      ...(error.cause && { cause: formatError(error.cause) })
    };
  }
  return error;
};

export const logger = {
  error: (message: string, error?: unknown) => {
    if (shouldLog('error')) {
      console.error('[ERROR]', message, error ? formatError(error) : '');
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog('warn')) {
      console.warn('[WARN]', message, ...args);
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (shouldLog('info')) {
      console.info('[INFO]', message, ...args);
    }
  },

  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog('debug')) {
      console.debug('[DEBUG]', message, ...args);
    }
  }
};