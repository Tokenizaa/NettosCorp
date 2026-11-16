// Configura variaveis de ambiente publicas do serviço nettoscorp-enterprise
// via API REST do Render. Nunca expoe segredos (VITE_SUPABASE_ANON_KEY,
// PAPERCLIP_API_KEY, etc.) - apenas URLs publicas e chaves de projeto
// voltadas ao frontend (VITE_SUPABASE_URL).
//
// Uso:
//   node --experimental-strip-types scripts/set-enterprise-env.ts

const BASE_URL = "https://api.render.com/v1";
const SERVICE_ID = "srv-dbsv25vf3r2c73bfdfmg"; // nettoscorp-enterprise

const RENDER_API_KEY = process.env.RENDER_API_KEY;
if (!RENDER_API_KEY) {
  console.error("RENDER_API_KEY nao definida no ambiente.");
  process.exit(1);
}

async function putEnvVars(body: unknown): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/services/${SERVICE_ID}/env-vars`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${RENDER_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `API ${res.status} ${res.statusText}: ${text.slice(0, 500)}`,
    );
  }
  return text ? JSON.parse(text) : undefined;
}

async function main() {
  const current = await putEnvVars([
    { key: "VITE_SUPABASE_URL", value: "https://pakzvwpldlkvvdnqgdgq.supabase.co" },
    { key: "PAPERCLIP_API_URL", value: "https://nettoscorp.onrender.com" },
  ]);
  console.log("Variaveis publicas configuradas com sucesso.");
  console.log(JSON.stringify(current, null, 2));
}

main().catch((err) => {
  console.error("Falha:", String(err));
  process.exit(1);
});
