/**
 * Claude Local Adapter - Main Entry Point
 * Anthropic Claude integration with Messages API, streaming, tools, and thinking
 */

// Main adapter
export { ClaudeAdapter, createClaudeAdapter, getDefaultAdapter } from "./adapter";
export type { ClaudeAdapterConfig, ChatOptions, ChatResult, StreamChatResult, ModelInfo } from "./adapter";

// Models & Types
export * from "./models/types";

// Errors
export * from "./errors";

// Streaming
export * from "./streaming";

// Tools
export { ToolRegistry, validateToolInput, BUILTIN_TOOLS, ToolChoiceUtils } from "./tools";
export type { Tool } from "./models/types";

// Utils
export * from "./utils";