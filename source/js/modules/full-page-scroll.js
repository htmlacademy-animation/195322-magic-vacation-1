import throttle from 'lodash/throttle';
import GameCountdown from './game-countdown';

export default class FullPageScroll {
  constructor() {
    this.HIDDEN_SCREEN_CLASS_NAME = `screen--hidden`;
    this.ACTIVE_SCREEN_CLASS_NAME = `active`;
    this.VISITED_SCREEN_CLASS_NAME = `visited`;
    this.THROTTLE_TIMEOUT = 1000;
    this.SCREEN_TRANSITION_TIMEOUT = 100;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
    this.gameCountdown = null;
    this.onCountdownTimeEnd = this.onCountdownTimeEnd.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    let isHistoryScreenActive = false;
    const historyScreenTransitionTimeout = 500;
    const fillBgScreenClassName = `screen--with-bg`;

    this.screenElements.forEach((screen) => {
      if (screen.id === `story` && screen.classList.contains(this.ACTIVE_SCREEN_CLASS_NAME)) {
        isHistoryScreenActive = true;
        screen.classList.remove(this.ACTIVE_SCREEN_CLASS_NAME);
        screen.classList.add(fillBgScreenClassName);

        setTimeout(() => {
          screen.classList.add(this.HIDDEN_SCREEN_CLASS_NAME);
          screen.classList.remove(fillBgScreenClassName);
        }, historyScreenTransitionTimeout);
      } else {
        screen.classList.add(this.HIDDEN_SCREEN_CLASS_NAME);
        screen.classList.remove(this.ACTIVE_SCREEN_CLASS_NAME);
      }
    });

    if (isHistoryScreenActive) {
      setTimeout(() => {
        this.setActiveScreen();
      }, historyScreenTransitionTimeout);
    } else {
      this.setActiveScreen();
    }

    if (this.screenElements[this.activeScreen].id === `game`) {
      setTimeout(() => {
        this.initNewGameCountdown();
      }, this.SCREEN_TRANSITION_TIMEOUT);
    } else {
      this.cancelGameCountdown();
    }
  }

  setActiveScreen() {
    this.screenElements[this.activeScreen].classList.remove(this.HIDDEN_SCREEN_CLASS_NAME);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(this.ACTIVE_SCREEN_CLASS_NAME);
      this.screenElements[this.activeScreen].classList.add(this.VISITED_SCREEN_CLASS_NAME);
    }, this.SCREEN_TRANSITION_TIMEOUT);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(this.ACTIVE_SCREEN_CLASS_NAME));
      activeItem.classList.add(this.ACTIVE_SCREEN_CLASS_NAME);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  initNewGameCountdown() {
    this.gameCountdown = new GameCountdown(this.onCountdownTimeEnd);

    this.gameCountdown.startCountdown();
  }

  cancelGameCountdown() {
    this.gameCountdown.endCountdown();

    this.gameCountdown = null;
  }

  onCountdownTimeEnd() {
    this.gameCountdown = null;
    const results = document.querySelectorAll(`.screen--result`);
    const targetEl = [].slice.call(results).find((el) => el.getAttribute(`id`) === `result3`);
    targetEl.classList.add(`screen--show`);
    targetEl.classList.remove(this.HIDDEN_SCREEN_CLASS_NAME);

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, () => {
        this.initNewGameCountdown.call(this);
      }, {once: true});
    }
  }
}
