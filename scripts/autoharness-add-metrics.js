#!/usr/bin/env node
// scripts/autoharness-add-metrics.js
// Adiciona campos de métrica de esforço e tokens aos runs do autoharness.
// Uso:
//   node scripts/autoharness-add-metrics.js          -- atualiza todos os runs
//   node scripts/autoharness-add-metrics.js <run-id> -- atualiza um run específico
//
// Campos adicionados:
//   effort_used: "low" | "medium" | "high"   (default: medium, seguindo EFFORT_LEVEL)
//   tokens_consumed: number                  (default: null, preenchido após execução)
//   metrics_updated_at: ISO string           (timestamp da última atualização)
//
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const RUNS_DIR = path.join(ROOT, ".claude", "autoharness", "runs");
const DEFAULT_EFFORT = process.env.EFFORT_LEVEL || "medium";
const NOW = new Date().toISOString();

function addMetrics(runPath) {
  try {
    const content = fs.readFileSync(runPath, "utf8");
    const data = JSON.parse(content);

    // Só adiciona se ainda não tiver os campos
    let changed = false;
    if (!("effort_used" in data)) {
      data.effort_used = DEFAULT_EFFORT;
      changed = true;
    }
    if (!("tokens_consumed" in data)) {
      data.tokens_consumed = null;
      changed = true;
    }
    if (!("metrics_updated_at" in data)) {
      data.metrics_updated_at = NOW;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(runPath, JSON.stringify(data, null, 2) + "\n");
      console.log("  atualizado: " + path.basename(runPath));
      return true;
    } else {
      console.log("  sem mudança: " + path.basename(runPath));
      return false;
    }
  } catch (err) {
    console.error("  ERRO ao processar " + path.basename(runPath) + ": " + err.message);
    return false;
  }
}

function main() {
  const targetRun = process.argv[2];

  if (!fs.existsSync(RUNS_DIR)) {
    console.error("Diretório de runs não encontrado: " + RUNS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(RUNS_DIR).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("Nenhum arquivo de run encontrado em " + RUNS_DIR);
    process.exit(0);
  }

  console.log("Effort default: " + DEFAULT_EFFORT);
  console.log("Runs encontrados: " + files.length);

  let updated = 0;
  if (targetRun) {
    const targetFile = targetRun + ".json";
    const targetPath = path.join(RUNS_DIR, targetFile);
    if (fs.existsSync(targetPath)) {
      updated = addMetrics(targetPath) ? 1 : 0;
    } else {
      console.error("Run não encontrado: " + targetFile);
      process.exit(1);
    }
  } else {
    for (const f of files) {
      updated += addMetrics(path.join(RUNS_DIR, f)) ? 1 : 0;
    }
  }

  console.log("\nTotal atualizados: " + updated + " de " + files.length);
  console.log("Campos adicionados: effort_used, tokens_consumed, metrics_updated_at");
  console.log("Nota: tokens_consumed deve ser preenchido pelo caller após execução real.");
}

main();
