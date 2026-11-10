/**
 * Utility Functions
 * Helpers for headers, retries, validation, etc. following FCC patterns
 */

import { z } from "zod";
import type { MessagesRequest, ThinkingConfig } from "../models/types";
import { getModelCapabilities, ThinkingConfigSchema } from "../models/types";
type SDKThinkingConfig = z.infer<typeof ThinkingConfigSchema>;

/**
 * Anthropic API version (matching FCC's constant)
 */
export const ANTHROPIC_API_VERSION = "2023-06-01";

/**
 * Default request timeout (matching FCC's 32-bit max)
 */
export const DEFAULT_TIMEOUT_MS = 2147483647;

/**
 * Build request headers for Anthropic API
 */
export function buildHeaders(
  apiKey: string,
  options: {
    workspaceId?: string;
    betaHeaders?: string[];
    customHeaders?: Record<string, string>;
  } = {},
): Record<string, string> {
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "anthropic-version": ANTHROPIC_API_VERSION,
    "content-type": "application/json",
  };

  if (options.workspaceId) {
    headers["anthropic-workspace-id"] = options.workspaceId;
  }

  if (options.betaHeaders && options.betaHeaders.length > 0) {
    headers["anthropic-beta"] = options.betaHeaders.join(",");
  }

  if (options.customHeaders) {
    Object.assign(headers, options.customHeaders);
  }

  return headers;
}

/**
 * Validate and normalize Messages request (following FCC's native.py patterns)
 */
export function normalizeMessagesRequest(request: MessagesRequest): MessagesRequest {
  const normalized = { ...request };

  // Ensure messages is array
  normalized.messages = Array.isArray(request.messages) ? request.messages : [];

  // Normalize system message
  if (typeof request.system === "string") {
    normalized.system = [{ type: "text", text: request.system }];
  } else if (Array.isArray(request.system)) {
    normalized.system = request.system;
  }

  // Ensure max_tokens is set
  if (!normalized.max_tokens || normalized.max_tokens <= 0) {
    const caps = getModelCapabilities(normalized.model);
    normalized.max_tokens = Math.min(caps.maxOutputTokens, 4096);
  }

  // Validate thinking config against model capabilities
  if (normalized.thinking) {
    const caps = getModelCapabilities(normalized.model);
    normalized.thinking = validateThinkingConfig(normalized.thinking, caps);
  }

  // Validate tool choice
  if (normalized.tool_choice && normalized.tools?.length === 0) {
    delete normalized.tool_choice;
  }

  return normalized;
}

/**
 * Validate thinking config against model capabilities
 */
function validateThinkingConfig(
  thinking: ThinkingConfig,
  caps: ReturnType<typeof getModelCapabilities>,
): SDKThinkingConfig {
  const { type, budget_tokens } = thinking;

  if (type === "disabled") return { type: "disabled" };

  if (type === "adaptive") {
    if (!caps.adaptiveThinking) {
      return { type: "disabled" };
    }
    return { type: "adaptive" };
  }

  if (type === "enabled") {
    if (!caps.thinking) {
      return { type: "disabled" };
    }
    // Validate budget tokens
    if (budget_tokens && budget_tokens < 1024) {
      return { type: "enabled", budget_tokens: 1024 };
    }
    if (budget_tokens && budget_tokens > caps.maxOutputTokens) {
      return { type: "enabled", budget_tokens: caps.maxOutputTokens };
    }
    return { type: "enabled", budget_tokens: budget_tokens || 2048 };
  }

  return { type: "disabled" };
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableStatuses: number[];
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  retryableStatuses: [429, 500, 502, 503, 529],
};

/**
 * Exponential backoff retry
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs, retryableStatuses } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      const status = (error as any).statusCode || (error as any).status;
      const isRetryable = retryableStatuses.includes(status);

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs,
      );

      await sleep(delay);
    }
  }

  throw lastError!;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate request ID for tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Sanitize message content for logging
 */
export function sanitizeForLogging(content: unknown): unknown {
  if (typeof content === "string") {
    // Truncate long strings
    return content.length > 1000 ? content.slice(0, 1000) + "...[truncated]" : content;
  }
  if (Array.isArray(content)) {
    return content.map(sanitizeForLogging);
  }
  if (content && typeof content === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(content)) {
      // Skip sensitive fields
      if (["api_key", "auth_token", "password", "secret"].some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = "[REDACTED]";
      } else {
        sanitized[key] = sanitizeForLogging(value);
      }
    }
    return sanitized;
  }
  return content;
}

/**
 * Calculate token estimates for request
 */
export function estimateRequestTokens(request: MessagesRequest): number {
  let tokens = 0;

  // System message
  if (request.system) {
    const text = Array.isArray(request.system)
      ? request.system.map((b) => (b.type === "text" ? b.text : "")).join("")
      : request.system;
    tokens += Math.ceil(text.length / 4); // Rough estimate
  }

  // Messages
  for (const msg of request.messages) {
    const text = Array.isArray(msg.content)
      ? msg.content.filter((b) => b.type === "text").map((b) => b.text).join("")
      : msg.content;
    tokens += Math.ceil(text.length / 4);
  }

  // Tools (rough estimate)
  if (request.tools) {
    tokens += request.tools.length * 100;
  }

  return tokens;
}

/**
 * Format usage for logging
 */
export function formatUsage(usage: {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens?: number;
  cacheReadInputTokens?: number;
}): string {
  const parts = [
    `in:${usage.inputTokens}`,
    `out:${usage.outputTokens}`,
  ];
  if (usage.cacheCreationInputTokens) parts.push(`cache_w:${usage.cacheCreationInputTokens}`);
  if (usage.cacheReadInputTokens) parts.push(`cache_r:${usage.cacheReadInputTokens}`);
  return parts.join(" ");
}

/**
 * Check if model supports feature
 */
export function modelSupports(model: string, feature: "thinking" | "adaptiveThinking" | "outputEffort" | "vision" | "toolUse"): boolean {
  const caps = getModelCapabilities(model);
  return caps[feature] === true;
}