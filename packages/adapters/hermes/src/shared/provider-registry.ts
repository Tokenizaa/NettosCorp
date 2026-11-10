/**
 * Enhanced Provider Registry for Hermes Adapter
 * Incorporates FCC patterns for provider management, fallback chains, and model routing
 */

import { VALID_PROVIDERS, detectProviderByModelPrefix, type ValidProvider } from "./constants";
import { AI_PROVIDER_CAPABILITIES, type AIProvider, getProviderEnvKey } from "@paperclip/shared";

/**
 * Provider configuration with FCC-style fallback chains
 */
export interface ProviderConfig {
  id: ValidProvider;
  name: string;
  enabled: boolean;
  priority: number;
  apiKeyEnv: string;
  baseURL?: string;
  models: string[];
  fallbackProviders: ValidProvider[];
  capabilities: {
    streaming: boolean;
    tools: boolean;
    thinking: boolean;
    vision: boolean;
  };
}

/**
 * Model routing configuration (FCC pattern)
 */
export interface ModelRoutingConfig {
  /** Tier-specific model overrides */
  tierOverrides: {
    fable?: string;      // Most capable - opus equivalent
    opus?: string;       // High capability
    sonnet?: string;     // Balanced
    haiku?: string;      // Fast/cheap
  };
  /** Ordered fallback list per tier */
  fallbacks: {
    fable: string[];
    opus: string[];
    sonnet: string[];
    haiku: string[];
  };
  /** Per-fallback reasoning effort */
  reasoningEffort: Record<string, "low" | "medium" | "high">;
}

/**
 * Default provider configurations
 */
export const DEFAULT_PROVIDER_CONFIGS: Record<ValidProvider, ProviderConfig> = {
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    enabled: true,
    priority: 10,
    apiKeyEnv: "ANTHROPIC_API_KEY",
    baseURL: "https://api.anthropic.com",
    models: [
      "claude-opus-4-6",
      "claude-sonnet-4-6",
      "claude-haiku-4-5",
      "claude-3-5-sonnet-20241022",
      "claude-3-opus-20240229",
    ],
    fallbackProviders: ["openai", "google"],
    capabilities: {
      streaming: true,
      tools: true,
      thinking: true,
      vision: true,
    },
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    enabled: true,
    priority: 20,
    apiKeyEnv: "OPENAI_API_KEY",
    baseURL: "https://api.openai.com/v1",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
    fallbackProviders: ["anthropic", "google"],
    capabilities: {
      streaming: true,
      tools: true,
      thinking: false,
      vision: true,
    },
  },
  google: {
    id: "google",
    name: "Google",
    enabled: true,
    priority: 30,
    apiKeyEnv: "GOOGLE_API_KEY",
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-1.0-pro"],
    fallbackProviders: ["anthropic", "openai"],
    capabilities: {
      streaming: true,
      tools: true,
      thinking: false,
      vision: true,
    },
  },
  cohere: {
    id: "cohere",
    name: "Cohere",
    enabled: false,
    priority: 40,
    apiKeyEnv: "COHERE_API_KEY",
    baseURL: "https://api.cohere.ai/v1",
    models: ["command-r-plus", "command-r", "command"],
    fallbackProviders: ["anthropic", "openai"],
    capabilities: {
      streaming: true,
      tools: true,
      thinking: false,
      vision: false,
    },
  },
  nvidia: {
    id: "nvidia",
    name: "NVIDIA NIM",
    enabled: false,
    priority: 50,
    apiKeyEnv: "NVIDIA_API_KEY",
    baseURL: "https://integrate.api.nvidia.com/v1",
    models: ["nemotron-3-ultra", "nemotron-4-340b"],
    fallbackProviders: ["openai", "anthropic"],
    capabilities: {
      streaming: true,
      tools: true,
      thinking: false,
      vision: false,
    },
  },
};

/**
 * Default model routing (FCC pattern)
 */
export const DEFAULT_MODEL_ROUTING: ModelRoutingConfig = {
  tierOverrides: {
    fable: "claude-opus-4-6",
    opus: "claude-opus-4-6",
    sonnet: "claude-sonnet-4-6",
    haiku: "claude-haiku-4-5",
  },
  fallbacks: {
    fable: ["claude-opus-4-6", "claude-sonnet-4-6", "gpt-4o", "gemini-1.5-pro"],
    opus: ["claude-opus-4-6", "claude-sonnet-4-6", "gpt-4o", "gemini-1.5-pro"],
    sonnet: ["claude-sonnet-4-6", "claude-haiku-4-5", "gpt-4o-mini", "gemini-1.5-flash"],
    haiku: ["claude-haiku-4-5", "gpt-4o-mini", "gemini-1.5-flash"],
  },
  reasoningEffort: {
    "claude-opus-4-6": "high",
    "claude-sonnet-4-6": "medium",
    "claude-haiku-4-5": "low",
    "gpt-4o": "medium",
    "gpt-4o-mini": "low",
    "gemini-1.5-pro": "medium",
    "gemini-1.5-flash": "low",
  },
};

