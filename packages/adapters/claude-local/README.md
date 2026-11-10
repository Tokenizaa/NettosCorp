# Claude Local Adapter

Production-ready Anthropic Claude adapter for the Paperclip platform, implementing the full Messages API with streaming, tools, thinking, and vision support.

## Features

- **Full Messages API Support**: Chat completions with all Anthropic parameters
- **Streaming**: Real-time SSE streaming with event parsing
- **Tool Calling**: Built-in tools (code execution, file ops, web search) + custom tools
- **Thinking/Reasoning**: Support for `thinking` parameter with budget tokens and adaptive mode
- **Vision**: Image input support for multimodal models
- **Model Capabilities**: Automatic capability detection per model (FCC pattern)
- **Error Handling**: Typed errors matching Anthropic API error types
- **Retry Logic**: Exponential backoff with configurable retry policies
- **Token Estimation**: Request token estimation for cost tracking

## Installation

```bash
pnpm add @paperclip/adapter-claude-local
```

## Quick Start

```typescript
import { createClaudeAdapter } from "@paperclip/adapter-claude-local";

const adapter = createClaudeAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: "claude-sonnet-4-6",
});

// Simple chat
const result = await adapter.chat([
  { role: "user", content: "Hello, Claude!" }
]);
console.log(result.message.content[0].text);

// Streaming chat
for await (const event of adapter.streamChat([
  { role: "user", content: "Count to 10" }
])) {
  if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
    process.stdout.write(event.delta.text);
  }
}
```

## Advanced Usage

### With Tools

```typescript
import { BUILTIN_TOOLS } from "@paperclip/adapter-claude-local";

const result = await adapter.chat(
  [{ role: "user", content: "Run python code to calculate fibonacci(10)" }],
  {
    tools: [BUILTIN_TOOLS.code_execution],
    toolChoice: "auto",
  }
);
```

### With Thinking

```typescript
const result = await adapter.chat(
  [{ role: "user", content: "Solve this complex problem step by step" }],
  {
    thinking: { type: "enabled", budgetTokens: 4096 },
    maxTokens: 8192,
  }
);
```

### Streaming with Accumulator

```typescript
const { stream, accumulator } = await adapter.streamChatWithAccumulator([
  { role: "user", content: "Write a long essay" }
], { maxTokens: 8192 });

for await (const event of stream) {
  // Handle events in real-time
}

const completeMessage = accumulator.getResult();
```

## Model Capabilities

The adapter automatically detects model capabilities:

| Model Family | Thinking | Adaptive | Output Effort | Vision | Tools | Max Output |
|--------------|----------|----------|---------------|--------|-------|------------|
| Opus 4.x     | ✅       | ✅       | ✅            | ✅     | ✅    | 128K       |
| Sonnet 4.x   | ✅       | ✅       | ✅            | ✅     | ✅    | 128K       |
| Haiku 4.x    | ✅       | ❌       | ❌            | ✅     | ✅    | 8K         |
| 3.5 Sonnet   | ✅       | ✅       | ✅            | ✅     | ✅    | 8K         |
| 3.x Models   | ❌       | ❌       | ❌            | ✅     | ✅    | 4K         |

## Configuration

```typescript
const adapter = createClaudeAdapter({
  apiKey: "sk-ant-...",           // Required
  workspaceId: "wrkspc_...",      // Optional
  baseURL: "https://api.anthropic.com", // Optional (for proxies)
  timeoutMs: 2147483647,          // Optional
  defaultModel: "claude-sonnet-4-6",    // Optional
  betaHeaders: ["beta-1"],        // Optional
});
```

## Built-in Tools

- `code_execution` - Execute Python/JS/TS/Bash code
- `read_file` - Read file contents
- `write_file` - Write file contents
- `list_directory` - List directory contents
- `glob` - Find files with glob patterns
- `grep` - Search file contents with regex
- `shell` - Execute shell commands
- `web_search` - Search the web
- `web_fetch` - Fetch and extract web content

## Error Handling

```typescript
import {
  AuthenticationError,
  RateLimitError,
  InvalidRequestError,
  isRetryableError,
} from "@paperclip/adapter-claude-local";

try {
  await adapter.chat([{ role: "user", content: "Hello" }]);
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
  } else if (error instanceof RateLimitError) {
    // Handle rate limit (retryable)
  } else if (isRetryableError(error)) {
    // Generic retryable error
  }
}
```

## Architecture

Based on patterns from [free-claude-code](https://github.com/alishahryar1/free-claude-code):

- **Provider Pattern**: Clean abstraction over Anthropic SDK
- **Capability Detection**: Model-specific feature detection (FCC style)
- **Stream Processing**: SSE parsing with typed events
- **Request Normalization**: Input validation and sanitization
- **Retry Logic**: Exponential backoff with jitter

## Testing

```bash
# Unit tests
pnpm test

# Integration tests (requires ANTHROPIC_API_KEY)
ANTHROPIC_API_KEY=xxx pnpm test -- --run integration
```

## License

MIT