/**
 * Создаёт анимацию таймера обратного отсчёта в игре.
 * @export
 * @class GameCountdown
 */
export default class GameCountdown {
  /**
   * Creates an instance of GameCountdown.
   * @param {requestCallback} onTimeEndCallback - функция, вызываемая по истечении времени таймера.
   */
  constructor(onTimeEndCallback) {
    this.animationDuration = 300000; // 5 минут в миллисекундах
    this.timePerFrame = 1000; // обновляем раз в секунду

    this.lastFrameUpdateTime = null;
    this.timePassedSinceLastUpdate = null;
    this.animationStartTime = null;

    this.animationRequest = null;

    this.startCountdown = this.startCountdown.bind(this);
    this.endCountdown = this.endCountdown.bind(this);
    this.draw = this.draw.bind(this);
    this.prepareLayout = this.prepareLayout.bind(this);
    this.getAmountOfTimeLeft = this.getAmountOfTimeLeft.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.onTimeEndCallback = onTimeEndCallback;
  }

  startCountdown() {
    this.animationRequest = requestAnimationFrame(this.draw);
    this.prepareLayout();
  }

  endCountdown() {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
      this.animationRequest = null;
      this.lastFrameUpdateTime = null;
      this.timePassedSinceLastUpdate = null;
      this.animationStartTime = null;
      this.updateValues(this.animationDuration);
    }
  }

  onTimeEnd() {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }

    this.onTimeEndCallback();
  }

  draw(currentTime) {
    if (!this.animationStartTime) {
      this.animationStartTime = currentTime;
    }
    if (!this.lastFrameUpdateTime) {
      this.lastFrameUpdateTime = currentTime;
    }
    this.timePassedSinceLastUpdate = currentTime - this.lastFrameUpdateTime;

    if (this.timePassedSinceLastUpdate > this.timePerFrame) {
      this.lastFrameUpdateTime = currentTime;

      const currentCountdownValue = this.getAmountOfTimeLeft(Math.round(currentTime / 1000) * 1000);

      if (currentCountdownValue < 0) {
        this.onTimeEnd();
        return;
      }

      this.updateValues(currentCountdownValue);
    }

    if (this.animationRequest) {
      requestAnimationFrame(this.draw);
    }
  }

  prepareLayout() {
    const timerElement = document.querySelector(`.game__counter`);
    this.minutes = timerElement.querySelector(`span:first-child`);
    this.seconds = timerElement.querySelector(`span:last-child`);
  }

  getAmountOfTimeLeft(currentTime) {
    return this.animationDuration - (currentTime - this.animationStartTime);
  }

  updateValues(time) {
    const minutes = new Date(time).getMinutes();
    const seconds = new Date(time).getSeconds();

    const paddedMinutes = String(minutes).padStart(2, 0);
    const paddedSeconds = String(seconds).padStart(2, 0);

    this.minutes.innerHTML = paddedMinutes;
    this.seconds.innerHTML = paddedSeconds;
  }
}
