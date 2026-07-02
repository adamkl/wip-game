## REMOVED Requirements

### Requirement: Cycle through characters with X key
**Reason**: The source PICO-8 game (`feat/wall_jump` branch) dropped multi-character selection in favor of a single character with a richer, physics-state-driven animation set. The port is following that direction.
**Migration**: No replacement — there is only one playable character. The X key is no longer bound to anything.

### Requirement: Animated characters play run/idle
**Reason**: Superseded by the `player-movement` capability's new "Animation reflects physics state" requirement, which covers all four animation states (run/stand/jump/wall-slide) for the single remaining character.
**Migration**: See `player-movement` spec.

### Requirement: Non-animated characters display a static sprite
**Reason**: Characters 2–6 (previously static or unanimated) are removed along with character selection. The remaining character is always animated.
**Migration**: No replacement — not applicable with only one character.
