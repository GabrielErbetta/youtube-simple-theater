class TheaterMode {
  constructor() {
    console.log("CONSTRUCTOR")
    this.$player = null;

    this.playerObserver = this.createPlayerObserver();
    this.theaterObserver = this.createTheaterObserver();
    this.styleObserver = this.createStyleObserver();
  }

  init(ytAppEl) {
    console.log("INIT");
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
      console.log("LOADPLAYER");
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      const player = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY",
      );

      if (player) {
        console.log("LOADPLAYER - PLAYER_EL FOUND");
        console.log(player)

        this.$player = player;
        self.disconnect();

        this.onPlayerLoaded();
      }
    });
  }

  createTheaterObserver() {
    return new MutationObserver((mutations) => {
      console.log("THEATER OBSERVER");
      const theaterMutation = mutations.find(
        (mutation) => mutation.oldValue == null,
      );

      if (theaterMutation?.target?.hasAttribute("theater")) {
        this.onTheaterAdded();
        console.log("THEATER OBSERVER - HAS TEATHER");
      }
    });
  }

  createStyleObserver() {
    return new MutationObserver((_mutations, self) => {
      console.log("STYLE OBSERVER");
      self.disconnect();
      setTimeout(() => this.scrollToFullScreen(1000), 10);
    });
  }

  // ACTIONS
  //
  onPlayerLoaded() {
    if (this.$player.hasAttribute("theater")) {
      console.log("LOADPLAYER - PLAYER_EL HAS THEATER");
      setTimeout(() => this.scrollToFullScreen(1000), 10);
    }

    this.theaterObserver.observe(this.$player, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["theater"],
    });
  }

  onTheaterAdded() {
    this.styleObserver.observe(this.$player, {
      attributes: true,
      attributeFilter: ["style"],
    });
  }

  scrollToFullScreen(maxTime) {
    console.log("FULLSCREEN");
    this.$player.scrollIntoView();

    if (window.scrollY == 0 && maxTime > 0) {
      console.log("FULLSCREEN FAILED");
      setTimeout(() => this.scrollToFullScreen(maxTime - 20), 20);
    }
  }
}
