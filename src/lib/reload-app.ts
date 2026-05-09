export const APP_SOFT_RELOAD_EVENT = "app-soft-reload";

export function reloadApp() {
  if (typeof window === "undefined") return;

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();

  const overlay = document.createElement("div");
  overlay.setAttribute("data-app-reload-overlay", "true");
  Object.assign(overlay.style, {
    backdropFilter: "blur(24px) saturate(140%)",
    WebkitBackdropFilter: "blur(24px) saturate(140%)",
    backgroundColor: bg ? `${bg}66` : "rgba(0,0,0,0.25)",
    inset: "0",
    opacity: "0",
    pointerEvents: "auto",
    position: "fixed",
    transition: "opacity 140ms ease-out",
    zIndex: "2147483647",
  });
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(APP_SOFT_RELOAD_EVENT));
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.opacity = "0";
          window.setTimeout(() => {
            overlay.remove();
          }, 200);
        });
      });
    }, 180);
  });
}
