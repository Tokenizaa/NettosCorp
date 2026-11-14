import { createHermesAdapter } from "./packages/adapters/hermes/src/adapter";
import { ValidProvider } from "./packages/adapters/hermes/src/shared/constants";

// Carrega variáveis de ambiente
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function testAgent() {
  console.log("=== Teste do Agente Hermes ===\n");

  // Configura Anthropic para usar proxy FCC
  const anthropicBaseUrl = process.env.ANTHROPIC_BASE_URL || "http://127.0.0.1:8082/v1";

  const adapter = createHermesAdapter({
    providers: {
      anthropic: {
        baseURL: anthropicBaseUrl,
        enabled: true,
        priority: 10,
      },
      nvidia: {
        enabled: true,
        priority: 50,
      },
    },
    defaultTier: "sonnet",
    autoFallback: true,
    healthChecks: true,
  });

  try {
    console.log("Inicializando adapter...");
    await adapter.initialize();

    const status = await adapter.getProviderStatus();
    console.log("\nStatus dos provedores:");
    status.forEach(s => {
      console.log(`  ${s.name}: configurado=${s.configured}, saudavel=${s.healthy}, modelos=${s.models}`);
    });

    // Teste 1: NVIDIA (usando API key direta)
    console.log("\n--- Teste 1: NVIDIA NIM (nemotron) ---");
    try {
      const response = await adapter.chat({
        messages: [{ role: "user", content: "Diga olá em português" }],
        model: "nemotron-3-ultra",
      });
      console.log(`Resposta: ${response.content}`);
      console.log(`Provedor: ${response.provider}, Modelo: ${response.model}`);
    } catch (e) {
      console.log(`Erro NVIDIA: ${e}`);
    }

    // Teste 2: Anthropic via proxy FCC
    console.log("\n--- Teste 2: Anthropic via Proxy FCC ---");
    try {
      const response = await adapter.chat({
        messages: [{ role: "user", content: "Diga olá em português" }],
        tier: "sonnet",
      });
      console.log(`Resposta: ${response.content}`);
      console.log(`Provedor: ${response.provider}, Modelo: ${response.model}`);
      if (response.fallbackUsed) {
        console.log(`(Usou fallback de: ${response.fallbackFrom})`);
      }
    } catch (e) {
      console.log(`Erro Anthropic: ${e}`);
    }

    // Teste 3: Fallback automático
    console.log("\n--- Teste 3: Fallback automático ---");
    try {
      const response = await adapter.chat({
        messages: [{ role: "user", content: "Explique o que é fallback em uma frase" }],
        tier: "haiku",
      });
      console.log(`Resposta: ${response.content}`);
      console.log(`Provedor: ${response.provider}, Modelo: ${response.model}`);
      if (response.fallbackUsed) {
        console.log(`(Usou fallback de: ${response.fallbackFrom})`);
      }
    } catch (e) {
      console.log(`Erro fallback: ${e}`);
    }

  } catch (e) {
    console.error("Erro geral:", e);
  } finally {
    adapter.destroy();
    console.log("\n=== Fim do teste ===");
  }
}

testAgent();