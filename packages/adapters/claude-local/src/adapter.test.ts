/**
 * Claude Adapter Tests
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClaudeAdapter } from "./adapter";
import type { ModelCapabilities } from "./models/types";
import { getModelCapabilities, ANTHROPIC_MODELS } from "./models/types";
import { buildHeaders, normalizeMessagesRequest, estimateRequestTokens } from "./utils";
import { ToolRegistry, BUILTIN_TOOLS, validateToolInput } from "./tools";
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

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ClaudeAdapter", () => {
  let adapter: ClaudeAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new ClaudeAdapter({
      apiKey: "test-api-key",
      defaultModel: "claude-sonnet-4-6",
    });
  });

  describe("Model Capabilities", () => {
    it("should return correct capabilities for known models", () => {
      const caps = getModelCapabilities("claude-sonnet-4-6");
      expect(caps.thinking).toBe(true);
      expect(caps.adaptiveThinking).toBe(true);
      expect(caps.outputEffort).toBe(true);
      expect(caps.vision).toBe(true);
      expect(caps.toolUse).toBe(true);
      expect(caps.family).toBe("sonnet");
    });

    it("should infer capabilities for unknown opus models", () => {
      const caps = getModelCapabilities("claude-opus-5-0");
      expect(caps.family).toBe("opus");
      expect(caps.thinking).toBe(true);
    });

    it("should infer capabilities for unknown sonnet models", () => {
      const caps = getModelCapabilities("claude-sonnet-5-0");
      expect(caps.family).toBe("sonnet");
    });

    it("should infer capabilities for unknown haiku models", () => {
      const caps = getModelCapabilities("claude-haiku-5-0");
      expect(caps.family).toBe("haiku");
    });

    it("should list all known models", () => {
      expect(ANTHROPIC_MODELS.length).toBeGreaterThan(10);
      expect(ANTHROPIC_MODELS).toContain("claude-sonnet-4-6");
      expect(ANTHROPIC_MODELS).toContain("claude-opus-4-6");
      expect(ANTHROPIC_MODELS).toContain("claude-haiku-4-5");
    });
  });

  describe("Headers", () => {
    it("should build correct headers", () => {
      const headers = buildHeaders("test-key", {
        workspaceId: "workspace-123",
        betaHeaders: ["beta-1", "beta-2"],
      });

      expect(headers["Authorization"]).toBe("Bearer test-key");
      expect(headers["anthropic-version"]).toBe("2023-06-01");
      expect(headers["anthropic-workspace-id"]).toBe("workspace-123");
      expect(headers["anthropic-beta"]).toBe("beta-1,beta-2");
      expect(headers["content-type"]).toBe("application/json");
    });
  });

  describe("Request Normalization", () => {
    it("should normalize string system to array", () => {
      const request = normalizeMessagesRequest({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello" }],
        system: "You are helpful",
      });

      expect(Array.isArray(request.system)).toBe(true);
      expect(request.system).toHaveLength(1);
      expect(request.system![0]).toEqual({ type: "text", text: "You are helpful" });
    });

    it("should set default max_tokens if missing", () => {
      const request = normalizeMessagesRequest({
        model: "claude-sonnet-4-6",
        max_tokens: 0,
        messages: [{ role: "user", content: "Hello" }],
      });

      expect(request.max_tokens).toBeGreaterThan(0);
    });

    it("should disable thinking for models that don't support it", () => {
      const request = normalizeMessagesRequest({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello" }],
        thinking: { type: "enabled", budget_tokens: 2000 },
      });

      expect(request.thinking).toEqual({ type: "disabled" });
    });

    it("should validate thinking budget tokens", () => {
      const request = normalizeMessagesRequest({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello" }],
        thinking: { type: "enabled", budget_tokens: 100 }, // Too low
      });

      expect(request.thinking).toEqual({ type: "enabled", budget_tokens: 1024 });
    });
  });

  describe("Token Estimation", () => {
    it("should estimate tokens for simple request", () => {
      const tokens = estimateRequestTokens({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello world" }],
        system: "You are helpful",
      });

      expect(tokens).toBeGreaterThan(0);
    });

    it("should include tool tokens in estimate", () => {
      const tokensWithTools = estimateRequestTokens({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello" }],
        tools: [{ name: "test", description: "Test", input_schema: { type: "object", properties: {} } }],
      });

      const tokensWithoutTools = estimateRequestTokens({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: "Hello" }],
      });

      expect(tokensWithTools).toBeGreaterThan(tokensWithoutTools);
    });
  });

  describe("Tool Registry", () => {
    it("should have built-in tools", () => {
      const registry = new ToolRegistry(true);
      expect(registry.has("code_execution")).toBe(true);
      expect(registry.has("read_file")).toBe(true);
      expect(registry.has("write_file")).toBe(true);
      expect(registry.has("glob")).toBe(true);
      expect(registry.has("grep")).toBe(true);
      expect(registry.has("shell")).toBe(true);
      expect(registry.has("web_search")).toBe(true);
      expect(registry.has("web_fetch")).toBe(true);
    });

    it("should allow custom tool registration", () => {
      const registry = new ToolRegistry(false);
      const customTool = {
        name: "custom_tool",
        description: "Custom tool",
        input_schema: {
          type: "object" as const,
          properties: {},
          required: [],
        },
      };
      registry.register(customTool);
      expect(registry.has("custom_tool")).toBe(true);
      expect(registry.get("custom_tool")).toEqual(customTool);
    });

    it("should filter tools by pattern", () => {
      const registry = new ToolRegistry(true);
      const fileTools = registry.filter(/file/);
      expect(fileTools.map((t) => t.name)).toContain("read_file");
      expect(fileTools.map((t) => t.name)).toContain("write_file");
    });
  });

  describe("Tool Validation", () => {
    it("should validate correct input", () => {
      const tool = BUILTIN_TOOLS.read_file;
      const result = validateToolInput(tool, { path: "/test/file.txt" });
      expect(result.valid).toBe(true);
    });

    it("should reject missing required fields", () => {
      const tool = BUILTIN_TOOLS.read_file;
      const result = validateToolInput(tool, {});
      expect(result.valid).toBe(false);
      expect(result.error).toContain("path");
    });

    it("should reject invalid types", () => {
      const tool = BUILTIN_TOOLS.shell;
      const result = validateToolInput(tool, { command: 123 });
      expect(result.valid).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should create correct error types", () => {
      const authError = createErrorFromResponse(401, { type: "authentication_error", message: "Invalid API key" });
      expect(authError).toBeInstanceOf(AuthenticationError);

      const rateError = createErrorFromResponse(429, { type: "rate_limit_error", message: "Rate limited" });
      expect(rateError).toBeInstanceOf(RateLimitError);

      const invalidError = createErrorFromResponse(400, { type: "invalid_request_error", message: "Bad request" });
      expect(invalidError).toBeInstanceOf(InvalidRequestError);

      const serverError = createErrorFromResponse(500, { type: "server_error", message: "Internal error" });
      expect(serverError).toBeInstanceOf(ServerError);

      const overloadError = createErrorFromResponse(529, { type: "overloaded_error", message: "Overloaded" });
      expect(overloadError).toBeInstanceOf(OverloadedError);
    });

    it("should identify retryable errors", () => {
      expect(isRetryableError(new RateLimitError("rate limited"))).toBe(true);
      expect(isRetryableError(new ServerError("server error"))).toBe(true);
      expect(isRetryableError(new OverloadedError("overloaded"))).toBe(true);
      expect(isRetryableError(new AuthenticationError("unauthorized"))).toBe(false);
      expect(isRetryableError(new InvalidRequestError("bad request"))).toBe(false);
    });
  });

  describe("Feature Support", () => {
    it("should correctly report thinking support", () => {
      expect(adapter.supports("claude-sonnet-4-6", "thinking")).toBe(true);
      expect(adapter.supports("claude-3-haiku-20240307", "thinking")).toBe(false);
    });

    it("should correctly report adaptive thinking support", () => {
      expect(adapter.supports("claude-sonnet-4-6", "adaptiveThinking")).toBe(true);
      expect(adapter.supports("claude-3-5-sonnet-20240620", "adaptiveThinking")).toBe(false);
    });

    it("should correctly report output effort support", () => {
      expect(adapter.supports("claude-sonnet-4-6", "outputEffort")).toBe(true);
      expect(adapter.supports("claude-3-5-sonnet-20240620", "outputEffort")).toBe(false);
    });

    it("should correctly report vision support", () => {
      expect(adapter.supports("claude-sonnet-4-6", "vision")).toBe(true);
      expect(adapter.supports("claude-3-haiku-20240307", "vision")).toBe(true);
    });

    it("should correctly report tool use support", () => {
      expect(adapter.supports("claude-sonnet-4-6", "toolUse")).toBe(true);
      expect(adapter.supports("claude-3-haiku-20240307", "toolUse")).toBe(true);
    });
  });
});

describe("Integration Tests (require API key)", () => {
  // These tests require a real API key and are skipped by default
  // Run with: ANTHROPIC_API_KEY=xxx pnpm test -- --run integration
  it.skip("should complete a simple chat", async () => {
    const adapter = new ClaudeAdapter({ defaultModel: "claude-haiku-4-5" });
    const result = await adapter.chat([{ role: "user", content: "Say hello" }], { maxTokens: 50 });
    expect(result.message.content).toBeDefined();
    expect(result.usage.inputTokens).toBeGreaterThan(0);
  });

  it.skip("should stream a chat", async () => {
    const adapter = new ClaudeAdapter({ defaultModel: "claude-haiku-4-5" });
    const events: any[] = [];
    for await (const event of adapter.streamChat([{ role: "user", content: "Count to 3" }], { maxTokens: 50 })) {
      events.push(event);
    }
    expect(events.length).toBeGreaterThan(0);
    expect(events.some((e) => e.type === "message_start")).toBe(true);
    expect(events.some((e) => e.type === "message_stop")).toBe(true);
  });

  it.skip("should use tools", async () => {
    const adapter = new ClaudeAdapter({ defaultModel: "claude-sonnet-4-6" });
    const result = await adapter.chat(
      [{ role: "user", content: "What's 2+2? Use the code_execution tool." }],
      {
        tools: [BUILTIN_TOOLS.code_execution],
        toolChoice: "auto",
      },
    );
    expect(result.message.stop_reason).toBe("tool_use");
  });
});