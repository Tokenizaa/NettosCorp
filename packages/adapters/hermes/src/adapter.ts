/**
 * Hermes Adapter - Enhanced with FCC Patterns
 * Universal AI provider adapter with fallback chains, health checks, and model routing
 */

import { ProviderRegistry, getProviderRegistry, type ProviderConfig, type ModelRoutingConfig } from "./shared/provider-registry";
import { detectProviderByModelPrefix, type ValidProvider } from "./shared/constants";
import { AI_PROVIDER_CAPABILITIES, getProviderEnvKey } from "@paperclip/shared";

/**
 * Hermes Adapter Configuration
 */
export interface HermesAdapterConfig {
  /** Custom provider configurations */
  providers?: Partial<Record<ValidProvider, Partial<ProviderConfig>>>;
  /** Custom model routing */
  routing?: Partial<ModelRoutingConfig>;
  /** Enable automatic fallback on errors */
  autoFallback?: boolean;
  /** Enable health checks */
  healthChecks?: boolean;
  /** Health check interval (ms) */
  healthCheckInterval?: number;
  /** Default tier for model selection */
  defaultTier?: "fable" | "opus" | "sonnet" | "haiku";
  /** Request timeout (ms) */
  timeoutMs?: number;
}

/**
 * Chat completion request (provider-agnostic)
 */
export interface HermesChatRequest {
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  model?: string;
  tier?: "fable" | "opus" | "sonnet" | "haiku";
  maxTokens?: number;
  temperature?: number;
  tools?: Array<{ name: string; description?: string; parameters: Record<string, unknown> }>;
  toolChoice?: "auto" | "any" | "none" | { type: "tool"; name: string };
  thinking?: { type: "enabled" | "adaptive" | "disabled"; budgetTokens?: number };
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Chat completion response
 */
export interface HermesChatResponse {
  id: string;
  model: string;
  provider: ValidProvider;
  content: string;
  reasoning?: string;
  toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  finishReason: "stop" | "length" | "tool_calls" | "error";
  fallbackUsed?: boolean;
  fallbackFrom?: string;
}

/**
 * Streaming event
 */
export interface HermesStreamEvent {
  type: "content" | "reasoning" | "tool_call" | "done" | "error";
  content?: string;
  reasoning?: string;
  toolCall?: { name: string; arguments: Record<string, unknown> };
  error?: string;
  usage?: { inputTokens: number; outputTokens: number };
}

/**
 * Main Hermes Adapter Class
 */
export class HermesAdapter {
  private registry: ProviderRegistry;
  private config: Required<HermesAdapterConfig>;
  private providerClients: Map<ValidProvider, any> = new Map();

  constructor(config: HermesAdapterConfig = {}) {
    this.config = {
      providers: config.providers || {},
      routing: config.routing || {},
      autoFallback: config.autoFallback ?? true,
      healthChecks: config.healthChecks ?? true,
      healthCheckInterval: config.healthCheckInterval || 60000,
      defaultTier: config.defaultTier || "sonnet",
      timeoutMs: config.timeoutMs || 2147483647,
    };

    this.registry = getProviderRegistry(this.config.providers, this.config.routing);
  }

  /**
   * Get provider registry
   */
  getRegistry(): ProviderRegistry {
    return this.registry;
  }

  /**
   * Initialize provider clients
   */
  async initialize(): Promise<void> {
    const configured = this.registry.getConfiguredProviders();

    for (const providerConfig of configured) {
      await this.initProviderClient(providerConfig.id);
    }

    // Start health check interval
    if (this.config.healthChecks) {
      this.startHealthChecks();
    }
  }

  /**
   * Initialize a specific provider client
   */
  private async initProviderClient(provider: ValidProvider): Promise<void> {
    const providerConfig = this.registry.getConfig(provider);
    if (!providerConfig) return;

    const apiKey = process.env[providerConfig.apiKeyEnv];
    if (!apiKey) return;

    try {
      let client: any;

      switch (provider) {
        case "anthropic":
          const { default: Anthropic } = await import("@anthropic-ai/sdk");
          client = new Anthropic({
            apiKey,
            baseURL: providerConfig.baseURL,
            timeout: this.config.timeoutMs,
          });
          break;

        case "openai":
          const { default: OpenAI } = await import("openai");
          client = new OpenAI({
            apiKey,
            baseURL: providerConfig.baseURL,
            timeout: this.config.timeoutMs,
          });
          break;

        case "google":
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          client = new GoogleGenerativeAI(apiKey);
          break;

        case "cohere":
          const { CohereClient } = await import("cohere-ai");
          client = new CohereClient({ token: apiKey });
          break;

        case "nvidia":
          const { default: NvidiaOpenAI } = await import("openai");
          client = new NvidiaOpenAI({
            apiKey,
            baseURL: providerConfig.baseURL,
            timeout: this.config.timeoutMs,
          });
          break;

        default:
          return;
      }

      this.providerClients.set(provider, client);
    } catch (error) {
      console.warn(`Failed to initialize ${provider} client:`, error);
    }
  }

