class TheaterMode {
  constructor() {
    this.loadPlayerObserver = new MutationObserver((mutations, self) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      this.PLAYER_EL = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY",
      );

      if (this.PLAYER_EL) {
        self.disconnect();

        this.theaterObserver.observe(this.PLAYER_EL, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ["theater"],
        });

        if (this.PLAYER_EL.hasAttribute("theater"))
          setTimeout(() => this.scrollToFullScreen(1000), 10);
      }
    });

    this.theaterObserver = new MutationObserver((mutations) => {
      const theaterMutation = mutations.find(
        (mutation) => mutation.oldValue == null,
      );

      if (theaterMutation?.target?.hasAttribute("theater"))
        this.styleObserver.observe(theaterMutation.target, {
          attributes: true,
          attributeFilter: ["style"],
        });
    });

    this.styleObserver = new MutationObserver((_mutations, self) => {
      self.disconnect();
      setTimeout(() => this.scrollToFullScreen(1000), 10);
    });
  }

  scrollToFullScreen(maxTime) {
    this.PLAYER_EL.scrollIntoView();

    if (window.scrollY == 0 && maxTime > 0) {
      setTimeout(() => this.scrollToFullScreen(maxTime - 20), 20);
    }
  }

  init(ytAppEl) {
    this.loadPlayerObserver.observe(ytAppEl, {
      childList: true,
      subtree: true,
    });
  }
}
