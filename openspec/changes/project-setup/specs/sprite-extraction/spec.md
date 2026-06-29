# Sprite Extraction

## Requirements

- `npm run extract-sprites` reads the `__gfx__` hex data (embedded in the script) and writes `public/sprites/spritesheet.png`
- Output is a 128×128 RGBA PNG
- PICO-8 colour index 0 renders as fully transparent (alpha = 0)
- All other colour indices render as fully opaque using the standard PICO-8 palette
- The script is idempotent: re-running it produces a byte-for-byte identical PNG
- The generated PNG is committed to the repository so a browser environment can load it without running the extraction script
