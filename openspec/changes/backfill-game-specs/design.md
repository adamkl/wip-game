## Context

The game reached a stable working state iteratively: a Kaplay canvas with a tiled cave level, physics-based player movement, six selectable characters, mobile touch controls, and a clamped camera. No specs were written during this initial build — this change backfills them against the existing implementation.

## Goals / Non-Goals

**Goals:**
- Capture the observable behaviour of every shipped capability as testable requirements
- Establish a spec baseline that future changes can extend or modify via delta specs

**Non-Goals:**
- Changing any production code
- Speccing internal implementation details (physics constants, file paths, sprite atlas layout)
- Covering unimplemented or aspirational features

## Decisions

**One spec per logical capability, not per file.**
Grouping by feature (e.g., `player-movement`) rather than by source file (`player.ts`) keeps specs stable when code is refactored across files.

**Behaviour-level granularity, not unit-test granularity.**
Scenarios describe observable player/game outcomes (player moves, camera clamps) rather than function signatures or internal state transitions.

**Backfill goes into the change directory first.**
Specs ship via the standard change → archive workflow so they land in `openspec/specs/` with full provenance rather than being created there directly.

## Risks / Trade-offs

**Specs may lag a bug fix** → Any bug fixed after this backfill will require a follow-up delta spec to keep requirements accurate. Convention: fix code and spec in the same PR.

**No automated test harness yet** → Scenarios are currently manually verified. The spec format is test-ready (WHEN/THEN), but hooking them to Playwright or a unit test runner is future work.

## Open Questions

- Should physics constants (MOVE_SPEED, JUMP_FORCE, etc.) be surfaced in specs as normative values, or kept as implementation details? Currently excluded.