/**
 * Provider Registry Class
 * Manages provider configurations, health checks, and fallback logic
 */
export class ProviderRegistry {
  private configs: Map<ValidProvider, ProviderConfig> = new Map();
  private healthCache: Map<ValidProvider, { healthy: boolean; checkedAt: number }> = new Map();
  private routing: ModelRoutingConfig;
  private healthCheckTTL = 60000; // 1 minute

  constructor(
    customConfigs?: Partial<Record<ValidProvider, Partial<ProviderConfig>>>,
    customRouting?: Partial<ModelRoutingConfig>,
  ) {
    // Initialize with defaults
    for (const provider of VALID_PROVIDERS) {
      this.configs.set(provider, { ...DEFAULT_PROVIDER_CONFIGS[provider] });
    }

    // Apply custom configs
    if (customConfigs) {
      for (const [provider, config] of Object.entries(customConfigs)) {
        const existing = this.configs.get(provider as ValidProvider);
        if (existing) {
          this.configs.set(provider as ValidProvider, { ...existing, ...config });
        }
      }
    }

    // Initialize routing
    this.routing = {
      tierOverrides: { ...DEFAULT_MODEL_ROUTING.tierOverrides, ...customRouting?.tierOverrides },
      fallbacks: {
        fable: customRouting?.fallbacks?.fable || DEFAULT_MODEL_ROUTING.fallbacks.fable,
        opus: customRouting?.fallbacks?.opus || DEFAULT_MODEL_ROUTING.fallbacks.opus,
        sonnet: customRouting?.fallbacks?.sonnet || DEFAULT_MODEL_ROUTING.fallbacks.sonnet,
        haiku: customRouting?.fallbacks?.haiku || DEFAULT_MODEL_ROUTING.fallbacks.haiku,
      },
      reasoningEffort: { ...DEFAULT_MODEL_ROUTING.reasoningEffort, ...customRouting?.reasoningEffort },
    };
  }

  /**
   * Get provider configuration
   */
  getConfig(provider: ValidProvider): ProviderConfig | undefined {
    return this.configs.get(provider);
  }

