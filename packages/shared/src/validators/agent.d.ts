import { z } from "zod";
/**
 * Schema de validação das variáveis de ambiente de um adapter.
 * Cada provedor pode exigir uma ou mais variáveis de ambiente para autenticação.
 */
export declare const testAdapterEnvironmentSchema: z.ZodObject<{
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    ANTHROPIC_API_KEY: z.ZodOptional<z.ZodString>;
    GOOGLE_API_KEY: z.ZodOptional<z.ZodString>;
    COHERE_API_KEY: z.ZodOptional<z.ZodString>;
    NVIDIA_API_KEY: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    OPENAI_API_KEY?: string | undefined;
    ANTHROPIC_API_KEY?: string | undefined;
    GOOGLE_API_KEY?: string | undefined;
    COHERE_API_KEY?: string | undefined;
    NVIDIA_API_KEY?: string | undefined;
}, {
    OPENAI_API_KEY?: string | undefined;
    ANTHROPIC_API_KEY?: string | undefined;
    GOOGLE_API_KEY?: string | undefined;
    COHERE_API_KEY?: string | undefined;
    NVIDIA_API_KEY?: string | undefined;
}>;
export type TestAdapterEnvironment = z.infer<typeof testAdapterEnvironmentSchema> & Record<string, string | undefined>;
/**
 * Valida se pelo menos uma chave de API relevante está presente para o provedor informado.
 */
export declare function validateAdapterEnvironment(env: TestAdapterEnvironment, provider: string): {
    valid: boolean;
    missing?: string[];
};
//# sourceMappingURL=agent.d.ts.map