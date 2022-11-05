// TODO: когда подтянутся изменения из module4-task1, сделать класс PrizesCountersAnimation как extends GameCountdown
export class PrizesCountersAnimation {
  /**
   * Инициализирует PrizesCountersAnimation.
   * @param {Element} targetElement - целевой элемент анимации
   * @param {number} firstAmount - начальное значение, по умолчанию = 1
   * @param {number} finalAmount - целевое значение
   * @param {function} onEndAnimationCallback - efef
   */
  constructor(targetElement, firstAmount = 1, finalAmount, onEndAnimationCallback) {
    this.animationDuration = 750;
    this.timePerFrame = 1000 / 12; // 12 кадров в секунду
    this.targetElement = targetElement;

    this.firstAmount = firstAmount;
    this.increment = this.finalAmount / (this.animationDuration / this.timePerFrame);
    this.finalAmount = finalAmount;
    this.previousAmount = this.firstAmount;
    this.counter = 0;

    this.startTime = null;
    this.lastFrameUpdateTime = null;
    this.timePassedSinceLastUpdate = null;

    this.animationRequest = null;

    this.draw = this.draw.bind(this);

    this.onEndAnimationCallback = onEndAnimationCallback;
  }

  /**
   * Инициализирует анимацию, вызывает функцию requestAnimationFrame
   * c методом класса draw в качестве коллбэка.
   */
  startEnumeration() {
    this.animationRequest = requestAnimationFrame(this.draw);
  }

  /**
   * Метод, вызываемый при окончании анимации,
   * возвращает все изменяемые значения в начальное состояние.
   */
  endEnumeration() {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
      this.animationRequest = null;
      this.previousAmount = this.firstAmount;
      this.counter = 0;
      this.startTime = null;
      this.lastFrameUpdateTime = null;
      this.timePassedSinceLastUpdate = null;
      this.updateValues(this.finalAmount);
    }

    this.onEndAnimationCallback();
  }

  /**
   * На основании значения currentTime, передаваемого requestAnimationFrame в коллбэк,
   * выполняет пересчёт текущего значения в промежутке [firstAmount; finalAmount]
   * за время, равное animationDuration.
   * Значение currentAmount передаётся в вызываемый метод updateValues(), пока <= finalAmount.
   * При окончании анимации происходит вызов метода endEnumeration().
   * @param {number} currentTime - время, прошедшее с начала выполнения запроса в мс
   * @return {void}
   */
  draw(currentTime) {
    if (!this.lastFrameUpdateTime) {
      this.lastFrameUpdateTime = currentTime;
    }
    if (!this.startTime) {
      this.startTime = currentTime;
    }

    this.timePassedSinceLastUpdate = currentTime - this.lastFrameUpdateTime;

    if (currentTime - this.startTime >= this.animationDuration) {
      this.endEnumeration();
      return;
    }

    if (this.timePassedSinceLastUpdate > this.timePerFrame) {
      const currentAmount = this.getAmount();

      this.lastFrameUpdateTime = currentTime;

      if (currentAmount <= this.finalAmount) {
        this.updateValues(currentAmount);
        this.previousAmount = currentAmount;
        ++this.counter;
      }
    }

    if (this.animationRequest) {
      requestAnimationFrame(this.draw);
    }
  }

  getAmount() {
    return this.counter === 0 ? this.firstAmount : Math.ceil(this.previousAmount + this.increment);
  }

  /**
   * Записывает в разметку targetElement передаваемое значение.
   * @param {number} amount - текущее значение, которое нужно записать в целевой элемент
   */
  updateValues(amount) {
    this.targetElement.innerHTML = amount;
  }
}
