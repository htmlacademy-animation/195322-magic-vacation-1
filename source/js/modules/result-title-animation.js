const STROKE_OPTIONS = {
  attributeName: `stroke-dasharray`,
  fill: `freeze`,
};

const SCALE_OPTIONS = {
  attributeName: `transform`,
  type: `scale`,
  from: `1.2 1.2`,
  to: `1 1`,
  dur: `0.5s`,
  fill: `freeze`,
  additive: `sum`,
};

const TRANSLATE_OPTIONS_BASE = {
  delay: 0.1,
  offset: 150,
};

const TRANSLATE_OPTIONS = {
  attributeName: `transform`,
  type: `translate`,
  values: `0 0; 0 ${TRANSLATE_OPTIONS_BASE.offset}; 0 ${TRANSLATE_OPTIONS_BASE.offset + 20}; 0 ${TRANSLATE_OPTIONS_BASE.offset}`,
  keyTimes: `0; 0.8; 0.85; 1`,
  dur: `0.7s`,
  fill: `freeze`,
  additive: `sum`,
};

const OPACITY_OPTIONS = {
  attributeName: `opacity`,
};

const createSvgAnimationElement = (tag) => document.createElementNS(`http://www.w3.org/2000/svg`, tag);

const setAnimationAttributes = ({element, attrs}) => {
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });

  return element;
};

const createStrokeAnimation = ({id, begin, length, points, dur}) => {
  const dash = Math.round(length / points);

  return setAnimationAttributes({
    element: createSvgAnimationElement(`animate`),
    attrs: {
      id,
      begin,
      from: `0 ${dash}`,
      to: `${dash} 0`,
      dur,
      ...STROKE_OPTIONS,
    },
  });
};

const createTransformAnimation = ({id, values, begin}) => setAnimationAttributes({
  element: createSvgAnimationElement(`animateTransform`),
  attrs: {
    id,
    begin,
    ...values
  },
});

const createOpacitySet = ({id, to, begin}) => setAnimationAttributes({
  element: createSvgAnimationElement(`set`),
  attrs: {
    id,
    to,
    begin,
    ...OPACITY_OPTIONS,
  },
});

const clearAnimationTags = (animationContainer) => {
  while (animationContainer.hasChildNodes()) {
    animationContainer.removeChild(animationContainer.firstChild);
  }
};

const createVictoryAnimation = (element) => {
  const id = element.id.replace(/-/g, `_`);
  const firstAnimationId = `${id}_opacity`;

  element.setAttribute(`opacity`, `0`);

  clearAnimationTags(element);

  element.appendChild(
      createOpacitySet({
        id: firstAnimationId,
        to: `1`,
        begin: `indefinite`
      })
  );

  element.appendChild(
      createTransformAnimation({
        id: `${id}_scale`,
        values: SCALE_OPTIONS,
        begin: `${firstAnimationId}.begin`
      })
  );

  const parts = element.querySelectorAll(`path`);
  parts.forEach((part, index) => part.appendChild(
      createStrokeAnimation({
        id: `${id}_${index + 1}_stroke`,
        begin: `${firstAnimationId}.begin`,
        length: part.getTotalLength(),
        points: 3,
        dur: `0.5s`,
      })
  ));

  document.querySelector(`#${firstAnimationId}`).beginElement();
};

const createFailAnimation = (element) => {
  const id = element.id.replace(/-/g, `_`);
  const firstAnimationId = `${id}_1_translate`;

  element.setAttribute(`style`, `transform: translate(0, -${TRANSLATE_OPTIONS_BASE.offset}px); overflow: visible;`);

  const parts = element.querySelectorAll(`path`);
  parts.forEach((part, index) => {
    const translationId = index === 0 ? firstAnimationId : `${id}_${index + 1}_translate`;
    const staggeredDelay = TRANSLATE_OPTIONS_BASE.delay / 2 + TRANSLATE_OPTIONS_BASE.delay * 1 / (1 / index + 1);
    const translationBegin = index === 0 ? `indefinite` : `${id}_${index}_translate.begin + ${staggeredDelay}s`;
    const opacityBegin = index === 0 ? `${firstAnimationId}.begin` : `${id}_${index}_translate.begin + ${staggeredDelay}s`;
    const strokeBegin = opacityBegin;

    part.setAttribute(`opacity`, `0`);

    clearAnimationTags(part);

    part.appendChild(
        createTransformAnimation({
          id: translationId,
          values: TRANSLATE_OPTIONS,
          begin: translationBegin,
        })
    );

    part.appendChild(
        createOpacitySet({
          id: `${id}_${index + 1}_opacity`,
          to: 1,
          begin: opacityBegin,
        })
    );

    part.appendChild(
        createStrokeAnimation({
          id: `${id}_${index + 1}_stroke`,
          begin: strokeBegin,
          length: part.getTotalLength(),
          points: 2,
          dur: `0.4s`,
        })
    );
  });

  document.querySelector(`#${firstAnimationId}`).beginElement();
};

const startAnimationByClick = ({elementSelector, buttonSelector, createAnimation}) => {
  const button = document.querySelector(buttonSelector);

  button.addEventListener(`click`, () => {
    const element = document.querySelector(elementSelector);

    createAnimation(element);
  });
};

export default () => {
  startAnimationByClick({
    elementSelector: `#result-title-svg-victory`,
    buttonSelector: `.js-show-result[data-target=result]`,
    createAnimation: createVictoryAnimation,
  });

  startAnimationByClick({
    elementSelector: `#result-title-svg-victory-2`,
    buttonSelector: `.js-show-result[data-target=result2]`,
    createAnimation: createVictoryAnimation,
  });

  startAnimationByClick({
    elementSelector: `#result-title-svg-fail`,
    buttonSelector: `.js-show-result[data-target=result3]`,
    createAnimation: createFailAnimation,
  });
};