  /**
   * Get all enabled providers sorted by priority
   */
  getEnabledProviders(): ProviderConfig[] {
    return Array.from(this.configs.values())
      .filter((c) => c.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Check if provider is configured (has API key)
   */
  isProviderConfigured(provider: ValidProvider): boolean {
    const config = this.configs.get(provider);
    if (!config) return false;
    const apiKey = process.env[config.apiKeyEnv];
    return !!apiKey;
  }

  /**
   * Get configured providers
   */
  getConfiguredProviders(): ProviderConfig[] {
    return this.getEnabledProviders().filter((c) => this.isProviderConfigured(c.id));
  }

  /**
   * Detect provider from model name (enhanced with FCC patterns)
   */
  detectProvider(model: string): ValidProvider | undefined {
    // First try prefix detection
    const detected = detectProviderByModelPrefix(model);
    if (detected && VALID_PROVIDERS.includes(detected as ValidProvider) && this.configs.has(detected as ValidProvider)) {
      return detected as ValidProvider;
    }

    // Fallback: check if model exists in any provider's model list
    for (const config of this.configs.values()) {
      if (config.models.includes(model)) {
        return config.id;
      }
    }

    return undefined;
  }

  /**
   * Get model for tier with fallback chain
   */
  getModelForTier(tier: keyof ModelRoutingConfig["tierOverrides"]): string {
    const override = this.routing.tierOverrides[tier];
    if (override && this.isModelAvailable(override)) {
      return override;
    }

    // Use fallback chain
    const fallbacks = this.routing.fallbacks[tier];
    for (const model of fallbacks) {
      if (this.isModelAvailable(model)) {
        return model;
      }
    }

    // Ultimate fallback
    const firstFallback = fallbacks[0];
    if (!firstFallback) {
      throw new Error(`No fallback models configured for tier: ${tier}`);
    }
    return firstFallback;
  }

  /**
   * Get full fallback chain for a model
   */
  getFallbackChain(model: string): string[] {
    const provider = this.detectProvider(model);
    if (!provider) return [];

    const config = this.configs.get(provider);
    if (!config) return [];

    // Start with provider's own fallbacks
    const chain = [model, ...config.fallbackProviders.flatMap((p) => this.configs.get(p)?.models || [])];

    // Add tier-based fallbacks
    const tier = this.getModelTier(model);
    if (tier) {
      chain.push(...this.routing.fallbacks[tier]);
    }

    // Deduplicate and filter available
    return [...new Set(chain)].filter((m) => this.isModelAvailable(m));
  }

  /**
   * Get reasoning effort for model
   */
  getReasoningEffort(model: string): "low" | "medium" | "high" {
    return this.routing.reasoningEffort[model] || "medium";
  }

  /**
   * Check provider health (with caching)
   */
  async checkHealth(provider: ValidProvider): Promise<boolean> {
    const cached = this.healthCache.get(provider);
    if (cached && Date.now() - cached.checkedAt < this.healthCheckTTL) {
      return cached.healthy;
    }

    const config = this.configs.get(provider);
    if (!config) return false;

    try {
      const response = await fetch(`${config.baseURL}/models`, {
        headers: { Authorization: `Bearer ${process.env[config.apiKeyEnv]}` },
        signal: AbortSignal.timeout(5000),
      });
      const healthy = response.ok;
      this.healthCache.set(provider, { healthy, checkedAt: Date.now() });
      return healthy;
    } catch {
      this.healthCache.set(provider, { healthy: false, checkedAt: Date.now() });
      return false;
    }
  }

  /**
   * Get healthy providers
   */
  async getHealthyProviders(): Promise<ProviderConfig[]> {
    const configured = this.getConfiguredProviders();
    const results = await Promise.all(
      configured.map(async (c) => ({ config: c, healthy: await this.checkHealth(c.id) })),
    );
    return results.filter((r) => r.healthy).map((r) => r.config);
  }

  /**
   * Update provider config at runtime
   */
  updateConfig(provider: ValidProvider, updates: Partial<ProviderConfig>): void {
    const existing = this.configs.get(provider);
    if (existing) {
      this.configs.set(provider, { ...existing, ...updates });
      // Invalidate health cache
      this.healthCache.delete(provider);
    }
  }

  /**
   * Update routing config at runtime
   */
  updateRouting(updates: Partial<ModelRoutingConfig>): void {
    this.routing = {
      tierOverrides: { ...this.routing.tierOverrides, ...updates.tierOverrides },
      fallbacks: {
        fable: updates.fallbacks?.fable || this.routing.fallbacks.fable,
        opus: updates.fallbacks?.opus || this.routing.fallbacks.opus,
        sonnet: updates.fallbacks?.sonnet || this.routing.fallbacks.sonnet,
        haiku: updates.fallbacks?.haiku || this.routing.fallbacks.haiku,
      },
      reasoningEffort: { ...this.routing.reasoningEffort, ...updates.reasoningEffort },
    };
  }

  // Private helpers

  private isModelAvailable(model: string): boolean {
    const provider = this.detectProvider(model);
    if (!provider) return false;
    const config = this.configs.get(provider);
    return config !== undefined && config.enabled && this.isProviderConfigured(provider) && config.models.includes(model);
  }

  private getModelTier(model: string): keyof ModelRoutingConfig["tierOverrides"] | null {
    // Determine tier from model name
    if (model.includes("opus") || model.includes("fable") || model.includes("nemotron-3-ultra")) {
      return "opus";
    }
    if (model.includes("sonnet") || model.includes("gpt-4o") || model.includes("gemini-1.5-pro")) {
      return "sonnet";
    }
    if (model.includes("haiku") || model.includes("mini") || model.includes("flash") || model.includes("nemotron-4")) {
      return "haiku";
    }
    return null;
  }
}

/**
 * Singleton instance
 */
let registryInstance: ProviderRegistry | null = null;

export function getProviderRegistry(
  customConfigs?: Partial<Record<ValidProvider, Partial<ProviderConfig>>>,
  customRouting?: Partial<ModelRoutingConfig>,
): ProviderRegistry {
  if (!registryInstance) {
    registryInstance = new ProviderRegistry(customConfigs, customRouting);
  }
  return registryInstance;
}

export function resetProviderRegistry(): void {
  registryInstance = null;
}