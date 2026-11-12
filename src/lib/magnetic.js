// "Magnetic" buttons: the element leans toward the pointer and snaps back on leave.
// Spread onto an element: <a {...magnetic} />
export const magnetic = {
  onPointerMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    el.style.transform = `translate(${x}px,${y}px)`;
  },
  onPointerLeave(e) {
    e.currentTarget.style.transform = '';
  },
};
