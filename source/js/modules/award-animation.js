import {PrizesCountersAnimation} from './prizes-counters-animation';

const targets = [
  {
    animateTarget: `primaryAwardAppear`,
    parent: `prizes-journeys`,
    descriptionAppearDelay: 2500,
    finalAmount: 3
  },
  {
    animateTarget: `secondaryAwardAppear`,
    parent: `prizes-cases`,
    descriptionAppearDelay: 1250,
    finalAmount: 7
  },
  {
    animateTarget: `additionalAwardAppear`,
    parent: `prizes-codes`,
    descriptionAppearDelay: 1000,
    firstAmount: 11,
    finalAmount: 900
  }
];

class AwardAnimation {
  constructor({animateTarget, descriptionAppearDelay, parent, firstAmount, finalAmount}) {
    this.ANIMATED_CLASS_NAME = `animated`;

    this.animateTarget = animateTarget;
    this.descriptionAppearDelay = descriptionAppearDelay;
    this.parent = parent;
    this.firstAmount = firstAmount;
    this.finalAmount = finalAmount;
    this.isPlayed = false;
    this.awardEl = null;
    this.numberAnimation = null;

    this.beginAnimation = this.beginAnimation.bind(this);
    this.onEndAnimation = this.onEndAnimation.bind(this);
  }

  beginAnimation() {
    if (this.isPlayed) {
      return;
    }

    const element = document.getElementById(this.animateTarget);

    if (element === null) {
      return;
    }

    element.beginElement();

    const description = this.awardEl.querySelector(`.js-prizes-desc`);
    const isPortrait = window.innerWidth < window.innerHeight;
    const notIsDesktop = window.innerWidth < 1024;
    const delay = notIsDesktop && isPortrait ? 0 : this.descriptionAppearDelay;

    setTimeout(() => {
      description.classList.add(this.ANIMATED_CLASS_NAME);

      if (!this.numberAnimation) {
        return;
      }

      this.numberAnimation.startEnumeration();
    }, delay);

    this.isPlayed = true;
  }

  /**
   * Этот коллбэк добавляет элементу класс animated
   * @callback requestCallback
   */
  onEndAnimation() {
    this.awardEl.classList.add(this.ANIMATED_CLASS_NAME);
  }

  init(parent) {
    this.awardEl = document.getElementById(parent);
    this.awardEl.addEventListener(`transitionstart`, this.beginAnimation);
    if (parent === `prizes-journeys`) {
      setTimeout(() => {
        this.awardEl.classList.add(`visible`);
      }, 2450);
    }
    const numberEl = this.awardEl.querySelector(`.js-prizes-number`);

    if (!numberEl) {
      return;
    }

    this.numberAnimation = new PrizesCountersAnimation({
      targetElement: numberEl,
      firstAmount: this.firstAmount,
      finalAmount: this.finalAmount,
      onEndAnimationCallback: this.onEndAnimation
    });
  }
}

export default () => {
  targets.forEach(({animateTarget, parent, descriptionAppearDelay, firstAmount, finalAmount}) => {
    const awardAnimation = new AwardAnimation({animateTarget, descriptionAppearDelay, firstAmount, finalAmount});
    awardAnimation.init(parent);
  });
};
