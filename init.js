const ytAppEl = document.querySelector("ytd-app");

const theaterMode = new TheaterMode();
theaterMode.init(ytAppEl);

const chat = new Chat();
chat.init(ytAppEl);
