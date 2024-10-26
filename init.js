window.addEventListener("yt-navigate-finish", () => {
  console.log('LOCATION')
  console.log(location.href)
  if (!window.location.pathname.match(/^\/watch/))
    return;

  console.log("INIT.JS")
  const ytAppEl = document.querySelector("ytd-app");
  console.log(ytAppEl)

  const theaterMode = new TheaterMode();
  theaterMode.init(ytAppEl);

  const chat = new Chat();
  chat.init(ytAppEl);
});
