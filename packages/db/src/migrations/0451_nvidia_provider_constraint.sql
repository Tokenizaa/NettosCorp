-- Migration 0451: Adiciona 'nvidia' ao CHECK constraint de ai_provider_defaults
--
-- Este migration dropa e recria o constraint ai_provider_defaults_provider_check
-- para incluir o provedor 'nvidia' entre os valores permitidos.

-- Dropa o constraint existente (se houver)
ALTER TABLE ai_provider_defaults
  DROP CONSTRAINT IF EXISTS ai_provider_defaults_provider_check;

-- Recria o constraint incluindo 'nvidia'
ALTER TABLE ai_provider_defaults
  ADD CONSTRAINT ai_provider_defaults_provider_check
  CHECK (provider IN ('openai', 'anthropic', 'google', 'cohere', 'nvidia'));
