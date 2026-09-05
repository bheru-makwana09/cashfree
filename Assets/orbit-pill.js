/**
 * Sets up the orbiting icon pill. Icons are static <img> elements
 * already in the HTML (each with a data-angle attribute) — this
 * function does not create them, it only reads and animates them.
 *
 * The orbit's centre is offset from the pill's right socket by
 * `radius`, so the socket coordinate is exactly the orbit's 180deg
 * point. Whichever icon's current angle is nearest 180 is scaled
 * up and drawn on top, giving the illusion that the pill's icon
 * "switches". Requires GSAP to already be loaded on the page.
 */
function initOrbitPill(config = {}) {
  const {
    stageSelector = '#stage',
    orbitSelector = '#orbit',
    itemSelector = '.orbit-item',
    radius = 185,          // orbit radius in px
    stepMove = 0.9,        // seconds to advance one icon
    stepHold = 1.4,        // seconds paused with an icon docked
    dragSensitivity = 0.6, // degrees of rotation per pixel dragged
  } = config;

  const stage = document.querySelector(stageSelector);
  const orbit = document.querySelector(orbitSelector);
  if (!stage || !orbit) return;

  const els = Array.from(orbit.querySelectorAll(itemSelector)).map(el => ({
    el,
    base: parseFloat(el.dataset.angle) || 0,
  }));
  if (!els.length) return;

  // centre of the .slot-right circle, derived from the pill's CSS layout
  // (left:68 + width:274 - right-inset:8 - half-slot:40)
  const socketCenter = { x: 68 + 274 - 8 - 40, y: 190 + 8 + 40 };
  const CENTER = { x: socketCenter.x + radius, y: socketCenter.y };

  function angularDelta(a, b) {
    const d = Math.abs(a - b) % 360;
    return d > 180 ? 360 - d : d;
  }

  function render(rotation) {
    els.forEach(({ el, base }) => {
      const angle = (base + rotation) % 360;
      const rad = angle * Math.PI / 180;
      const x = CENTER.x + radius * Math.cos(rad);
      const y = CENTER.y + radius * Math.sin(rad);

      const delta = angularDelta(angle, 180);   // 0 = at socket, 180 = opposite side
      const t = 1 - delta / 180;                 // 1 = front & centre, 0 = far side
      const scale   = 0.55 + t * 0.85;
      const opacity = 0.32 + t * 0.68;

      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      el.style.opacity   = opacity;
      el.style.zIndex    = Math.round(t * 100) + 1;
    });
  }

  // ---- auto-advance: one icon at a time, then hold ----
  const proxy = { angle: 0 };
  const STEP = 360 / els.length;

  let tl;
  function startAutoPlay() {
    tl = gsap.timeline({ repeat: -1 });
    els.forEach(() => {
      tl.to(proxy, {
          angle: `+=${STEP}`,
          duration: stepMove,
          ease: 'back.out(1.7)',
          onUpdate: () => render(proxy.angle),
        })
        .to({}, { duration: stepHold });
    });
  }

  // ---- drag control: dragging up OR down both spin the orbit
  // forward in the same direction — only the drag *distance*
  // (not its sign) is applied to the rotation. ----
  let dragging = false;
  let lastY = 0;

  function onPointerDown(e) {
    dragging = true;
    lastY = e.clientY;
    stage.classList.add('dragging');
    stage.setPointerCapture(e.pointerId);
    if (tl) tl.kill();
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const deltaY = e.clientY - lastY;
    lastY = e.clientY;
    proxy.angle += Math.abs(deltaY) * dragSensitivity; // always forward
    render(proxy.angle);
  }

  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('dragging');
    stage.releasePointerCapture(e.pointerId);

    const target = Math.round(proxy.angle / STEP) * STEP; // snap to nearest icon
    gsap.to(proxy, {
      angle: target,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => render(proxy.angle),
      onComplete: startAutoPlay,
    });
  }

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);

  render(0);
  startAutoPlay();
}