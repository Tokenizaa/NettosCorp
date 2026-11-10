"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testAdapterEnvironmentSchema = void 0;
exports.validateAdapterEnvironment = validateAdapterEnvironment;
const zod_1 = require("zod");
/**
 * Schema de validação das variáveis de ambiente de um adapter.
 * Cada provedor pode exigir uma ou mais variáveis de ambiente para autenticação.
 */
exports.testAdapterEnvironmentSchema = zod_1.z.object({
    OPENAI_API_KEY: zod_1.z.string().optional(),
    ANTHROPIC_API_KEY: zod_1.z.string().optional(),
    GOOGLE_API_KEY: zod_1.z.string().optional(),
    COHERE_API_KEY: zod_1.z.string().optional(),
    NVIDIA_API_KEY: zod_1.z.string().optional(),
});
/**
 * Valida se pelo menos uma chave de API relevante está presente para o provedor informado.
 */
function validateAdapterEnvironment(env, provider) {
    const requiredKeys = {
        openai: ["OPENAI_API_KEY"],
        anthropic: ["ANTHROPIC_API_KEY"],
        google: ["GOOGLE_API_KEY"],
        cohere: ["COHERE_API_KEY"],
        nvidia: ["NVIDIA_API_KEY"],
    };
    const keys = requiredKeys[provider] || [];
    const missing = keys.filter((key) => !env[key]);
    return {
        valid: missing.length === 0,
        missing: missing.length > 0 ? missing : undefined,
    };
}
