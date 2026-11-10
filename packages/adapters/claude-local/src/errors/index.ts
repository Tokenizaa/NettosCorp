/**
 * Anthropic Adapter Errors
 * Error classes matching Anthropic API error types
 */

export class AnthropicError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorType: string,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = "AnthropicError";
  }
}

export class AuthenticationError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 401, "authentication_error", requestId);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends AnthropicError {
  constructor(
    message: string,
    public readonly retryAfter?: number,
    requestId?: string,
  ) {
    super(message, 429, "rate_limit_error", requestId);
    this.name = "RateLimitError";
  }
}

export class InvalidRequestError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 400, "invalid_request_error", requestId);
    this.name = "InvalidRequestError";
  }
}

export class NotFoundError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 404, "not_found_error", requestId);
    this.name = "NotFoundError";
  }
}

export class ServerError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 500, "server_error", requestId);
    this.name = "ServerError";
  }
}

export class OverloadedError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 529, "overloaded_error", requestId);
    this.name = "OverloadedError";
  }
}

export class PermissionError extends AnthropicError {
  constructor(message: string, requestId?: string) {
    super(message, 403, "permission_error", requestId);
    this.name = "PermissionError";
  }
}

/**
 * Create error from Anthropic API response
 */
export function createErrorFromResponse(
  status: number,
  error: { type: string; message: string },
  requestId?: string,
): AnthropicError {
  switch (status) {
    case 400:
      return new InvalidRequestError(error.message, requestId);
    case 401:
      return new AuthenticationError(error.message, requestId);
    case 403:
      return new PermissionError(error.message, requestId);
    case 404:
      return new NotFoundError(error.message, requestId);
    case 429:
      return new RateLimitError(error.message, undefined, requestId);
    case 500:
      return new ServerError(error.message, requestId);
    case 529:
      return new OverloadedError(error.message, requestId);
    default:
      return new AnthropicError(error.message, status, error.type, requestId);
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  if (error instanceof RateLimitError) return true;
  if (error instanceof ServerError) return true;
  if (error instanceof OverloadedError) return true;
  if (error instanceof AnthropicError && error.statusCode >= 500) return true;
  return false;
}