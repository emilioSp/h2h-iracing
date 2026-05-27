// Scroll-triggered reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
);

document.querySelectorAll('[data-reveal]').forEach((el) => {
  revealObserver.observe(el);
});

// YouTube lazy embed — avoids loading YouTube JS until user clicks
const ytContainer = document.getElementById('yt-container');
if (ytContainer) {
  ytContainer.addEventListener('click', () => {
    const videoId = ytContainer.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = 'H2H iRacing demonstration';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.className = 'absolute inset-0 w-full h-full border-0';
    ytContainer.replaceChildren(iframe);
  });
}
