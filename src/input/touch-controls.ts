export interface TouchControlState {
  left: boolean;
  right: boolean;
}

// Wires up the on-screen buttons declared in index.html (visible only on
// touch-primary devices via the #touch-controls media query). left/right
// are held state read every frame; jump fires once per press.
export function createTouchControls(onJump: () => void): TouchControlState {
  const state: TouchControlState = { left: false, right: false };

  const left  = document.getElementById("touch-left");
  const right = document.getElementById("touch-right");
  const jump  = document.getElementById("touch-jump");

  const bindHold = (el: HTMLElement | null, setter: (v: boolean) => void) => {
    if (!el) return;
    const start = (e: Event) => { e.preventDefault(); setter(true); };
    const end   = (e: Event) => { e.preventDefault(); setter(false); };
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("pointerleave", end);
  };

  bindHold(left,  (v) => (state.left = v));
  bindHold(right, (v) => (state.right = v));

  jump?.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    onJump();
  });

  return state;
}
