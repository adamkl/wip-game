## ADDED Requirements

### Requirement: On-screen buttons visible only on touch-primary devices
Three circular buttons (left, right, jump) SHALL be rendered as a fixed overlay. They MUST be hidden on pointer-and-hover capable devices (i.e., desktops with a mouse) and shown only when the primary pointer is coarse and the device has no hover capability.

#### Scenario: Buttons shown on touch device
- **WHEN** the page loads on a device matching `(hover: none) and (pointer: coarse)`
- **THEN** the `#touch-controls` container has `display: block` and all three buttons are visible

#### Scenario: Buttons hidden on desktop
- **WHEN** the page loads on a device with a mouse pointer
- **THEN** the `#touch-controls` container has `display: none`

### Requirement: Left and right buttons control horizontal movement
The left (`#touch-left`) and right (`#touch-right`) buttons SHALL act as held directional inputs. Movement starts on `pointerdown` and stops on `pointerup`, `pointercancel`, or `pointerleave`.

#### Scenario: Hold left button
- **WHEN** `pointerdown` fires on `#touch-left`
- **THEN** the touch left state is true and the player moves left

#### Scenario: Release left button
- **WHEN** `pointerup` or `pointercancel` fires on `#touch-left`
- **THEN** the touch left state is false and horizontal movement stops

#### Scenario: Hold right button
- **WHEN** `pointerdown` fires on `#touch-right`
- **THEN** the touch right state is true and the player moves right

### Requirement: Jump button triggers a one-shot jump
The jump button (`#touch-jump`) SHALL trigger a jump on `pointerdown`, subject to the same grounded check as the keyboard jump.

#### Scenario: Tap jump button while grounded
- **WHEN** `pointerdown` fires on `#touch-jump` and the player is grounded
- **THEN** the player jumps

#### Scenario: Tap jump button while airborne
- **WHEN** `pointerdown` fires on `#touch-jump` and the player is not grounded
- **THEN** no jump occurs

### Requirement: Double-tap zoom is disabled
The viewport SHALL be configured with `user-scalable=no` so that a rapid double-tap on any button does not trigger browser zoom.

#### Scenario: Double-tap does not zoom
- **WHEN** a touch button is tapped twice in quick succession
- **THEN** the page zoom level remains unchanged
