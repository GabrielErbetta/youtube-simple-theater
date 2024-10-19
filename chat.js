class Chat {
  constructor() {
    this.loadContainerObserver = new MutationObserver((mutations, self) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      this.PLAYER_EL = addedNodes.find(
        (node) => node.nodeName === "YTD-WATCH-FLEXY",
      );

      if (this.PLAYER_EL) {
        self.disconnect();

        this.loadChatObserver.observe(this.PLAYER_EL, {
          childList: true,
          subtree: true,
        });
      }
    });

    this.loadChatObserver = new MutationObserver((mutations) => {
      const addedNodes = mutations.flatMap((mutation) =>
        Array.from(mutation.addedNodes),
      );

      const chatEl = addedNodes.find(
        (node) => node.nodeName === "YTD-LIVE-CHAT-FRAME",
      );

      if (chatEl) {
        this.CHAT_EL = chatEl;

        if (this.CHAT_EL.hasAttribute("theater-watch-while"))
          this.addScrollEvent();

        this.toggleResizeObserver.observe(this.CHAT_EL, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ["theater-watch-while"],
        });
      }
    });

    this.toggleResizeObserver = new MutationObserver(() => {
      if (this.CHAT_EL.hasAttribute("theater-watch-while")) {
        this.addScrollEvent();
      } else {
        this.removeScrollEvent();
      }
    });
  }

  addScrollEvent = () => {
    this.scrollListener = window.addEventListener(
      "scroll",
      this.chatResizeOnScroll,
      { passive: true },
    );
  };

  removeScrollEvent = () => {
    window.removeEventListener("scroll", this.scrollListener);
  };

  chatResizeOnScroll = (e) => {
    this.HEADER_EL = this.HEADER_EL || document.querySelector("ytd-masthead");

    if (this.CHAT_EL) {
      const top = Math.max(0, this.HEADER_EL.offsetHeight - window.scrollY);
      this.CHAT_EL.setAttribute("style", `top: ${top}px !important;`);
    }
  };

  init(ytAppEl) {
    this.loadContainerObserver.observe(ytAppEl, {
      childList: true,
      subtree: true,
    });
  }
}
