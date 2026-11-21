# Handoff: FCC (free-claude-code) Integration with Paperclip

## Summary
Successfully integrated FCC server (port 8082) with Paperclip so agents can use 61+ models from NVIDIA NIM, OpenRouter, Groq, OpenAI, GitHub Copilot, Anthropic, Gemini, etc. through the existing `claude_local` adapter.

## What Was Done

### 1. Server-Side Proxy Endpoint (`server/src/routes/agents.ts`)
- Added `/api/fcc/models` endpoint that proxies requests to FCC server (`http://localhost:8082/v1/models`)
- Bypasses CORS issues when browser (127.0.0.1:3100) calls FCC server (localhost:8082)

### 2. Onboarding Wizard FCC Auto-Detection (`ui/src/components/OnboardingWizard.tsx`)
- Added `probeFccServer()` function that calls `/api/fcc/models` proxy
- When user selects "Claude" tile (claude_local adapter), auto-detects FCC server
- Shows visual status: "Detecting FCC server..." → "FCC server detected at http://localhost:8082"
- Merges FCC models into model dropdown with "(FCC)" suffix
- Auto-configures `ANTHROPIC_BASE_URL=http://localhost:8082` (WITHOUT /v1 suffix) in adapter config

### 3. Adapter Configuration (`packages/adapters/claude-local/src/server/models.ts`)
- Added `configEnv` parameter to `resolveAnthropicApiKey()` and `resolveAnthropicBaseUrl()`
- Updated `loadClaudeModels()`, `listClaudeModels()`, `refreshClaudeModels()` to accept `configEnv`
- Allows FCC base URL from onboarding config to be passed to model discovery

### 4. Model Format Support (`packages/adapters/claude-local/src/index.ts`)
- Modified `resolveClaudeModel()` to normalize provider/model format (e.g., `nvidia_nim/nvidia/nemotron-3-ultra`)

## Key Technical Details

### FCC Server Configuration
- Running on port 8082
- Anthropic-compatible endpoint: `http://localhost:8082/v1/messages`
- Models endpoint: `http://localhost:8082/v1/models`
- **Critical**: Base URL for Paperclip is `http://localhost:8082` (NOT `http://localhost:8082/v1`)

### Model Discovery
- Returns 61+ models including:
  - Native Anthropic models (Claude Fable 5, Opus 4, Sonnet 4, Haiku 4, etc.)
  - NVIDIA NIM models (Nemotron, Llama, Mistral, etc.)
  - OpenRouter, Groq, OpenAI, Google, GitHub Copilot models
- Format: `<provider>/<model-id>` (e.g., `anthropic/nvidia_nim/nvidia/nemotron-3-ultra`)

### Onboarding Flow
1. User navigates to `/NET/onboarding` (company NET already exists)
2. Step 3: Name agent → "FCC Agent"
3. Step 4: "Connect a model" - model source tiles appear
4. User clicks "Claude" tile (accessible name from CONNECT_SOURCE_NAMES)
5. FCC auto-detection runs via `/api/fcc/models` proxy
6. Models populate dropdown with "(FCC)" suffix
7. User selects model, clicks "Connect"
8. Connection test passes, onboarding completes

## Verification
- ✅ Proxy endpoint working: `curl http://127.0.0.1:3100/api/fcc/models` returns 61+ models
- ✅ FCC server confirmed running on port 8082
- ✅ Build passes (`pnpm build`)
- ✅ Unit tests pass (257 tests)
- ⚠️ Playwright E2E tests timing out - need investigation (likely onboarding state issue with existing NET company)

## Known Issues
1. **Onboarding State Inconsistency**: NET company already exists with 15 agents. Onboarding wizard still appears at `/NET/onboarding` but starts at step 3 (Create agent) instead of step 1. This causes test flow issues.
2. **Playwright Tests**: Timing out at "Click on Claude tile" - the radio button is found but click times out. May need longer wait or different selector strategy.
3. **Existing Agents**: NET company has 15 agents (mix of `process`, `claude_local`, `paperclip_runner` types) from previous test runs.

## Next Steps
1. Fix onboarding state logic - should skip onboarding if company already has agents, or properly handle "Add another agent" flow
2. Debug Playwright test - add more explicit waits, check if FCC detection completes before click
3. Test actual agent runs with FCC models to verify end-to-end functionality
4. Document FCC configuration in `doc/DEVELOPING.md`

## Commands for Testing
```bash
# Test FCC proxy endpoint
curl http://127.0.0.1:3100/api/fcc/models

# Test FCC server directly
curl http://localhost:8082/v1/models

# Run unit tests
pnpm test:run

# Run build
pnpm build

# Run Playwright test (when fixed)
npx playwright test tests/e2e/fcc-onboarding-dev.spec.ts --headed
```

## Files Modified
- `server/src/routes/agents.ts` - Added `/api/fcc/models` proxy endpoint
- `ui/src/components/OnboardingWizard.tsx` - FCC auto-detection, model merging, adapter config
- `packages/adapters/claude-local/src/server/models.ts` - ConfigEnv support for FCC base URL
- `packages/adapters/claude-local/src/index.ts` - Model format normalization
- `tests/e2e/fcc-onboarding-dev.spec.ts` - Updated test selectors and timeouts