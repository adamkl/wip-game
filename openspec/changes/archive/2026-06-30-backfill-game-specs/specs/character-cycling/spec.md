## ADDED Requirements

### Requirement: Cycle through characters with X key
The player SHALL cycle through 6 available characters by pressing X. Characters are numbered 1–6 and cycle in order, wrapping from 6 back to 1. The active sprite is replaced immediately.

#### Scenario: Advance to next character
- **WHEN** X is pressed and the current character is not 6
- **THEN** character index increments by 1 and the sprite updates

#### Scenario: Wrap from last to first
- **WHEN** X is pressed and the current character is 6
- **THEN** character index resets to 1 and the sprite updates

### Requirement: Animated characters play run/idle
Characters 1, 4, 5, and 6 have a two-frame run animation and a single-frame idle. The game SHALL play the "idle" animation when the player switches to one of these characters, then transition to "run" while moving and back to "idle" while still.

#### Scenario: Switch to animated character
- **WHEN** X is pressed and the new character is 1, 4, 5, or 6
- **THEN** the "idle" animation plays immediately

#### Scenario: Run animation while moving
- **WHEN** the player's horizontal speed exceeds 1 wu/s and the active character is animated
- **THEN** the "run" animation plays

#### Scenario: Idle animation when still
- **WHEN** the player's horizontal speed is 1 wu/s or less and the active character is animated
- **THEN** the "idle" animation plays

### Requirement: Non-animated characters display a static sprite
Characters 2 and 3 have no animation frames. They SHALL display their single sprite without any animation state changes.

#### Scenario: Switch to static character
- **WHEN** X is pressed and the new character is 2 or 3
- **THEN** the sprite updates to the static frame and no animation is played
