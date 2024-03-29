const targets = [
  {
    elementSelector: `.intro__title`,
    timer: 600,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: false,
    delay: 1000
  },
  {
    elementSelector: `.intro__date`,
    timer: 500,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: true,
    delay: 2400
  },
  {
    elementSelector: `.slider__item-title`,
    timer: 500,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: true,
    delay: 0
  },
  {
    elementSelector: `.prizes__title`,
    timer: 500,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: true,
    delay: 0
  },
  {
    elementSelector: `.rules__title`,
    timer: 500,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: true,
    delay: 0
  },
  {
    elementSelector: `.game__title`,
    timer: 500,
    classForActivate: `active-animation`,
    property: `transform`,
    isOneWord: true,
    delay: 0
  }
];

class AccentTypographyBuild {
  /**
   * Инициализирует AccentTypographyBuild.
   * @param {Object} typographyElement
   * @param { string } typographyElement.elementSelector - селектор, соотв. исходному блоку текста.
   * @param { number } typographyElement.timer - время анимации отдельной буквы.
   * @param { string } typographyElement.classForActivate - название класса для анимации.
   * @param { string } typographyElement.property - анимируемое css-свойство.
   * @param { boolean } typographyElement.isOneWord - если абзац состоит из одного слова.
   * @param { number } typographyElement.delay - задержка анимации для всего блока.
   */
  constructor({elementSelector, timer, classForActivate, property, isOneWord, delay}) {
    this.ONE_LETTER_DURATION = 50;

    this.elementSelector = elementSelector;
    this.timer = timer;
    this.classForActivate = classForActivate;
    this.property = property;
    this.isOneWord = isOneWord;
    this.delay = delay;
    this.element = document.querySelector(this.elementSelector);

    this.prePareText();
  }

  /**
   * Метод делает рандом более рандомным и контролируемым,
   * с возможностью задавать min и max значения
   * @param {number} min — минимально возможное число
   * @param {number} max — максимально возможное число
   * @return {number} — сгенерированное "случайное" число
   */
  random(min, max) {
    const random = Math.floor(Math.random() * (max - min) + min);

    return Math.floor(random / min) * min;
  }

  /**
   * Метод оборачивает в span'ы отдельные буквы слова.
   * Описывает transition для каждой буквы.
   * Задаёт задержку для последовательного появления всех букв.
   * @param { string } letter - буква
   * @param { number } wordLenght - длина исходного слова
   * @param { number } wordNumber — номер исходного слова в предложении
   * @return { HTMLSpanElement } — итоговый элемент
   */
  createElement(letter, wordLenght, wordNumber) {
    const span = document.createElement(`span`);
    // const timeOffset = Math.random() + this.timer;
    const timeOffset = this.random(
        this.ONE_LETTER_DURATION,
        wordLenght * this.ONE_LETTER_DURATION
    );

    span.textContent = letter;
    span.style.transition = `
      ${this.property} ${this.timer}ms ease ${wordNumber * wordLenght * this.ONE_LETTER_DURATION + this.delay + timeOffset}ms
    `;

    if (letter === ` `) {
      span.classList.add(`space`);
    }

    return span;
  }

  /**
   * Метод извлекает текст из элемента, разбивает его на слова.
   * Вызывает метод createElement.
   * Оборачивает каждое слово в отдельный span.
   * Заменяет содержимое исходного элемента.
   */
  prePareText() {
    if (!this.element) {
      return;
    }

    let text;

    if (this.isOneWord) {
      text = [this.element.textContent];
    } else {
      text = this.element.textContent.trim().split(` `).filter((latter)=>latter !== ``);
    }

    const content = text.reduce((fragmentParent, word, wordNumber) => {
      const wordElement = Array.from(word).reduce((fragment, latter, index, arr) => {
        fragment.appendChild(this.createElement(latter, arr.length, wordNumber));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`animation-text__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);
      return fragmentParent;
    }, document.createDocumentFragment());

    this.element.innerHTML = ``;
    this.element.appendChild(content);
  }

  /**
   * Метод запускает анимацию, добавляет активный класс.
   */
  runAnimation() {
    if (!this.element) {
      return;
    }
    this.element.classList.add(this.classForActivate);
  }

  /**
   * Метод возвращает анимацию в исходное состояние, удаляет активный класс.
   */
  destroyAnimation() {
    this.element.classList.remove(this.classForActivate);
  }
}


export default () => {
  targets.forEach(({elementSelector, timer, classForActivate, property, isOneWord, delay}) => {
    const typographyAnimation = new AccentTypographyBuild({elementSelector, timer, classForActivate, property, isOneWord, delay});

    typographyAnimation.runAnimation();
  });
};
