class Chat {
  constructor() {
    this.$player = null;
    this.$chat = null;
    this.$header = null;

    this.chatObserver = this.createChatObserver();
    this.chatTheaterObserver = this.createChatTheaterObserver();

    this.scrollListener = null;
  }

  init(player) {
    this.$player = player;
    this.onPlayerLoaded();
  }

  // OBSERVERS
  //
  createChatObserver() {
    return new MutationObserver((mutations) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes)
      );

      const chat = addedNodes.find(
        (node) => node.nodeName === "YTD-LIVE-CHAT-FRAME"
      );

      if (chat) {
        this.$chat = chat;
        this.onChatLoaded();
      }
    });
  }

  createChatTheaterObserver() {
    return new MutationObserver(() => {
      if (this.$chat.hasAttribute("theater-watch-while")) {
        this.addScrollEvent();
      } else {
        this.removeScrollEvent();
      }
    });
  }

  // EVENTS
  //
  onPlayerLoaded() {
    this.chatObserver.observe(this.$player, {
      childList: true,
      subtree: true,
    });
  }

  onChatLoaded() {
    if (this.$chat.hasAttribute("theater-watch-while")) this.addScrollEvent();

    this.chatTheaterObserver.observe(this.$chat, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["theater-watch-while"],
    });
  }

  // HELPERS
  //
  addScrollEvent = () => {
    this.scrollListener = window.addEventListener(
      "scroll",
      this.chatResizeOnScroll,
      { passive: true }
    );
  };

  removeScrollEvent = () => {
    window.removeEventListener("scroll", this.scrollListener);
  };

  chatResizeOnScroll = (e) => {
    this.$header = this.$header || document.querySelector("ytd-masthead");

    if (this.$chat) {
      const top = Math.max(0, this.$header.offsetHeight - window.scrollY);
      this.$chat.setAttribute("style", `top: ${top}px !important;`);
    }
  };
}
