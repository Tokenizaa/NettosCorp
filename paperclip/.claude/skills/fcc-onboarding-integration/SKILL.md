---
name: fcc-onboarding-integration
description: FCC onboarding: force API mode, hide key when detected.
category: onboarding
---

When FCC auto-detection succeeds (`fccDetection?.detected === true` for `claude_local` adapter), the onboarding wizard must:

1. **Force credential mode to "api"** — FCC proxy handles auth internally, no user-provided key needed.
2. **Hide the API key field** — Do not render the saved-key picker or manual key input when FCC is active.
3. **Include `adapterConfig` in the query key** — Pass `JSON.stringify(buildAdapterConfig())` to `queryKeys.agents.adapterModels()` so React Query re-fetches when FCC detection toggles.
4. **Send `adapterConfig` to the API** — The `agentsApi.adapterModels()` call must include `{ environmentId: null, adapterConfig: buildAdapterConfig() }` so the backend proxies to `localhost:8082/v1/models`.
5. **Display FCC-discovered models** — The model dropdown should show the 60+ models returned by FCC (NVIDIA NIM, OpenRouter, Groq, OpenAI, GitHub Copilot, etc.), not the hardcoded Anthropic list.
6. **Create a gateway connection binding** — Set `gatewayConnection` state with a binding containing `routing: { kind: "gateway", protocol: "messages", baseUrl: fccDetection.baseUrl }` so that `managedBindingForStep()` returns it for the hire API `aiConnection` field.
7. **Persist as an AI Connection** — Call `aiConnectionsApi.create()` with `connectionPurpose: "ai"` and the gateway routing so the connection appears in `AiConnectionSelect` for future agents.

**ACP Runtime Configuration** — The `buildAdapterConfig()` must include `ANTHROPIC_BASE_URL` (and `ANTHROPIC_AUTH_TOKEN` if FCC requires it) in `config.env` so that `buildClaudeAcpConfig` (in `packages/adapters/claude-local/src/server/acp.ts`) passes these through to the ACP runtime. The ACPX engine's `ACPX_INHERITED_PROVIDER_ENV_KEYS.claude` allowlist includes `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`, and `ANTHROPIC_CUSTOM_HEADERS` — ensure the adapter config env populates these for the ACP executor.

Anti-pattern: Leaving `credentialMode` as "subscription" or showing the API key picker when FCC is detected causes "Authentication failed" errors and shows wrong models (e.g., "Claude Fable 5.1"). Anti-pattern: Omitting `ANTHROPIC_BASE_URL` from the adapter config env causes the ACP runtime to call Anthropic directly instead of the FCC proxy, breaking FCC agent execution. Anti-pattern: Not creating the gateway connection binding causes `managedBindingForStep()` to return `undefined`, so the hired agent lacks the `aiConnection` binding and the FCC proxy is not registered for reuse. Anti-pattern: Not persisting the AI Connection means users must re-detect FCC for each new agent instead of selecting it from the dropdown.