const targets = [
  {
    animateTarget: `primaryAwardAppear`,
    parent: `prizes-journeys`
  },
  {
    animateTarget: `secondaryAwardAppear`,
    parent: `prizes-cases`
  },
  {
    animateTarget: `additionalAwardAppear`,
    parent: `prizes-codes`
  }
];

class SvgAnimation {
  constructor({animateTarget, screenName, parent}) {
    this._animateTarget = animateTarget;
    this._screenName = screenName;
    this._parent = parent;
    this._isPlayed = false;

    this.beginAnimation = this.beginAnimation.bind(this);
  }

  beginAnimation() {
    if (this._isPlayed) {
      return;
    }

    const element = document.getElementById(this._animateTarget);

    if (element === null) {
      return;
    }

    element.beginElement();
    this._isPlayed = true;
  }

  init() {
    const node = document.getElementById(this._parent);

    node.addEventListener(`transitionstart`, this.beginAnimation);
    if (this._parent === `prizes-journeys`) {
      setTimeout(() => {
        node.classList.add(`visible`);
      }, 2450);
    }
  }
}

export default () => {
  targets.forEach(({animateTarget, screenName, parent}) => {
    const svgAnimation = new SvgAnimation({animateTarget, screenName, parent});
    svgAnimation.init();
  });
};
