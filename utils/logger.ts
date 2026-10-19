/**
 * Centralized logging utility for Finkison Frontend
 * 
 * Replaces direct console.* calls with structured logging.
 * In production, logs can be sent to external monitoring services (Sentry, LogRocket, etc.)
 * 
 * @example
 * ```ts
 * import { logger } from '@/utils/logger';
 * 
 * // Error logging
 * logger.error('Failed to load dashboard', error);
 * 
 * // Warning (development only)
 * logger.warn('API rate limit approaching', { remaining: 10 });
 * 
 * // Info (development only)
 * logger.info('User logged in', { userId: '123' });
 * ```
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.isProduction = import.meta.env.PROD;
  }

  /**
   * Log error - always logged, sent to error tracking in production
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
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
    error?: Error | unknown,
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
      const errorLog = JSON.parse(localStorage.getItem('finkison_error_log') || '[]');
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
  getErrorLog(): any[] {
    try {
      return JSON.parse(localStorage.getItem('finkison_error_log') || '[]');
    } catch {
      return [];
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for external use
export type { LogContext };
