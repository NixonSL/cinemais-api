export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export class RequestTimeoutError extends AppError {
  constructor(message = 'Request timeout') {
    super(408, message);
    this.name = 'RequestTimeoutError';
  }
}

export class GoneError extends AppError {
  constructor(message = 'Resource gone') {
    super(410, message);
    this.name = 'GoneError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(429, message);
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable') {
    super(503, message);
    this.name = 'ServiceUnavailableError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(message = 'External API error') {
    super(502, message);
    this.name = 'ExternalAPIError';
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Operation timeout') {
    super(504, message);
    this.name = 'TimeoutError';
  }
}
