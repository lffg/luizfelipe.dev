// @ts-check

window.addEventListener("load", () => {
  if (!location.hash.startsWith("#")) return;
  animateHashTarget(location.hash);
});

document.addEventListener("click", (e) => {
  if (!e.target) return;
  if (!(e.target instanceof HTMLElement)) return;

  const anc = e.target.closest("a");
  if (!anc || !anc.matches(".footnote-ref, .footnote-backref")) return;

  const targetSelector = anc.getAttribute("href");
  if (!targetSelector?.startsWith("#")) return;
  animateHashTarget(targetSelector);
});

/** @type {Animation | null} */
let prev = null;
/**
 * @param {string} targetSelector
 */
function animateHashTarget(targetSelector) {
  if (!targetSelector.startsWith("#")) {
    throw new Error("Unexpected targetSelector");
  }

  const target = document.getElementById(targetSelector.slice(1));
  if (!target) return;

  if (prev) prev.cancel();

  const opts = { duration: 800, iterations: 1 };
  prev = target.animate(
    [{ backgroundColor: "yellow" }, { backgroundColor: "initial" }],
    opts,
  );
}
