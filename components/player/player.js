class Player {
  constructor(youtubeId, playerSelector, buttonSelector) {
    this.youtubeId = youtubeId;
    this.playerSelector = playerSelector;
    this.buttonSelector = buttonSelector;
  }

  playerTemplate = `
    <div class="player__inner">
        <button class="player__close-btn">✕</button>
        <div class="player__content"></div>
    </div>
  `;

  focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  init() {
    this.playBtn = document.querySelector(this.buttonSelector);
    this.playBtn.addEventListener('click', this.showPlayer);

    this.playerEl = document.querySelector(this.playerSelector);
    this.playerEl.innerHTML = this.playerTemplate;
    this.playerEl.addEventListener('click', this.onBtnClickHandler);
    document.addEventListener('keyup', this.onEscUpHandler);

    const ytScript = this.ytScript = document.createElement('script');
    ytScript.async = true;
    ytScript.src = "https://www.youtube.com/player_api";
    document.head.append(ytScript);

    const ytPlayerEl = document.querySelector('.player__content');
    window.onYouTubePlayerAPIReady = () => {
      this.ytPlayer = new YT.Player(ytPlayerEl, {videoId: this.youtubeId});
    };
  }

  showPlayer = () => {
    this.playerEl.classList.add("player_visible");
    this.addTabIndex();
  };

  hidePlayer = () => {
    this.playerEl.classList.remove("player_visible");
  };

  onBtnClickHandler = ev => {
    if (ev.target.classList.contains('player__close-btn')) {
      this.hidePlayer();
      this.removeTabIndex();
    }
  };

  onEscUpHandler = ev => {
    if (ev.key === 'Escape') {
      this.hidePlayer();
      this.removeTabIndex();
    }
  };

  addTabIndex = () => {
    const focusableEls = document.querySelectorAll(this.focusableSelector);
    this.tabIndexBackup = new Map();
    focusableEls.forEach(el => {
      if (!el.closest(this.playerSelector)) {
        this.tabIndexBackup.set(el, el.tabIndex);
        el.tabIndex = -1;
      }
    });
  };

  removeTabIndex = () => {
    this.tabIndexBackup.forEach((backupValue, el) => el.tabIndex = backupValue);
  };

  destroy() {
    this.playBtn.removeEventListener('click', this.showPlayer);
    this.playerEl.removeEventListener('click', this.onBtnClickHandler);
    document.removeEventListener('keyup', this.onEscUpHandler);
    this.ytPlayer.destroy();
    document.head.removeChild(this.ytScript);
    this.playerEl.innerHTML = '';
  }
}

export default Player;
