
/* ==========================================
   CAFÉ, CASAS E GENTE
   NAVEGAÇÃO ENTRE TELAS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  const screens = document.querySelectorAll(".screen");

  /* ========================================
     MOSTRAR UMA TELA
  ======================================== */

  function showScreen(screenId) {

    const target = document.getElementById(screenId);

    if (!target || !target.classList.contains("screen")) {
      console.warn(
        `A tela "${screenId}" ainda não existe.`
      );
      return;
    }

    screens.forEach((screen) => {
      screen.hidden = screen !== target;
    });

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    const heading = target.querySelector(
      "h1, h2, [tabindex='-1']"
    );

    if (heading && target.id !== "screen-01") {
      if (!heading.hasAttribute("tabindex")) {
        heading.setAttribute("tabindex", "-1");
      }

      heading.focus({
        preventScroll: true
      });
    }
  }

  /* ========================================
     BOTÕES DE NAVEGAÇÃO
  ======================================== */

  document.addEventListener("click", (event) => {

    const button = event.target.closest(
      "[data-goto]"
    );

    if (!button) {
      return;
    }

    const destination = button.getAttribute(
      "data-goto"
    );

    if (destination) {
      showScreen(destination);
    }

  });

  /* ========================================
     INICIALIZAÇÃO
  ======================================== */

  showScreen("screen-01");

});
