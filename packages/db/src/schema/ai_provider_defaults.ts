/**
 * Schema da tabela ai_provider_defaults.
 *
 * Armazena o provedor de IA padrão por usuário ou empresa.
 * O CHECK constraint garante que apenas provedores válidos sejam armazenados.
 */

export const AI_PROVIDER_DEFAULTS_TABLE = "ai_provider_defaults";

export const AI_PROVIDER_DEFAULTS_COLUMNS = [
  { name: "id", type: "uuid", primaryKey: true },
  { name: "user_id", type: "uuid", nullable: true },
  { name: "company_id", type: "uuid", nullable: true },
  { name: "provider", type: "text", nullable: false },
  { name: "created_at", type: "timestamp", nullable: false },
  { name: "updated_at", type: "timestamp", nullable: false },
] as const;

/**
 * CHECK constraint que restringe os valores permitidos para a coluna provider.
 * Inclui 'nvidia' como provedor válido.
 */
export const AI_PROVIDER_DEFAULTS_PROVIDER_CHECK =
  "ai_provider_defaults_provider_check";

export const AI_PROVIDER_DEFAULTS_PROVIDER_VALUES = [
  "openai",
  "anthropic",
  "google",
  "cohere",
  "nvidia",
];

export function buildProviderCheckConstraint(): string {
  const values = AI_PROVIDER_DEFAULTS_PROVIDER_VALUES
    .map((v) => `'${v}'`)
    .join(", ");
  return `CONSTRAINT ${AI_PROVIDER_DEFAULTS_PROVIDER_CHECK} CHECK (provider IN (${values}))`;
}
