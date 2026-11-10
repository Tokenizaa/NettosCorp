"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_PROVIDER_CAPABILITIES = exports.aiProviderSchema = exports.AI_PROVIDERS = void 0;
exports.getProviderEnvKey = getProviderEnvKey;
const zod_1 = require("zod");
/**
 * Lista de provedores de IA aceitos pelo sistema.
 * Cada provedor deve estar representado como uma string literal.
 */
exports.AI_PROVIDERS = [
    "openai",
    "anthropic",
    "google",
    "cohere",
    "nvidia",
];
/**
 * Schema Zod que valida o provedor de IA.
 */
exports.aiProviderSchema = zod_1.z.enum(exports.AI_PROVIDERS);
/**
 * Capacidades de cada provedor de IA.
 * Define quais métodos de autenticação são suportados, quais adapters
 * podem ser usados e qual variável de ambiente carrega a chave de API.
 */
exports.AI_PROVIDER_CAPABILITIES = {
    openai: {
        name: "OpenAI",
        methods: {
            api_key: {
                adapters: ["hermes_local", "openai"],
                envKey: "OPENAI_API_KEY",
            },
        },
    },
    anthropic: {
        name: "Anthropic",
        methods: {
            api_key: {
                adapters: ["hermes_local", "anthropic"],
                envKey: "ANTHROPIC_API_KEY",
            },
        },
    },
    google: {
        name: "Google",
        methods: {
            api_key: {
                adapters: ["hermes_local", "google"],
                envKey: "GOOGLE_API_KEY",
            },
        },
    },
    cohere: {
        name: "Cohere",
        methods: {
            api_key: {
                adapters: ["hermes_local", "cohere"],
                envKey: "COHERE_API_KEY",
            },
        },
    },
    nvidia: {
        name: "NVIDIA NIM",
        methods: {
            api_key: {
                adapters: ["hermes_local"],
                envKey: "NVIDIA_API_KEY",
            },
        },
    },
};
/**
 * Retorna a variável de ambiente de autenticação para um provedor e método.
 */
function getProviderEnvKey(provider, method = "api_key") {
    const capabilities = exports.AI_PROVIDER_CAPABILITIES[provider];
    if (!capabilities)
        return undefined;
    return capabilities.methods[method]?.envKey;
}
