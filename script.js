/* Navegação simples e estável entre as telas */
document.addEventListener("DOMContentLoaded", function () {
  const screens = Array.from(document.querySelectorAll(".screen"));
  function goToScreen(id) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains("screen")) {
      console.warn("Tela não encontrada:", id);
      return;
    }
    screens.forEach(screen => { screen.hidden = screen !== target; });
    window.scrollTo(0, 0);
    const title = target.querySelector("h1, h2");
    if (title && id !== "screen-01") {
      title.setAttribute("tabindex", "-1");
      title.focus({preventScroll: true});
    }
  }
  document.addEventListener("click", function (event) {
    const button = event.target.closest("[data-goto]");
    if (button) goToScreen(button.getAttribute("data-goto"));
  });
  document.querySelectorAll(".opening-figure img").forEach(img => {
    img.addEventListener("error", () => img.closest(".opening-figure").classList.add("has-no-image"));
  });
  goToScreen("screen-01");
});
