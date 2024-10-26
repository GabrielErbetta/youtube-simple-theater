class Page {
  constructor() {
    this.$player = null;

    this.playerObserver = this.createPlayerObserver();

    this.chat = null;
    this.theaterMode = null;
  }

  init(ytAppEl) {
    const player = document.querySelector("ytd-watch-flexy");

    if (player) {
      this.$player = player;
      this.onPlayerLoaded();
    } else {
      this.playerObserver.observe(ytAppEl, {
        childList: true,
        subtree: true,
      });
    }
  }

  // OBSERVERS
  //
  createPlayerObserver() {
    return new MutationObserver((mutations, self) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes)
      );

      const player = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY"
      );

      if (player) {
        self.disconnect();

        this.$player = player;
        this.onPlayerLoaded();
      }
    });
  }

  // EVENTS
  //
  onPlayerLoaded() {
    this.theaterMode = new TheaterMode();
    this.theaterMode.init(this.$player);

    this.chat = new Chat();
    this.chat.init(this.$player);
  }
}