  /**
   * Send chat completion with automatic fallback
   */
  async chat(request: HermesChatRequest): Promise<HermesChatResponse> {
    // Determine model and provider
    const { model, provider, tier } = this.resolveModelAndProvider(request);

    // Try primary provider
    try {
      return await this.executeChat(provider, model, request);
    } catch (error) {
      if (!this.config.autoFallback) throw error;

      // Try fallback chain
      const fallbackChain = this.registry.getFallbackChain(model);
      for (const fallbackModel of fallbackChain) {
        if (fallbackModel === model) continue;

        const fallbackProvider = this.registry.detectProvider(fallbackModel);
        if (!fallbackProvider) continue;

        try {
          const response = await this.executeChat(fallbackProvider, fallbackModel, request);
          return {
            ...response,
            fallbackUsed: true,
            fallbackFrom: model,
          };
        } catch {
          // Continue to next fallback
          continue;
        }
      }

      // All fallbacks exhausted
      throw error;
    }
  }

  /**
   * Stream chat completion
   */
  async *streamChat(request: HermesChatRequest): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const { model, provider } = this.resolveModelAndProvider(request);

    try {
      yield* this.executeStreamChat(provider, model, request);
    } catch (error) {
      if (!this.config.autoFallback) {
        yield { type: "error", error: String(error) };
        return;
      }

      // Try fallbacks
      const fallbackChain = this.registry.getFallbackChain(model);
      for (const fallbackModel of fallbackChain) {
        if (fallbackModel === model) continue;

        const fallbackProvider = this.registry.detectProvider(fallbackModel);
        if (!fallbackProvider) continue;

        try {
          yield* this.executeStreamChat(fallbackProvider, fallbackModel, request);
          return;
        } catch {
          continue;
        }
      }

      yield { type: "error", error: "All providers failed" };
    }
  }

  /**
   * List available models across all providers
   */
  async listModels(): Promise<Array<{ id: string; provider: ValidProvider; name: string }>> {
    const models: Array<{ id: string; provider: ValidProvider; name: string }> = [];

    for (const providerConfig of this.registry.getEnabledProviders()) {
      if (!this.registry.isProviderConfigured(providerConfig.id)) continue;

      for (const modelId of providerConfig.models) {
        models.push({
          id: modelId,
          provider: providerConfig.id,
          name: `${providerConfig.name} - ${modelId}`,
        });
      }
    }

    return models;
  }

  /**
   * Get provider status
   */
  async getProviderStatus(): Promise<
    Array<{ provider: ValidProvider; name: string; configured: boolean; healthy: boolean; models: number }>
  > {
    const statuses = [];

    for (const providerConfig of this.registry.getEnabledProviders()) {
      const configured = this.registry.isProviderConfigured(providerConfig.id);
      let healthy = false;

      if (configured && this.config.healthChecks) {
        healthy = await this.registry.checkHealth(providerConfig.id);
      }

      statuses.push({
        provider: providerConfig.id,
        name: providerConfig.name,
        configured,
        healthy,
        models: providerConfig.models.length,
      });
    }

    return statuses;
  }

  /**
   * Resolve model and provider from request
   */
  private resolveModelAndProvider(request: HermesChatRequest): {
    model: string;
    provider: ValidProvider;
    tier: "fable" | "opus" | "sonnet" | "haiku";
  } {
    let model = request.model;
    let provider: ValidProvider | undefined;
    const tier = request.tier || this.config.defaultTier;

    if (!model) {
      // Use tier-based model selection
      model = this.registry.getModelForTier(tier);
      provider = this.registry.detectProvider(model);
    } else {
      provider = this.registry.detectProvider(model);
      if (!provider) {
        // Try prefix detection
        const detected = detectProviderByModelPrefix(model);
        if (detected && this.registry.getConfig(detected as ValidProvider)) {
          provider = detected as ValidProvider;
        }
      }
    }

    if (!provider) {
      // Ultimate fallback to first configured provider
      const configured = this.registry.getConfiguredProviders();
      if (configured.length === 0) {
        throw new Error("No AI providers configured. Set API keys in environment.");
      }
      const firstProvider = configured[0];
      if (!firstProvider) {
        throw new Error("No AI providers configured. Set API keys in environment.");
      }
      provider = firstProvider.id;
      model = this.registry.getModelForTier(tier);
    }

    return { model, provider, tier };
  }

