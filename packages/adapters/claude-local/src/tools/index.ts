/**
 * Tool Definitions and Execution
 * Tool schema validation and execution utilities
 */

import { z } from "zod";
import type { Tool } from "../models/types";
import type { ToolChoice as ToolChoiceType } from "../models/types";

/**
 * Built-in tool definitions for common operations
 */
export const BUILTIN_TOOLS = {
  /** Execute code in a sandbox */
  code_execution: {
    name: "code_execution",
    description: "Execute code in a sandboxed environment",
    input_schema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Code to execute" },
        language: { type: "string", enum: ["python", "javascript", "typescript", "bash"], default: "python" },
        timeout: { type: "number", default: 30000 },
      },
      required: ["code"],
    },
  } as Tool,

  /** Read file contents */
  read_file: {
    name: "read_file",
    description: "Read contents of a file",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path to read" },
        encoding: { type: "string", default: "utf-8" },
      },
      required: ["path"],
    },
  } as Tool,

  /** Write file contents */
  write_file: {
    name: "write_file",
    description: "Write contents to a file",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "File path to write" },
        content: { type: "string", description: "Content to write" },
        encoding: { type: "string", default: "utf-8" },
      },
      required: ["path", "content"],
    },
  } as Tool,

  /** List directory contents */
  list_directory: {
    name: "list_directory",
    description: "List contents of a directory",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Directory path to list" },
        recursive: { type: "boolean", default: false },
      },
      required: ["path"],
    },
  } as Tool,

  /** Search files with glob pattern */
  glob: {
    name: "glob",
    description: "Find files matching a glob pattern",
    input_schema: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Glob pattern (e.g., '**/*.ts')" },
        path: { type: "string", description: "Base directory for search" },
      },
      required: ["pattern"],
    },
  } as Tool,

  /** Search file contents with regex */
  grep: {
    name: "grep",
    description: "Search file contents with regex pattern",
    input_schema: {
      type: "object",
      properties: {
        pattern: { type: "string", description: "Regex pattern to search" },
        path: { type: "string", description: "Base directory for search" },
        include: { type: "string", description: "File pattern to include" },
      },
      required: ["pattern"],
    },
  } as Tool,

  /** Execute shell command */
  shell: {
    name: "shell",
    description: "Execute a shell command",
    input_schema: {
      type: "object",
      properties: {
        command: { type: "string", description: "Command to execute" },
        cwd: { type: "string", description: "Working directory" },
        timeout: { type: "number", default: 30000 },
      },
      required: ["command"],
    },
  } as Tool,

  /** Web search */
  web_search: {
    name: "web_search",
    description: "Search the web for information",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        max_results: { type: "number", default: 10 },
      },
      required: ["query"],
    },
  } as Tool,

  /** Fetch web page content */
  web_fetch: {
    name: "web_fetch",
    description: "Fetch and extract content from a web page",
    input_schema: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL to fetch" },
        prompt: { type: "string", description: "Extraction prompt" },
      },
      required: ["url"],
    },
  } as Tool,
} as const satisfies Record<string, Tool>;

/**
 * Tool registry for managing available tools
 */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  constructor(builtins: boolean = true) {
    if (builtins) {
      for (const tool of Object.values(BUILTIN_TOOLS)) {
        this.register(tool);
      }
    }
  }

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  getNames(): string[] {
    return Array.from(this.tools.keys());
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Filter tools by name pattern
   */
  filter(pattern: string | RegExp): Tool[] {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
    return this.getAll().filter((t) => regex.test(t.name));
  }
}

/**
 * Validate tool input against schema
 */
export function validateToolInput(tool: Tool, input: unknown): { valid: boolean; error?: string } {
  try {
    // Create a Zod schema from the tool's input_schema
    const schema = jsonSchemaToZod(tool.input_schema);
    schema.parse(input);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") };
    }
    return { valid: false, error: String(error) };
  }
}

/**
 * Convert JSON Schema to Zod schema (simplified)
 */
function jsonSchemaToZod(schema: Tool["input_schema"]): z.ZodTypeAny {
  const { type, properties, required } = schema;
  const schemaType = type as string;
  const requiredFields = required as string[] | undefined;

  if (schemaType === "object" && properties) {
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const [key, prop] of Object.entries(properties)) {
      // Make all fields optional by default (JSON Schema semantics)
      shape[key] = jsonSchemaToZod(prop as Tool["input_schema"]).optional();
    }
    let obj = z.object(shape);
    if (requiredFields && requiredFields.length > 0) {
      // Make required fields required
      const requiredShape = requiredFields.reduce((acc, key) => {
        acc[key] = true as const;
        return acc;
      }, {} as Record<string, true>);
      obj = obj.required(requiredShape);
    }
    return obj;
  }

  if (schemaType === "string") {
    const propSchema = schema as any;
    if (propSchema.enum) return z.enum(propSchema.enum as [string, ...string[]]);
    let str = z.string();
    if (propSchema.format === "date-time") str = str.datetime();
    return str;
  }

  if (schemaType === "number" || schemaType === "integer") {
    const propSchema = schema as any;
    let num = schemaType === "integer" ? z.number().int() : z.number();
    if (propSchema.minimum !== undefined) num = num.min(propSchema.minimum);
    if (propSchema.maximum !== undefined) num = num.max(propSchema.maximum);
    return num;
  }

  if (schemaType === "boolean") return z.boolean();
  if (schemaType === "array") {
    const propSchema = schema as any;
    const items = propSchema.items ? jsonSchemaToZod(propSchema.items as Tool["input_schema"]) : z.unknown();
    return z.array(items);
  }

  return z.unknown();
}

/**
 * Tool choice helpers
 */
export const ToolChoiceUtils = {
  auto: () => ({ type: "auto" as const }),
  any: () => ({ type: "any" as const }),
  tool: (name: string) => ({ type: "tool" as const, name }),
  none: () => ({ type: "none" as const }),

  fromString(choice: string | undefined): ToolChoiceType {
    switch (choice?.toLowerCase()) {
      case "auto":
        return this.auto();
      case "any":
        return this.any();
      case "none":
        return this.none();
      default:
        if (choice) return this.tool(choice);
        return this.auto();
    }
  },
} as const;