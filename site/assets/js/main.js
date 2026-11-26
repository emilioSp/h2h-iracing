// Loads the marketing video's YouTube player only when the visitor clicks.
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
    iframe.className = 'absolute inset-0 size-full rounded-2xl border-0';
    ytContainer.replaceChildren(iframe);
  });
}
