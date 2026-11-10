/**
 * Streaming Utilities
 * SSE parsing and stream handling following FCC patterns
 */

import type { StreamEvent, StreamEventType } from "../models/types";

/**
 * Parse SSE stream into events
 */
export async function* parseSSEStream(
  response: Response,
): AsyncGenerator<StreamEvent, void, unknown> {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const event = parseSSELine(line);
        if (event) yield event;
      }
    }

    // Process remaining buffer
    if (buffer.trim()) {
      const event = parseSSELine(buffer);
      if (event) yield event;
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Parse a single SSE line
 */
function parseSSELine(line: string): StreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith("data:")) return null;

  const data = trimmed.slice(5).trim();
  if (data === "[DONE]") return null;

  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null;
  }
}

/**
 * Stream event handlers for different event types
 */
export interface StreamHandlers {
  onMessageStart?: (event: StreamEvent) => void | Promise<void>;
  onContentBlockStart?: (event: StreamEvent) => void | Promise<void>;
  onContentBlockDelta?: (event: StreamEvent) => void | Promise<void>;
  onContentBlockStop?: (event: StreamEvent) => void | Promise<void>;
  onMessageDelta?: (event: StreamEvent) => void | Promise<void>;
  onMessageStop?: (event: StreamEvent) => void | Promise<void>;
  onError?: (event: StreamEvent) => void | Promise<void>;
}

/**
 * Process stream with typed handlers
 */
export async function processStream(
  response: Response,
  handlers: StreamHandlers,
): Promise<void> {
  for await (const event of parseSSEStream(response)) {
    switch (event.type) {
      case "message_start":
        await handlers.onMessageStart?.(event);
        break;
      case "content_block_start":
        await handlers.onContentBlockStart?.(event);
        break;
      case "content_block_delta":
        await handlers.onContentBlockDelta?.(event);
        break;
      case "content_block_stop":
        await handlers.onContentBlockStop?.(event);
        break;
      case "message_delta":
        await handlers.onMessageDelta?.(event);
        break;
      case "message_stop":
        await handlers.onMessageStop?.(event);
        break;
      case "error":
        await handlers.onError?.(event);
        break;
    }
  }
}

/**
 * Accumulate streaming response into complete message
 */
export interface AccumulatedMessage {
  id: string;
  role: "assistant";
  content: Array<{
    type: "text" | "thinking" | "tool_use";
    text?: string;
    thinking?: string;
    signature?: string;
    id?: string;
    name?: string;
    input?: Record<string, unknown>;
  }>;
  model: string;
  stopReason: string | null;
  stopSequence: string | null;
  usage: {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens: number;
    cacheReadInputTokens: number;
  };
}

export function createAccumulator(): {
  handlers: StreamHandlers;
  getResult: () => AccumulatedMessage | null;
} {
  let message: AccumulatedMessage | null = null;
  let currentBlockIndex = -1;
  let currentBlock: AccumulatedMessage["content"][0] | null = null;

  const handlers: StreamHandlers = {
    onMessageStart: (event) => {
      if (event.message) {
        message = {
          id: event.message.id,
          role: "assistant",
          content: [],
          model: event.message.model,
          stopReason: event.message.stop_reason,
          stopSequence: event.message.stop_sequence,
          usage: {
            inputTokens: event.message.usage.input_tokens,
            outputTokens: event.message.usage.output_tokens,
            cacheCreationInputTokens: event.message.usage.cache_creation_input_tokens || 0,
            cacheReadInputTokens: event.message.usage.cache_read_input_tokens || 0,
          },
        };
      }
    },
    onContentBlockStart: (event) => {
      if (!message || !event.content_block) return;
      currentBlockIndex = event.index ?? message.content.length;
      currentBlock = {
        type: event.content_block.type === "thinking" ? "thinking" :
              event.content_block.type === "tool_use" ? "tool_use" : "text",
      };
      if (event.content_block.type === "tool_use") {
        currentBlock.id = event.content_block.id;
        currentBlock.name = event.content_block.name;
        currentBlock.input = {};
      }
    },
    onContentBlockDelta: (event) => {
      if (!message || !currentBlock || !event.delta) return;

      if (event.delta.type === "text_delta") {
        currentBlock.text = (currentBlock.text || "") + event.delta.text;
      } else if (event.delta.type === "thinking_delta") {
        currentBlock.thinking = (currentBlock.thinking || "") + event.delta.thinking;
        if (event.delta.signature) currentBlock.signature = event.delta.signature;
      } else if (event.delta.type === "tool_use_delta") {
        // Tool input comes as JSON string chunks
        const existing = currentBlock.input || {};
        try {
          const chunk = JSON.parse(event.delta.input);
          currentBlock.input = { ...existing, ...chunk };
        } catch {
          // Ignore partial JSON
        }
      }
    },
    onContentBlockStop: () => {
      if (message && currentBlock) {
        message.content[currentBlockIndex] = currentBlock;
        currentBlock = null;
        currentBlockIndex = -1;
      }
    },
    onMessageDelta: (event) => {
      if (!message) return;
      if (event.usage) {
        message.usage.outputTokens = event.usage.output_tokens;
      }
    },
    onMessageStop: (event) => {
      if (message && event.usage) {
        message.usage.outputTokens = event.usage.output_tokens;
      }
    },
  };

  return {
    handlers,
    getResult: () => message,
  };
}