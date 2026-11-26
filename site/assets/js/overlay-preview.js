// Opens and closes the overlay screenshot preview on the marketing site.
const overlayPreview = document.querySelector('#overlay-preview');

const previewTitle = overlayPreview.querySelector('h2');

const previewImage = overlayPreview.querySelector('img');

for (const button of document.querySelectorAll('[data-overlay-image]')) {
  button.addEventListener('click', () => {
    const { overlayImage, overlayName } = button.dataset;
    previewTitle.textContent = overlayName;
    previewImage.alt = `${overlayName} overlay`;
    previewImage.src = overlayImage;
    button.focus({ preventScroll: true });
    overlayPreview.showModal();
  });
}

const closeOverlayPreview = async () => {
  if (overlayPreview.hasAttribute('data-closing')) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlayPreview.close();

    return;
  }

  const { opacity, transform } = getComputedStyle(overlayPreview);
  overlayPreview.dataset.closing = '';

  const animation = overlayPreview.animate(
    [
      { opacity, transform },
      { opacity: 0, transform: 'scale(0.9)' },
    ],
    { duration: 200, easing: 'ease-in', fill: 'forwards' },
  );

  await animation.finished;
  overlayPreview.close();
  animation.cancel();
  delete overlayPreview.dataset.closing;
};

for (const eventName of ['submit', 'cancel']) {
  overlayPreview.addEventListener(eventName, async (event) => {
    event.preventDefault();
    await closeOverlayPreview();
  });
}

overlayPreview.addEventListener('click', async (event) => {
  if (event.target === overlayPreview) {
    await closeOverlayPreview();
  }
});
