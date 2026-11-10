/**
 * Anthropic Model Types
 * Model definitions and capabilities following FCC patterns
 */

import { z } from "zod";

/**
 * Known Anthropic model identifiers (2024-2025)
 */
export const ANTHROPIC_MODELS = [
  // Opus models
  "claude-opus-4-6",
  "claude-opus-4-5",
  "claude-opus-4-1",
  "claude-opus-4",
  "claude-3-opus-20240229",
  // Sonnet models
  "claude-sonnet-4-6",
  "claude-sonnet-4-5",
  "claude-sonnet-4-1",
  "claude-sonnet-4",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-20240620",
  "claude-3-sonnet-20240229",
  // Haiku models
  "claude-haiku-4-5",
  "claude-haiku-4-1",
  "claude-haiku-4",
  "claude-3-5-haiku-20241022",
  "claude-3-haiku-20240307",
] as const;

export type AnthropicModel = (typeof ANTHROPIC_MODELS)[number];

/**
 * Model capabilities following FCC's capability detection pattern
 */
export interface ModelCapabilities {
  /** Supports thinking/reasoning blocks */
  thinking: boolean;
  /** Supports adaptive thinking mode */
  adaptiveThinking: boolean;
  /** Supports output effort levels (low/medium/high) */
  outputEffort: boolean;
  /** Supports vision/image input */
  vision: boolean;
  /** Supports tool use */
  toolUse: boolean;
  /** Maximum output tokens */
  maxOutputTokens: number;
  /** Maximum context window */
  contextWindow: number;
  /** Model family for routing */
  family: "opus" | "sonnet" | "haiku";
}

/**
 * Model capability registry - populated from FCC's known capabilities
 */
export const MODEL_CAPABILITIES: Record<AnthropicModel, ModelCapabilities> = {
  // Opus 4.x
  "claude-opus-4-6": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "opus",
  },
  "claude-opus-4-5": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "opus",
  },
  "claude-opus-4-1": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "opus",
  },
  "claude-opus-4": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "opus",
  },
  "claude-3-opus-20240229": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 4096,
    contextWindow: 200000,
    family: "opus",
  },
  // Sonnet 4.x
  "claude-sonnet-4-6": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-sonnet-4-5": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-sonnet-4-1": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-sonnet-4": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 128000,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-3-5-sonnet-20241022": {
    thinking: true,
    adaptiveThinking: true,
    outputEffort: true,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-3-5-sonnet-20240620": {
    thinking: true,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "sonnet",
  },
  "claude-3-sonnet-20240229": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 4096,
    contextWindow: 200000,
    family: "sonnet",
  },
  // Haiku 4.x
  "claude-haiku-4-5": {
    thinking: true,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "haiku",
  },
  "claude-haiku-4-1": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "haiku",
  },
  "claude-haiku-4": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "haiku",
  },
  "claude-3-5-haiku-20241022": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 8192,
    contextWindow: 200000,
    family: "haiku",
  },
  "claude-3-haiku-20240307": {
    thinking: false,
    adaptiveThinking: false,
    outputEffort: false,
    vision: true,
    toolUse: true,
    maxOutputTokens: 4096,
    contextWindow: 200000,
    family: "haiku",
  },
};

/**
 * Get capabilities for a model (with fallback for unknown models)
 */
export function getModelCapabilities(model: string): ModelCapabilities {
  const known = MODEL_CAPABILITIES[model as AnthropicModel];
  if (known) return known;

  // Fallback: infer from model name prefix (FCC pattern)
  const lower = model.toLowerCase();
  if (lower.startsWith("claude-opus")) {
    return MODEL_CAPABILITIES["claude-opus-4"];
  }
  if (lower.startsWith("claude-sonnet")) {
    return MODEL_CAPABILITIES["claude-sonnet-4"];
  }
  if (lower.startsWith("claude-haiku")) {
    return MODEL_CAPABILITIES["claude-haiku-4"];
  }
  // Default to Sonnet 4 capabilities
  return MODEL_CAPABILITIES["claude-sonnet-4"];
}

/**
 * Thinking configuration types (matching Anthropic SDK format)
 */
export type ThinkingType = "enabled" | "adaptive" | "disabled";

export interface ThinkingConfig {
  type: ThinkingType;
  budget_tokens?: number;
  display?: "summarized" | "full";
}

export interface OutputEffortConfig {
  effort: "low" | "medium" | "high";
}

/**
 * Request/Response types matching Anthropic Messages API
 */
export const MessageRoleSchema = z.enum(["user", "assistant"]);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ContentBlockTypeSchema = z.enum(["text", "image", "tool_use", "tool_result", "thinking"]);
export type ContentBlockType = z.infer<typeof ContentBlockTypeSchema>;

export const TextContentSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  cache_control: z.object({ type: z.literal("ephemeral"), ttl: z.string().optional() }).optional(),
});

