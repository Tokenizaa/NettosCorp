# AI Video Studio — Agents and Skills

Date: 2026-11-11  
Status: initial catalog proposal

## 1. Agent roles

The roles below define accountability. They do not require a separate process or permanent agent instance for every task.

### Video Producer
- Owns the end-to-end production outcome.
- Converts the request into a production brief and dependency graph.
- Selects the minimum necessary specialists and Skills.
- Checks project context, brand rules, rights, deadlines, and budget.
- Resolves stage failures, coordinates targeted repairs, and assembles delivery.
- Reports verified completion and unresolved limitations.

### Creative Director
- Defines creative concept, narrative treatment, visual system, pacing, and references.
- Ensures consistency with the project's approved brand system.
- Chooses where motion, 3D, live action, UI capture, or avatar adds value.
- Rejects visual effects that obscure comprehension or factual accuracy.

### Research & Script Agent
- Reads authoritative project sources before making product claims.
- Distinguishes verified facts, assumptions, and creative framing.
- Produces sourced research, script, narration, on-screen copy, and storyboard content.
- Checks duration and reading complexity for the intended audience.

### Visual Production Agent
- Produces or retrieves approved images, B-roll, UI captures, motion graphics, and 2D/3D scenes.
- Uses deterministic templates where repeatability matters.
- Tracks asset provenance, license, prompt, model/provider, and file checksum.
- Optimizes formats and resolution for the target output.

### Audio & Voice Agent
- Produces narration, TTS, pronunciation dictionaries, music, sound effects, and mix stems.
- Coordinates avatar/lip-sync generation when requested and authorized.
- Aligns audio segments to scene timing and narration transcript.
- Tracks voice/likeness consent and provider usage rights.

### Video Editor
- Builds the composition/timeline from approved scene contracts.
- Aligns narration, footage, overlays, subtitles, transitions, music, and effects.
- Performs transcript-led cuts, tracking, compositing, color matching, and final encoding.
- Preserves editable source compositions and render configuration.

### Video QA Engineer
- Independently checks script-to-video fidelity, factual accuracy, visual quality, audio quality, accessibility, rights, and technical output.
- Produces a structured defect list with severity, timecode, evidence, and recommended repair.
- Rechecks corrected scenes and final output.
- Cannot mark an output complete without the required evidence.

## 2. Skill catalog

Skills are modular operating procedures, not agents. Each Skill should have a single clear purpose, explicit prerequisites, tool requirements, outputs, failure behavior, and evaluation examples.

### Research and direction
- `video-research`: research claims, providers, references, and source provenance.
- `video-project-context`: collect product facts, audience, brand rules, and approved assets.
- `video-creative-direction`: creative treatment, visual language, pacing, and references.
- `video-scriptwriting`: narrative, narration, on-screen copy, and duration estimates.
- `video-storyboarding`: convert script beats into timed scene specifications.

### Visual production
- `video-asset-generation`: generated visual asset workflow and metadata.
- `video-stock-media`: licensed stock search, selection, attribution, and provenance.
- `video-screen-capture`: deterministic capture of product UI and software demos.
- `video-motion-design`: HTML/CSS/SVG/Canvas/GSAP motion systems.
- `video-3d-production`: Three.js or Blender-based 3D scenes where justified.
- `video-compositing`: layer composition, masks, shadows, perspective, and color consistency.
- `video-tracking`: object/person tracking and graphics attachment.
- `video-ocr-layout`: text detection, safe areas, and on-screen text verification.

### Audio production
- `video-tts`: provider-neutral text-to-speech production and pronunciation QA.
- `video-voice-consent`: consent and provenance checks for cloned voices.
- `video-avatar-lipsync`: authorized avatar generation and synchronization.
- `video-music-sound-design`: soundtrack, sound effects, ducking, and mix.
- `video-audio-mastering`: loudness, peak, clipping, channel, and export checks.

### Editing and delivery
- `video-editing`: timeline assembly, transcript-led cuts, transitions, captions, and pacing.
- `video-rendering`: deterministic render, FFmpeg processing, and output metadata.
- `video-quality-control`: visual, audio, content, rights, and technical QA.
- `video-thumbnail`: thumbnail and platform-specific packaging.
- `video-derivatives`: short-form cuts, aspect-ratio adaptations, captions, and platform exports.

## 3. Skill format and compatibility

Before adding Skills to any runtime directory, inspect the existing repository and global OpenCode/Claude/Codex conventions. Do not create a second registry or duplicate a Skill that already exists.

Each new Skill should include:
- A concise `SKILL.md` with frontmatter compatible with the target runtime.
- Trigger conditions and non-goals.
- Inputs and prerequisites.
- Step-by-step workflow.
- Provider/tool selection rules and fallback behavior.
- Expected artifacts and metadata.
- Quality checks and failure handling.
- At least one representative evaluation input and expected outcome.

Keep provider-specific instructions in references or adapters so the core Skill remains reusable.

## 4. Delegation contract

The Producer assigns a bounded task with:
- objective and acceptance criteria;
- project and audience context;
- authorized sources and assets;
- input artifact references and hashes;
- budget ceiling and deadline;
- expected output paths/schema;
- permission boundaries.

The specialist returns:
- status: completed, blocked, or failed;
- output artifact references and hashes;
- sources/provider/model versions;
- actual cost when available;
- validation results;
- known limitations and next action.

A specialist must not silently change the brief, exceed budget, publish externally, or use unapproved identities/assets.

## 5. Independence and parallelism

Research, creative treatment, and asset inventory can begin in parallel when their inputs are independent. Storyboard depends on script and creative treatment. Audio and visual production can proceed in parallel after scene contracts are stable. Editing depends on the required source assets and timing references. QA is independent and must inspect the actual rendered output, not only the source project.
