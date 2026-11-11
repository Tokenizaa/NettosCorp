# AI Video Studio Foundation

Date: 2026-11-11  
Status: approved architecture baseline; implementation not started

## Objective

Establish a reusable, autonomous audiovisual production capability for NettosCorp projects, integrated with the existing Paperclip control plane and compatible agent runtimes. The studio must turn a natural-language brief into a verified delivery package while preserving project boundaries, rights, budgets, and auditability.

## Scope

- Dedicated architecture directory: `doc/ai-video-studio/`.
- Logical agent roster and delegation contracts.
- Reusable Skill catalog and runtime compatibility strategy.
- Production lifecycle and artifact contracts.
- Provider-neutral media adapter strategy.
- Hybrid execution and render-worker strategy.
- Automated quality assurance and bounded repair loop.
- First pilot on Beleza Digital after the foundation is qualified.

## Repository findings

The repository is a Paperclip control-plane codebase, not a blank agent workspace. It already has distinct locations and conventions for:
- `.agents/skills/`: repository/agent development Skills;
- `.claude/agents/` and `.claude/skills/`: Claude-specific agent and Skill configuration;
- `.codex/agents/`: Codex-specific agent configuration;
- `skills/`: Paperclip runtime/operational Skills;
- `packages/skills-catalog/`: app-shipped Skill catalog.

The repository's `AGENTS.md` says Paperclip is the control plane and agents execute externally through adapters. The studio must reuse these systems rather than create a parallel agent registry, task manager, permission model, or Skill catalog.

The current repository default branch is `claude/elastic-diffie-70dfa0`; this work is isolated in `work/ai-video-studio-foundation`. No existing source code, global agent configuration, or runtime Skill was modified in this foundation change.

## Phases

### Phase 1 — Runtime and repository qualification
- Inspect current OpenCode global configuration and existing global Skills/agents in the actual execution environment.
- Inspect Paperclip agent, Skill, team, project, task, work-product, connection, budget, and adapter APIs currently supported by this repository.
- Identify existing Skills that can be reused; do not duplicate.
- Confirm how repository-level project Skills are discovered and synced to each supported runtime.
- Produce a compatibility matrix for OpenCode, Claude Code, Codex, and Paperclip-native Skills.
- Verify current provider catalogs, API availability, licensing, and pricing for every proposed media integration.
- Verify the model alias and availability from the original brief; do not hardcode unverified model names.

Acceptance evidence: inventory with exact paths, supported APIs, runtime behavior, provider docs, license notes, and explicit gaps.

### Phase 2 — Minimal end-to-end production proof
- Select the composition engine by benchmarking Remotion and HyperFrames against the same representative scenes.
- Establish FFmpeg/FFprobe media probing and render validation.
- Build one short, factual, project-branded video with generated/captured assets and TTS.
- Persist manifests, source compositions, render logs, transcript, and QA evidence.
- Demonstrate resumable stage execution and targeted repair.

Acceptance evidence: playable final MP4, reproducible source project, manifest, cost record, automated media probes, frame/contact-sheet review, audio analysis, and QA report.

### Phase 3 — Agent and Skill implementation
- Implement the Video Producer and specialist roles using the existing org/agent model.
- Author only Skills that do not already exist, in the correct shared/project/runtime location.
- Add evaluation fixtures for research, script duration, storyboard completeness, asset provenance, editing, and QA.
- Use model capability tiers and provider adapters; resolve exact model IDs from live catalogs.
- Add provider failure and budget-exhaustion behavior.

Acceptance evidence: agent roster/configuration, Skill tests, provider adapter tests, delegation records, and an autonomous dry-run.

### Phase 4 — Production hardening
- Add voice/avatar consent enforcement, stock-media rights tracking, and publication boundaries.
- Add remote rendering only where benchmark evidence requires it.
- Add bounded retries, idempotency, cache/reuse, artifact retention, and recovery.
- Add accessibility and localization checks where required.
- Benchmark quality, latency, and cost against the golden-media set.

Acceptance evidence: failure-injection results, security/rights review, repeatability test, cost report, and QA pass rate.

### Phase 5 — Beleza Digital pilot and rollout
- Build a real product video from verified Beleza Digital functionality and approved brand assets.
- Produce the requested master and selected social derivatives.
- Validate the complete workflow from Paperclip task intake to work-product delivery.
- Document onboarding for subsequent NettosCorp projects.

Acceptance evidence: approved-by-policy pilot delivery, factual verification against the product, complete asset provenance, QA report, and reusable project profile.

## Technical decisions and constraints

- Paperclip remains the organizational control plane; do not duplicate its responsibilities.
- OpenCode/Claude/Codex runtime conventions must be inspected before writing agent files or installing Skills.
- FFmpeg is the baseline processing tool.
- Remotion and HyperFrames remain candidates until benchmark and license checks are complete.
- Three.js/Blender, OpenCV, OCR, ASR, TTS, avatar, stock, and generative-media services are optional capabilities selected per brief.
- Provider credentials must use existing approved secret/connection mechanisms.
- Do not add a database, message broker, Kubernetes, or always-on service without demonstrated requirements.
- The local WSL environment is a control/authoring environment; heavy rendering should be delegated to a qualified remote worker when benchmarks show local limits.
- No external publication or new paid commitment is authorized merely by this architecture plan.

## Definition of done

The studio is ready for general use only when it can:
1. Accept a natural-language request and resolve project context.
2. Produce research, script, storyboard, assets, audio, edit, and final render autonomously within policy.
3. Reuse existing agents/Skills and route across supported providers.
4. Resume from persisted artifacts without unnecessary duplicate paid generation.
5. Inspect the actual rendered media and repair defects.
6. Verify factual claims, rights, technical metadata, and budget.
7. Deliver the master, source project, assets manifest, captions/transcript, QA report, and production report.
8. Record the work and artifacts against the originating Paperclip task.

## Out of scope for this foundation commit

- Creating or changing live Paperclip company agents.
- Installing or modifying global OpenCode/Claude/Codex agent configurations.
- Adding provider credentials or making paid API calls.
- Implementing the render engine or production integrations.
- Changing Paperclip application code, database schema, or UI.
