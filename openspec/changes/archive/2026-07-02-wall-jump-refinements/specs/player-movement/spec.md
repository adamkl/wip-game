## ADDED Requirements

### Requirement: Collision area is inset from the sprite's declared bounds
The player's collision `area()` SHALL use an inset shape rather than the full 8×8 (pre-scale) sprite bounding box, matching the original PICO-8 `bbox` collision points (approximately 1px inset from the left edge, 2px inset from the right edge, flush with the top edge, and 1px inset from the bottom edge, in pico-pixel units). This aligns the collision boundary with the sprite's actual non-transparent artwork, which is itself inset from the frame's declared edges, so the player visually rests flush against walls, floors, and ceilings rather than appearing to float a pixel away.

#### Scenario: Resting flush against a wall
- **WHEN** the player is pushed against a solid wall until blocked
- **THEN** the visible sprite's edge, not just the invisible collision box, appears touching the wall with no visible gap

#### Scenario: Collision area smaller than the render size
- **WHEN** the player's collision area is inspected
- **THEN** it is narrower and shorter than the full 32×32 world-unit render size, inset on each side to match the original bbox proportions scaled by DISPLAY_SCALE
