# NettosCorp AI Video Studio

Status: architecture baseline  
Date: 2026-11-11  
Owner: NettosCorp  
Operating model: autonomous by default

The AI Video Studio is a reusable audiovisual production capability for NettosCorp projects. It is not a one-off video project and it is not a replacement for Paperclip, OpenCode, or a professional nonlinear editor. It coordinates specialized agents, reusable Skills, media providers, deterministic production tools, and automated quality control to deliver complete audiovisual work products.

## Mission

Turn a natural-language brief into a verified, reproducible audiovisual deliverable: research, creative direction, script, storyboard, assets, narration, motion graphics, editing, sound design, rendering, quality assurance, and delivery.

The studio serves multiple projects. Each project supplies its own product facts, brand system, audience, approved assets, voice/avatar permissions, and distribution constraints.

## Canonical documents

- [Architecture](./architecture.md) — system boundaries, orchestration, pipeline, technology decisions, security, and autonomy.
- [Agents and Skills](./agents-and-skills.md) — specialist responsibilities and reusable Skill catalog.
- [Production contracts](./production-contracts.md) — project, scene, asset, render, QA, and delivery contracts.
- [Implementation plan](../plans/2026-11-11-ai-video-studio-foundation.md) — phased implementation and acceptance evidence.

## Architectural boundary

Paperclip is the organizational control plane: company goals, agents, assignments, budgets, governance, and auditable work history.

OpenCode and compatible agent runtimes execute coding/research/production tasks. The studio's production engine executes deterministic media workflows. Provider APIs generate or process specific assets.

The studio must not duplicate Paperclip's agent registry, task lifecycle, permissions, budgets, or activity log. It integrates with those capabilities through supported interfaces.

## Current scope

This directory establishes the architecture and implementation contract only. It does not claim that agents, Skills, provider credentials, render workers, or production integrations are already installed or operational.

Implementation begins only after the existing NettosCorp agent, Skill, adapter, and runtime conventions have been inspected and mapped. Avoid parallel agent systems and duplicate Skill registries.

## First validation project

Beleza Digital is the proposed pilot because it can exercise product research, real UI capture, motion graphics, narration, sound design, short-form derivatives, and factual QA. The pilot must use verified product functionality and approved brand assets; it must not invent capabilities.

## Non-goals

- Building a new general-purpose video editor.
- Hard-coupling the studio to one LLM, TTS vendor, avatar vendor, stock library, or video-generation API.
- Requiring human approval for routine creative and production decisions.
- Publishing externally, spending above configured limits, or using a person's identity/voice without the required authorization.
- Treating a successful render process as proof of a successful video.
