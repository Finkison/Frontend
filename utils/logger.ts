
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

interface ErrorLogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: unknown;
  context?: LogContext;
  userAgent: string;
  url: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isErrorLogEntry = (value: unknown): value is ErrorLogEntry => {
  if (!isRecord(value)) return false;
  return (
    typeof value.timestamp === 'string' &&
    (value.level === 'error' || value.level === 'warn' || value.level === 'info' || value.level === 'debug') &&
    typeof value.message === 'string' &&
    typeof value.userAgent === 'string' &&
    typeof value.url === 'string'
  );
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error, context);
    }

    if (this.isProduction) {
      // Send to error tracking service (Sentry, etc.)
      this.sendToErrorTracking('error', message, error, context);
    }
  }

  /**
   * Log warning - development only
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context);
    }
  }

  /**
   * Log info - development only
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, context);
    }
  }

  /**
   * Log debug - development only
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  /**
   * Send error to external tracking service
   * Configure with your error tracking service (Sentry, LogRocket, etc.)
   */
  private sendToErrorTracking(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext
  ): void {
    // Example: Sentry integration
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     level,
    //     tags: {
    //       message,
    //       ...context,
    //     },
    //   });
    // }

    // For now, just structure the error for future integration
    const structuredError = {
      timestamp: new Date().toISOString(),
      level,
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store in localStorage for debugging (limit to last 50 errors)
    try {
      const storedLog: unknown = JSON.parse(localStorage.getItem('finkison_error_log') || '[]');
      const errorLog: unknown[] = Array.isArray(storedLog) ? storedLog : [];
      errorLog.unshift(structuredError);
      localStorage.setItem('finkison_error_log', JSON.stringify(errorLog.slice(0, 50)));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Clear error log from localStorage
   */
  clearErrorLog(): void {
    try {
      localStorage.removeItem('finkison_error_log');
    } catch {
      // Silently fail
    }
  }

  /**
   * Get error log from localStorage (for debugging)
   */
  getErrorLog(): ErrorLogEntry[] {
    try {
      const storedLog: unknown = JSON.parse(localStorage.getItem('finkison_error_log') || '[]');
      return Array.isArray(storedLog) ? storedLog.filter(isErrorLogEntry) : [];
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for external use
export type { LogContext };
