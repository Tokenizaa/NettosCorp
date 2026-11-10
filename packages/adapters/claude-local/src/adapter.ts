/**
 * Claude Local Adapter
 * Main adapter class for Anthropic Claude integration
 * Following FCC's provider patterns with full Messages API support
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  MessagesRequest,
  MessageResponse,
  StreamEvent,
  Tool,
  ThinkingConfig,
  ModelCapabilities,
} from "./models/types";
import { getModelCapabilities, ANTHROPIC_MODELS, type AnthropicModel } from "./models/types";
import { buildHeaders, normalizeMessagesRequest, withRetry, generateRequestId, estimateRequestTokens, formatUsage, modelSupports } from "./utils";
import { createAccumulator, parseSSEStream, processStream } from "./streaming";
import { ToolRegistry, validateToolInput, BUILTIN_TOOLS } from "./tools";
import {
  AnthropicError,
  AuthenticationError,
  RateLimitError,
  InvalidRequestError,
  ServerError,
  OverloadedError,
  createErrorFromResponse,
  isRetryableError,
} from "./errors";

/**
 * Adapter configuration
 */
export interface ClaudeAdapterConfig {
  /** Anthropic API key (or use ANTHROPIC_API_KEY env var) */
  apiKey?: string;
  /** Workspace ID for multi-workspace setups */
  workspaceId?: string;
  /** Custom base URL (for proxies like FCC) */
  baseURL?: string;
  /** Request timeout in ms */
  timeoutMs?: number;
  /** Default model to use */
  defaultModel?: string;
  /** Enable beta features */
  betaHeaders?: string[];
  /** Custom fetch implementation */
  fetch?: typeof fetch;
}

/**
 * Chat completion options
 */
export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  system?: string | Array<{ type: "text"; text: string }>;
  tools?: Tool[];
  toolChoice?: "auto" | "any" | "none" | { type: "tool"; name: string };
  thinking?: ThinkingConfig;
  stopSequences?: string[];
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Chat completion result
 */
export interface ChatResult {
  message: MessageResponse;
  requestId: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens: number;
    cacheReadInputTokens: number;
  };
}

/**
 * Streaming chat result
 */
export interface StreamChatResult {
  stream: AsyncGenerator<StreamEvent, void, unknown>;
  accumulator: ReturnType<typeof createAccumulator>;
  requestId: string;
}

/**
 * Model info for listing
 */
export interface ModelInfo {
  id: string;
  name: string;
  capabilities: ModelCapabilities;
}

/**
 * Main Claude Adapter Class
 */
export class ClaudeAdapter {
  private client: Anthropic;
  private config: Required<ClaudeAdapterConfig>;
  private toolRegistry: ToolRegistry;
  private modelCache: Map<string, ModelCapabilities> = new Map();

  constructor(config: ClaudeAdapterConfig = {}) {
    // Resolve API key from config or environment
    const apiKey = config.apiKey || process.env["ANTHROPIC_API_KEY"];
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not provided. Set it in config or environment.");
    }

    // Default configuration
    this.config = {
      apiKey,
      workspaceId: config.workspaceId || process.env["ANTHROPIC_WORKSPACE_ID"] || "",
      baseURL: config.baseURL || "https://api.anthropic.com",
      timeoutMs: config.timeoutMs || 2147483647,
      defaultModel: config.defaultModel || "claude-sonnet-4-6",
      betaHeaders: config.betaHeaders || [],
      fetch: config.fetch || fetch,
    };

    // Initialize Anthropic SDK client
    this.client = new Anthropic({
      apiKey: this.config.apiKey,
      baseURL: this.config.baseURL,
      defaultHeaders: buildHeaders(this.config.apiKey, {
        workspaceId: this.config.workspaceId || undefined,
        betaHeaders: this.config.betaHeaders,
      }),
      timeout: this.config.timeoutMs,
    });

