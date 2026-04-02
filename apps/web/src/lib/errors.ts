export class AppError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(message: string, statusCode = 500, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: Record<string, unknown>) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(message, 403, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: Record<string, unknown>) {
    super(message, 400, details);
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal Server Error", details?: Record<string, unknown>) {
    super(message, 500, details);
  }
}
