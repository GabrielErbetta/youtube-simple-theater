class TheaterMode {
  constructor() {
    this.loadPlayerObserver = new MutationObserver((mutations, observer) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      this.PLAYER_EL = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY",
      );

      if (this.PLAYER_EL) {
        observer.disconnect();

        this.theaterObserver.observe(this.PLAYER_EL, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ["theater"],
        });

        if (this.PLAYER_EL.hasAttribute("theater"))
          setTimeout(() => this.PLAYER_EL.scrollIntoView(), 10);
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

    this.styleObserver = new MutationObserver((_mutations, observer) => {
      observer.disconnect();

      setTimeout(() => this.PLAYER_EL.scrollIntoView(), 10);
    });
  }

  init(ytAppEl) {
    this.loadPlayerObserver.observe(ytAppEl, {
      childList: true,
      subtree: true,
    });
  }
}
