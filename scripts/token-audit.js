#!/usr/bin/env node
// scripts/token-audit.js
// Audita pacotes de IA no monorepo para visibilidade de custo.
// Lê pnpm-lock.yaml e lista dependências de provedores de IA com suas versões.
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const LOCK_PATH = path.join(ROOT, "pnpm-lock.yaml");

const AI_PACKAGES = [
  "@anthropic-ai/sdk",
  "openai",
  "@google/generative-ai",
  "cohere-ai",
  "ai",
];

function main() {
  if (!fs.existsSync(LOCK_PATH)) {
    console.error("pnpm-lock.yaml não encontrado na raiz.");
    process.exit(1);
  }

  const lock = fs.readFileSync(LOCK_PATH, "utf8");
  const lines = lock.split("\n");

  console.log("=== Token Audit — Pacotes de IA detectados ===\n");
  let found = 0;

  for (const pkg of AI_PACKAGES) {
    const regex = new RegExp(`^  ${pkg}@`);
    const match = lines.find((l) => regex.test(l));
    if (match) {
      const version = match.split("@")[1].trim();
      console.log(`- ${pkg}: ${version}`);
      found++;
    }
  }

  if (found === 0) {
    console.log("Nenhum pacote de IA conhecido encontrado no lockfile.");
  }

  console.log(`\nTotal: ${found} pacote(s) de IA.`);
  console.log("Dica: priorize EFFORT_LEVEL=medium para reduzir consumo de tokens.");
}

main();
