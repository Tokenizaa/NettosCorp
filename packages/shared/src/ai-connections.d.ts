import { z } from "zod";
/**
 * Lista de provedores de IA aceitos pelo sistema.
 * Cada provedor deve estar representado como uma string literal.
 */
export declare const AI_PROVIDERS: readonly ["openai", "anthropic", "google", "cohere", "nvidia"];
/**
 * Schema Zod que valida o provedor de IA.
 */
export declare const aiProviderSchema: z.ZodEnum<["openai", "anthropic", "google", "cohere", "nvidia"]>;
/**
 * Tipo inferido do schema do provedor.
 */
export type AIProvider = z.infer<typeof aiProviderSchema>;
/**
 * Capacidades de cada provedor de IA.
 * Define quais métodos de autenticação são suportados, quais adapters
 * podem ser usados e qual variável de ambiente carrega a chave de API.
 */
export declare const AI_PROVIDER_CAPABILITIES: Record<AIProvider, {
    name: string;
    methods: Record<string, {
        adapters: string[];
        envKey: string;
    }>;
}>;
/**
 * Retorna a variável de ambiente de autenticação para um provedor e método.
 */
export declare function getProviderEnvKey(provider: AIProvider, method?: string): string | undefined;
//# sourceMappingURL=ai-connections.d.ts.map