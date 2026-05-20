const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-visible");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

if (window.lucide) {
  window.lucide.createIcons();
}
