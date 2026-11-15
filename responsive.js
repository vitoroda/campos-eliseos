
/* Ajustes responsivos sem alterar a lógica original das telas. */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('screen-07');

  if (page) {
    const adjust = () => {
      if (window.matchMedia('(max-width:800px)').matches) {
        const photo = page.querySelector('.rail-slide .rail-photo');
        const train = page.querySelector('.rail-train-free');
        const track = page.querySelector('.rail-ground');

        if (photo && train && track) {
          const a = photo.getBoundingClientRect();
          const b = page.getBoundingClientRect();
          const y = a.bottom - b.top;

          train.style.top =
            Math.round(y - Math.min(90, a.height * .24)) + 'px';

          track.style.top = Math.round(y - 12) + 'px';
        }
      } else {
        const train = page.querySelector('.rail-train-free');
        const track = page.querySelector('.rail-ground');

        if (train) train.style.removeProperty('top');
        if (track) track.style.removeProperty('top');
      }
    };

    window.addEventListener('resize', adjust, { passive: true });

    const observer = new MutationObserver(adjust);

    observer.observe(page, {
      attributes: true,
      attributeFilter: ['hidden', 'class']
    });

    adjust();
  }
});
