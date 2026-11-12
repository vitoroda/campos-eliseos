/* ==========================================================
   O QUE A CIDADE ESCONDE? — script.js
   Navegação entre telas. Para adicionar uma nova tela, basta
   criar uma <section class="screen" id="screen-XX" hidden> no HTML
   e um botão com data-goto="screen-XX". Nenhuma mudança aqui.
   ========================================================== */

(function () {
  "use strict";

  // Estado central do site. Futuramente, as respostas dos
  // questionários poderão ser guardadas em `answers` e enviadas
  // a um Google Apps Script / Google Sheets.
  const appState = {
    currentScreen: "screen-01",
    answers: {}
  };

  const screens = document.querySelectorAll(".screen");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Duração da transição (lida do CSS; 0 se movimento reduzido) */
  function getTransitionDuration() {
    if (prefersReducedMotion.matches) return 0;
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--duracao-transicao");
    return parseInt(value, 10) || 400;
  }

  /* Move o foco para o título da nova tela (leitores de tela e teclado) */
  function focusScreen(screen) {
    const heading = screen.querySelector("h1, h2");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }

  /* Vai para a tela indicada pelo id */
  function goToScreen(targetId) {
    const target = document.getElementById(targetId);
    const current = document.getElementById(appState.currentScreen);
    if (!target || target === current) return;

    const duration = getTransitionDuration();

    function showTarget() {
      current.hidden = true;
      current.classList.remove("is-leaving");

      target.hidden = false;
      target.classList.add("is-entering");
      window.scrollTo(0, 0);

      // Aguarda um quadro para a transição de entrada acontecer
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          target.classList.remove("is-entering");
        });
      });

      appState.currentScreen = targetId;
      focusScreen(target);
    }

    if (duration === 0) {
      showTarget();
    } else {
      current.classList.add("is-leaving");
      setTimeout(showTarget, duration);
    }
  }

  /* Qualquer elemento com data-goto="screen-XX" navega até a tela */
  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-goto]");
    if (trigger) goToScreen(trigger.dataset.goto);
  });

  /* Fallback elegante se a imagem de abertura não existir */
  document.querySelectorAll(".opening-figure img").forEach(function (img) {
    const figure = img.closest(".opening-figure");
    function markMissing() { figure.classList.add("has-no-image"); }
    img.addEventListener("error", markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  /* Garante que apenas a tela atual esteja visível ao carregar */
  screens.forEach(function (screen) {
    screen.hidden = screen.id !== appState.currentScreen;
  });
})();

// TELA 02 — NAVEGAÇÃO ENTRE FOTOGRAFIAS

document.addEventListener("DOMContentLoaded", () => {
  const slides = Array.from(
    document.querySelectorAll("#screen-02 .three-times-slide")
  );

  const previous = document.getElementById("three-times-prev");
  const next = document.getElementById("three-times-next");
  const counter = document.getElementById("three-times-counter");

  if (!slides.length || !previous || !next || !counter) {
    return;
  }

  let current = 0;

  function showSlide(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, position) => {
      const active = position === current;
      slide.hidden = !active;
      slide.classList.toggle("is-active", active);
    });

    counter.textContent =
      String(current + 1).padStart(2, "0") +
      " / " +
      String(slides.length).padStart(2, "0");

    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }

  previous.addEventListener("click", () => {
    showSlide(current - 1);
  });

  next.addEventListener("click", () => {
    showSlide(current + 1);
  });

  showSlide(0);
});