export const ImageContentSchema = z.object({
  type: z.literal("image"),
  source: z.object({
    type: z.literal("base64"),
    media_type: z.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
    data: z.string(),
  }),
  cache_control: z.object({ type: z.literal("ephemeral"), ttl: z.string().optional() }).optional(),
});

export const ToolUseContentSchema = z.object({
  type: z.literal("tool_use"),
  id: z.string(),
  name: z.string(),
  input: z.record(z.unknown()),
  cache_control: z.object({ type: z.literal("ephemeral"), ttl: z.string().optional() }).optional(),
});

export const ToolResultContentSchema = z.object({
  type: z.literal("tool_result"),
  tool_use_id: z.string(),
  content: z.union([z.string(), z.array(z.unknown())]),
  is_error: z.boolean().optional(),
  cache_control: z.object({ type: z.literal("ephemeral"), ttl: z.string().optional() }).optional(),
});

export const ThinkingContentSchema = z.object({
  type: z.literal("thinking"),
  thinking: z.string(),
  signature: z.string(),
});

export const ContentBlockSchema = z.union([
  TextContentSchema,
  ImageContentSchema,
  ToolUseContentSchema,
  ToolResultContentSchema,
  ThinkingContentSchema,
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

export const MessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.union([z.string(), z.array(ContentBlockSchema)]),
});

export type Message = z.infer<typeof MessageSchema>;

export const ToolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  input_schema: z.object({
    type: z.literal("object"),
    properties: z.record(z.unknown()),
    required: z.array(z.string()).optional(),
  }),
});

export type Tool = z.infer<typeof ToolSchema>;

export const ToolChoiceSchema = z.union([
  z.object({ type: z.literal("auto") }),
  z.object({ type: z.literal("any") }),
  z.object({ type: z.literal("tool"), name: z.string() }),
  z.object({ type: z.literal("none") }),
]);

export type ToolChoice = z.infer<typeof ToolChoiceSchema>;

export const ThinkingConfigSchema = z.union([
  z.object({
    type: z.literal("enabled"),
    budget_tokens: z.number().int().positive(),
    display: z.enum(["summarized", "full"]).optional(),
  }),
  z.object({ type: z.literal("adaptive") }),
  z.object({ type: z.literal("disabled") }),
]);

export const MessagesRequestSchema = z.object({
  model: z.string(),
  max_tokens: z.number().int().positive(),
  messages: z.array(MessageSchema),
  system: z.union([z.string(), z.array(TextContentSchema)]).optional(),
  tools: z.array(ToolSchema).optional(),
  tool_choice: ToolChoiceSchema.optional(),
  thinking: ThinkingConfigSchema.optional(),
  stream: z.boolean().optional(),
  temperature: z.number().min(0).max(1).optional(),
  top_p: z.number().min(0).max(1).optional(),
  top_k: z.number().int().positive().optional(),
  stop_sequences: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type MessagesRequest = z.infer<typeof MessagesRequestSchema>;

export const UsageSchema = z.object({
  input_tokens: z.number().int().nonnegative(),
  output_tokens: z.number().int().nonnegative(),
  cache_creation_input_tokens: z.number().int().nonnegative().optional(),
  cache_read_input_tokens: z.number().int().nonnegative().optional(),
});

export type Usage = z.infer<typeof UsageSchema>;

export const MessageResponseSchema = z.object({
  id: z.string(),
  type: z.literal("message"),
  role: z.literal("assistant"),
  content: z.array(ContentBlockSchema),
  model: z.string(),
  stop_reason: z.enum(["end_turn", "max_tokens", "tool_use", "stop_sequence"]).nullable(),
  stop_sequence: z.string().nullable(),
  usage: UsageSchema,
});

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

/**
 * Streaming event types (SSE)
 */
export const StreamEventTypeSchema = z.enum([
  "message_start",
  "content_block_start",
  "content_block_delta",
  "content_block_stop",
  "message_delta",
  "message_stop",
  "error",
]);

export type StreamEventType = z.infer<typeof StreamEventTypeSchema>;

export const StreamEventSchema = z.object({
  type: StreamEventTypeSchema,
  message: MessageResponseSchema.optional(),
  index: z.number().int().optional(),
  content_block: ContentBlockSchema.optional(),
  delta: z.union([
    z.object({ type: z.literal("text_delta"), text: z.string() }),
    z.object({ type: z.literal("thinking_delta"), thinking: z.string(), signature: z.string().optional() }),
    z.object({ type: z.literal("tool_use_delta"), name: z.string(), input: z.string() }),
  ]).optional(),
  usage: UsageSchema.optional(),
  error: z.object({ type: z.string(), message: z.string() }).optional(),
});

export type StreamEvent = z.infer<typeof StreamEventSchema>;