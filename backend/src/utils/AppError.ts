/**
 * Operational error — thrown when a known, expected error occurs
 * (e.g. not found, unauthorised, validation failure).
 * The global error middleware treats isOperational errors as safe
 * to forward to the client as-is.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean = true;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    // Restore prototype chain (required when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
