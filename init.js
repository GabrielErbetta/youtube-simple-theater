window.addEventListener("yt-navigate-finish", () => {
  if (!window.location.pathname.match(/^\/watch/)) return;

  const ytdApp = document.querySelector("ytd-app");
  const page = new Page();
  page.init(ytdApp);
});
