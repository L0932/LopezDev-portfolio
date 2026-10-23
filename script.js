const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mobileLayout = window.matchMedia("(max-width: 700px)");

function setMenuOpen(open) {
  menuToggle.setAttribute("aria-expanded", String(open));
  navigation.hidden = mobileLayout.matches && !open;
}

function syncNavigation() {
  menuToggle.hidden = !mobileLayout.matches;
  setMenuOpen(false);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuOpen(!isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a") && mobileLayout.matches) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

mobileLayout.addEventListener("change", syncNavigation);

syncNavigation();