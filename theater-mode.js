class TheaterMode {
  constructor() {
    this.loadPlayerObserver = new MutationObserver((mutations, observer) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      this.YT_PLAYER = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY",
      );

      if (this.YT_PLAYER) {
        observer.disconnect();

        this.theaterObserver.observe(this.YT_PLAYER, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ["theater"],
        });
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

      setTimeout(() => this.YT_PLAYER.scrollIntoView(), 10);
    });
  }

  init() {
    this.YT_APP = document.querySelector("ytd-app");
    this.loadPlayerObserver.observe(this.YT_APP, {
      childList: true,
      subtree: true,
    });
  }
}