  /**
   * Execute chat on specific provider
   */
  private async executeChat(
    provider: ValidProvider,
    model: string,
    request: HermesChatRequest,
  ): Promise<HermesChatResponse> {
    const client = this.providerClients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not initialized`);
    }

    switch (provider) {
      case "anthropic":
        return this.executeAnthropicChat(client, model, request);
      case "openai":
      case "nvidia":
        return this.executeOpenAIChat(client, model, request);
      case "google":
        return this.executeGoogleChat(client, model, request);
      case "cohere":
        return this.executeCohereChat(client, model, request);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Execute streaming chat on specific provider
   */
  private async *executeStreamChat(
    provider: ValidProvider,
    model: string,
    request: HermesChatRequest,
  ): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const client = this.providerClients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not initialized`);
    }

    switch (provider) {
      case "anthropic":
        yield* this.executeAnthropicStreamChat(client, model, request);
        break;
      case "openai":
      case "nvidia":
        yield* this.executeOpenAIStreamChat(client, model, request);
        break;
      case "google":
        yield* this.executeGoogleStreamChat(client, model, request);
        break;
      case "cohere":
        yield* this.executeCohereStreamChat(client, model, request);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  // Provider-specific implementations

  private async executeAnthropicChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): Promise<HermesChatResponse> {
    const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const system = request.messages.find((m) => m.role === "system")?.content;

    const response = await client.messages.create({
      model,
      max_tokens: request.maxTokens || 4096,
      messages,
      system,
      temperature: request.temperature,
      tools: request.tools?.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      })),
      tool_choice: request.toolChoice,
      thinking: request.thinking
        ? request.thinking.type === "enabled"
          ? { type: "enabled", budget_tokens: request.thinking.budgetTokens || 2048 }
          : request.thinking.type === "adaptive"
          ? { type: "adaptive" }
          : undefined
        : undefined,
      stream: false,
    });

    const content = response.content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("");

    const reasoning = response.content
      .filter((c: any) => c.type === "thinking")
      .map((c: any) => c.thinking)
      .join("");

    const toolCalls = response.content
      .filter((c: any) => c.type === "tool_use")
      .map((c: any) => ({ name: c.name, arguments: c.input }));

    return {
      id: response.id,
      model,
      provider: "anthropic",
      content,
      reasoning: reasoning || undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      finishReason: response.stop_reason === "tool_use" ? "tool_calls" : "stop",
    };
  }

  private async *executeAnthropicStreamChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const system = request.messages.find((m) => m.role === "system")?.content;

    const stream = await client.messages.stream({
      model,
      max_tokens: request.maxTokens || 4096,
      messages,
      system,
      temperature: request.temperature,
      tools: request.tools?.map((t) => ({
        name: t.name,
        description: t.description,
        input_schema: t.parameters,
      })),
      tool_choice: request.toolChoice,
      thinking: request.thinking
        ? request.thinking.type === "enabled"
          ? { type: "enabled", budget_tokens: request.thinking.budgetTokens || 2048 }
          : request.thinking.type === "adaptive"
          ? { type: "adaptive" }
          : undefined
        : undefined,
    });

    for await (const event of stream) {
      switch (event.type) {
        case "content_block_delta":
          if (event.delta.type === "text_delta") {
            yield { type: "content", content: event.delta.text };
          } else if (event.delta.type === "thinking_delta") {
            yield { type: "reasoning", reasoning: event.delta.thinking };
          }
          break;
        case "content_block_start":
          if (event.content_block.type === "tool_use") {
            yield { type: "tool_call", toolCall: { name: event.content_block.name, arguments: {} } };
          }
          break;
        case "message_stop":
          yield { type: "done", usage: { inputTokens: 0, outputTokens: 0 } };
          break;
      }
    }
  }

  private async executeOpenAIChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): Promise<HermesChatResponse> {
    const messages = request.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.chat.completions.create({
      model,
      max_tokens: request.maxTokens || 4096,
      messages,
      temperature: request.temperature,
      tools: request.tools?.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      })),
      tool_choice: request.toolChoice,
      stream: false,
    });

    const choice = response.choices[0];

    return {
      id: response.id,
      model,
      provider: "openai",
      content: choice.message.content || "",
      toolCalls: choice.message.tool_calls?.map((tc: any) => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments),
      })),
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      finishReason: choice.finish_reason === "tool_calls" ? "tool_calls" : "stop",
    };
  }

  private async *executeOpenAIStreamChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const messages = request.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const stream = await client.chat.completions.create({
      model,
      max_tokens: request.maxTokens || 4096,
      messages,
      temperature: request.temperature,
      tools: request.tools?.map((t) => ({
        type: "function",
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      })),
      tool_choice: request.toolChoice,
      stream: true,
    });

    for await (const chunk of stream) {
      const choice = chunk.choices[0];
      if (choice.delta.content) {
        yield { type: "content", content: choice.delta.content };
      }
      if (choice.delta.tool_calls) {
        for (const tc of choice.delta.tool_calls) {
          yield { type: "tool_call", toolCall: { name: tc.function?.name || "", arguments: {} } };
        }
      }
      if (choice.finish_reason) {
        yield { type: "done", usage: { inputTokens: 0, outputTokens: 0 } };
      }
    }
  }

  private async executeGoogleChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): Promise<HermesChatResponse> {
    const genModel = client.getGenerativeModel({ model });

    const messages = request.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const result = await genModel.generateContent({
      contents: messages,
      generationConfig: {
        maxOutputTokens: request.maxTokens || 4096,
        temperature: request.temperature,
      },
    });

    const response = result.response;

    return {
      id: `google-${Date.now()}`,
      model,
      provider: "google",
      content: response.text(),
      usage: {
        inputTokens: response.usageMetadata?.promptTokenCount || 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata?.totalTokenCount || 0,
      },
      finishReason: "stop",
    };
  }

  private async *executeGoogleStreamChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const genModel = client.getGenerativeModel({ model });

    const messages = request.messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const result = await genModel.generateContentStream({
      contents: messages,
      generationConfig: {
        maxOutputTokens: request.maxTokens || 4096,
        temperature: request.temperature,
      },
    });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield { type: "content", content: text };
    }

    yield { type: "done", usage: { inputTokens: 0, outputTokens: 0 } };
  }

  private async executeCohereChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): Promise<HermesChatResponse> {
    const response = await client.chat({
      model,
      message: request.messages[request.messages.length - 1]?.content || "",
      chatHistory: request.messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "CHATBOT" : "USER",
        message: m.content,
      })),
      maxTokens: request.maxTokens || 4096,
      temperature: request.temperature,
    });

    return {
      id: `cohere-${Date.now()}`,
      model,
      provider: "cohere",
      content: response.text,
      usage: {
        inputTokens: response.meta?.tokens?.inputTokens || 0,
        outputTokens: response.meta?.tokens?.outputTokens || 0,
        totalTokens: (response.meta?.tokens?.inputTokens || 0) + (response.meta?.tokens?.outputTokens || 0),
      },
      finishReason: "stop",
    };
  }

  private async *executeCohereStreamChat(
    client: any,
    model: string,
    request: HermesChatRequest,
  ): AsyncGenerator<HermesStreamEvent, void, unknown> {
    const stream = client.chatStream({
      model,
      message: request.messages[request.messages.length - 1]?.content || "",
      chatHistory: request.messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "CHATBOT" : "USER",
        message: m.content,
      })),
      maxTokens: request.maxTokens || 4096,
      temperature: request.temperature,
    });

    for await (const chunk of stream) {
      if (chunk.eventType === "text-generation") {
        yield { type: "content", content: chunk.text };
      }
    }

    yield { type: "done", usage: { inputTokens: 0, outputTokens: 0 } };
  }

  // Health checks

  private healthCheckInterval: NodeJS.Timeout | null = null;

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const providerConfig of this.registry.getConfiguredProviders()) {
        await this.registry.checkHealth(providerConfig.id);
      }
    }, this.config.healthCheckInterval);
  }

  /**
   * Stop health checks and cleanup
   */
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

/**
 * Factory function
 */
export function createHermesAdapter(config?: HermesAdapterConfig): HermesAdapter {
  return new HermesAdapter(config);
}

/**
 * Default adapter instance
 */
let defaultHermesAdapter: HermesAdapter | null = null;

export function getDefaultHermesAdapter(config?: HermesAdapterConfig): HermesAdapter {
  if (!defaultHermesAdapter || config) {
    defaultHermesAdapter = new HermesAdapter(config);
  }
  return defaultHermesAdapter;
}