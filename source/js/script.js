// modules
import document from './modules/document';
import mobileHeight from './modules/mobile-height-adjust.js';
import slider from './modules/slider.js';
import menu from './modules/menu.js';
import footer from './modules/footer.js';
import chat from './modules/chat.js';
import result from './modules/result.js';
import form from './modules/form.js';
import social from './modules/social.js';
import FullPageScroll from './modules/full-page-scroll';
import AccentTypographyBuild from './modules/accent-typography-build';

// init modules
document();
mobileHeight();
slider();
menu();
footer();
chat();
result();
form();
social();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();

const introTitleAnimation = new AccentTypographyBuild(
    `.intro__title`,
    600,
    `active-animation`,
    `transform`,
    false,
    1000
);

const contestDateAnimation = new AccentTypographyBuild(
    `.intro__date`,
    500,
    `active-animation`,
    `transform`,
    true,
    2400
);

const historyTitleAnimation = new AccentTypographyBuild(
    `.slider__item-title`,
    500,
    `active-animation`,
    `transform`,
    true,
    0
);

const prizesTitleAnimation = new AccentTypographyBuild(
    `.prizes__title`,
    500,
    `active-animation`,
    `transform`,
    true,
    0
);

const rulesTitleAnimation = new AccentTypographyBuild(
    `.rules__title`,
    500,
    `active-animation`,
    `transform`,
    true,
    0
);

const gameTitleAnimation = new AccentTypographyBuild(
    `.game__title`,
    500,
    `active-animation`,
    `transform`,
    true,
    0
);

introTitleAnimation.runAnimation();
contestDateAnimation.runAnimation();
historyTitleAnimation.runAnimation();
prizesTitleAnimation.runAnimation();
rulesTitleAnimation.runAnimation();
gameTitleAnimation.runAnimation();