    // Initialize tool registry with builtins
    this.toolRegistry = new ToolRegistry(true);
  }

  /**
   * Get the underlying Anthropic client for advanced usage
   */
  getClient(): Anthropic {
    return this.client;
  }

  /**
   * Get tool registry
   */
  getToolRegistry(): ToolRegistry {
    return this.toolRegistry;
  }

  /**
   * Register a custom tool
   */
  registerTool(tool: Tool): void {
    this.toolRegistry.register(tool);
  }

  /**
   * List available models with capabilities
   * Uses known models since Anthropic SDK doesn't have a models.list() method
   */
  async listModels(): Promise<ModelInfo[]> {
    // Anthropic SDK doesn't have models.list(), use known models
    return ANTHROPIC_MODELS.map((id) => ({
      id,
      name: id,
      capabilities: getModelCapabilities(id),
    }));
  }

  /**
   * Get model capabilities (cached)
   */
  getModelCapabilities(model: string): ModelCapabilities {
    if (!this.modelCache.has(model)) {
      this.modelCache.set(model, getModelCapabilities(model));
    }
    return this.modelCache.get(model)!;
  }

  /**
   * Check if model supports a feature
   */
  supports(model: string, feature: "thinking" | "adaptiveThinking" | "outputEffort" | "vision" | "toolUse"): boolean {
    return modelSupports(model, feature);
  }

  /**
   * Send a chat completion request (non-streaming)
   */
  async chat(messages: MessagesRequest["messages"], options: ChatOptions = {}): Promise<ChatResult> {
    const requestId = generateRequestId();
    const model = options.model || this.config.defaultModel;

    // Build request
    const request = this.buildRequest(messages, model, options);

    // Estimate tokens for logging
    const estimatedTokens = estimateRequestTokens(request);

    // Send request with retry
    const response = await withRetry(async () => {
      return this.client.messages.create(request as any);
    });

    const message = response as MessageResponse;

    return {
      message,
      requestId,
      model,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cacheCreationInputTokens: message.usage.cache_creation_input_tokens || 0,
        cacheReadInputTokens: message.usage.cache_read_input_tokens || 0,
      },
    };
  }

  /**
   * Send a streaming chat completion request
   */
  async *streamChat(
    messages: MessagesRequest["messages"],
    options: ChatOptions = {},
  ): AsyncGenerator<StreamEvent, void, unknown> {
    const requestId = generateRequestId();
    const model = options.model || this.config.defaultModel;

    // Build request with stream=true
    const request = this.buildRequest(messages, model, { ...options, stream: true });

    // Create streaming request
    const stream = await this.client.messages.stream(request as any);

    // Yield events from the stream
    for await (const event of stream) {
      yield this.mapSDKEvent(event);
    }
  }

  /**
   * Stream chat with accumulator for complete message reconstruction
   */
  async streamChatWithAccumulator(
    messages: MessagesRequest["messages"],
    options: ChatOptions = {},
  ): Promise<StreamChatResult> {
    const requestId = generateRequestId();
    const model = options.model || this.config.defaultModel;
    const request = this.buildRequest(messages, model, { ...options, stream: true });

    const stream = await this.client.messages.stream(request as any);
    const { handlers, getResult } = createAccumulator();

    // Process stream with accumulator
    const generator = (async function* (this: ClaudeAdapter) {
      for await (const event of stream) {
        const mapped = this.mapSDKEvent(event);
        // Call handlers
        switch (mapped.type) {
          case "message_start":
            await handlers.onMessageStart?.(mapped);
            break;
          case "content_block_start":
            await handlers.onContentBlockStart?.(mapped);
            break;
          case "content_block_delta":
            await handlers.onContentBlockDelta?.(mapped);
            break;
          case "content_block_stop":
            await handlers.onContentBlockStop?.(mapped);
            break;
          case "message_delta":
            await handlers.onMessageDelta?.(mapped);
            break;
          case "message_stop":
            await handlers.onMessageStop?.(mapped);
            break;
          case "error":
            await handlers.onError?.(mapped);
            break;
        }
        yield mapped;
      }
    }).bind(this)();

    return {
      stream: generator,
      accumulator: { handlers, getResult },
      requestId,
    };
  }

  /**
   * Count tokens in a request
   * Uses the countTokens method from the SDK
   */
  async countTokens(request: MessagesRequest): Promise<{ inputTokens: number }> {
    // Use the SDK's countTokens method (available in newer versions)
    const response = await (this.client.messages as any).countTokens?.(request as any);
    if (response) {
      return { inputTokens: response.input_tokens };
    }
    // Fallback to estimation
    return { inputTokens: estimateRequestTokens(request) };
  }

  /**
   * Validate tool input
   */
  validateToolInput(toolName: string, input: unknown): { valid: boolean; error?: string } {
    const tool = this.toolRegistry.get(toolName);
    if (!tool) {
      return { valid: false, error: `Tool not found: ${toolName}` };
    }
    return validateToolInput(tool, input);
  }

  /**
   * Execute a tool (for built-in tools)
   */
  async executeTool(name: string, input: unknown): Promise<{ result: unknown; isError?: boolean }> {
    // Built-in tool execution would go here
    // For now, return a placeholder
    return { result: `Tool ${name} executed with input: ${JSON.stringify(input)}`, isError: false };
  }

  /**
   * Build normalized request object
   */
  private buildRequest(
    messages: MessagesRequest["messages"],
    model: string,
    options: ChatOptions,
  ): MessagesRequest {
    const request: MessagesRequest = {
      model,
      max_tokens: options.maxTokens || this.getModelCapabilities(model).maxOutputTokens,
      messages,
    };

    if (options.system) {
      request.system = options.system;
    }
    if (options.temperature !== undefined) {
      request.temperature = options.temperature;
    }
    if (options.topP !== undefined) {
      request.top_p = options.topP;
    }
    if (options.topK !== undefined) {
      request.top_k = options.topK;
    }
    if (options.tools && options.tools.length > 0) {
      request.tools = options.tools;
    }
    if (options.toolChoice) {
      request.tool_choice = this.normalizeToolChoice(options.toolChoice);
    }
    if (options.thinking) {
      // Convert our ThinkingConfig to SDK format
      request.thinking = this.convertThinkingConfig(options.thinking);
    }
    if (options.stopSequences && options.stopSequences.length > 0) {
      request.stop_sequences = options.stopSequences;
    }
    if (options.metadata) {
      request.metadata = options.metadata;
    }

    return normalizeMessagesRequest(request);
  }

  /**
   * Convert our ThinkingConfig to SDK format
   */
  private convertThinkingConfig(thinking: ThinkingConfig): any {
    switch (thinking.type) {
      case "enabled":
        return {
          type: "enabled",
          budget_tokens: thinking.budget_tokens || 2048,
          display: thinking.display || "summarized",
        };
      case "adaptive":
        return { type: "adaptive" };
      case "disabled":
      default:
        return undefined;
    }
  }

  /**
   * Normalize tool choice to Anthropic format
   */
  private normalizeToolChoice(choice: ChatOptions["toolChoice"]): MessagesRequest["tool_choice"] {
    if (!choice) return undefined;
    if (typeof choice === "string") {
      switch (choice) {
        case "auto":
          return { type: "auto" };
        case "any":
          return { type: "any" };
        case "none":
          return { type: "none" };
        default:
          return { type: "tool", name: choice };
      }
    }
    return choice;
  }

  /**
   * Map SDK streaming events to our event types
   */
  private mapSDKEvent(event: any): StreamEvent {
    // Anthropic SDK returns different event types
    // Map them to our unified StreamEvent format
    switch (event.type) {
      case "message_start":
        return {
          type: "message_start",
          message: event.message,
        };
      case "content_block_start":
        return {
          type: "content_block_start",
          index: event.index,
          content_block: event.content_block,
        };
      case "content_block_delta":
        return {
          type: "content_block_delta",
          index: event.index,
          delta: this.mapDelta(event.delta),
        };
      case "content_block_stop":
        return {
          type: "content_block_stop",
          index: event.index,
        };
      case "message_delta":
        return {
          type: "message_delta",
          usage: event.usage,
        };
      case "message_stop":
        return { type: "message_stop" };
      case "error":
        return {
          type: "error",
          error: { type: event.error?.type || "unknown", message: event.error?.message || "Unknown error" },
        };
      default:
        return { type: "message_stop" }; // Fallback
    }
  }

  /**
   * Map SDK delta to our delta format
   */
  private mapDelta(delta: any): StreamEvent["delta"] {
    if (!delta) return undefined;

    switch (delta.type) {
      case "text_delta":
        return { type: "text_delta", text: delta.text };
      case "thinking_delta":
        return { type: "thinking_delta", thinking: delta.thinking, signature: delta.signature };
      case "tool_use_delta":
        return { type: "tool_use_delta", name: delta.name, input: delta.input };
      default:
        return undefined;
    }
  }
}

/**
 * Factory function for creating adapter with default config
 */
export function createClaudeAdapter(config?: ClaudeAdapterConfig): ClaudeAdapter {
  return new ClaudeAdapter(config);
}

/**
 * Default adapter instance (lazy initialization)
 */
let defaultAdapter: ClaudeAdapter | null = null;

export function getDefaultAdapter(config?: ClaudeAdapterConfig): ClaudeAdapter {
  if (!defaultAdapter || config) {
    defaultAdapter = new ClaudeAdapter(config);
  }
  return defaultAdapter;
}