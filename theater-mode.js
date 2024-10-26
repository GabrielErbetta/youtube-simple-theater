class TheaterMode {
  constructor() {
    this.$player = null;
    this.$video = null;
    this.$navigationProgress = null;

    this.theaterObserver = this.createTheaterObserver();
    this.styleObserver = this.createStyleObserver();
  }

  init(player) {
    this.$player = player;
    this.onPlayerLoaded();
  }

  // OBSERVERS
  //
  createTheaterObserver() {
    return new MutationObserver((mutations) => {
      const theaterMutation = mutations.find(
        (mutation) => mutation.oldValue == null
      );

      if (theaterMutation?.target?.hasAttribute("theater"))
        this.onTheaterAdded();
    });
  }

  createStyleObserver() {
    return new MutationObserver((_mutations, self) => {
      self.disconnect();
      setTimeout(() => this.scrollToFullScreen(1000), 10);
    });
  }

  // EVENTS
  //
  onPlayerLoaded() {
    if (this.$player.hasAttribute("theater"))
      setTimeout(() => this.scrollToFullScreen(1000), 10);

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

  // HELPERS
  //
  isNavigating() {
    if (!this.$navigationProgress)
      this.$navigationProgress = document.querySelector(
        "yt-page-navigation-progress"
      );

    return (
      this.$navigationProgress &&
      !this.$navigationProgress.hasAttribute("hidden")
    );
  }

  isLoadingVideo() {
    if (!this.$video) this.$video = this.$player.querySelector("video");

    return !this.$video;
  }

  scrollToFullScreen(maxTime) {
    if (this.isNavigating() || this.isLoadingVideo())
      return setTimeout(() => this.scrollToFullScreen(maxTime - 10), 10);

    this.$player.scrollIntoView();

    if (window.scrollY == 0 && maxTime > 0)
      setTimeout(() => this.scrollToFullScreen(maxTime - 10), 10);
  }
}
