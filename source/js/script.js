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
import accentTypographyBuild from './modules/accent-typography-build';
import awardAnimation from './modules/award-animation';
import resultTitleAnimation from './modules/result-title-animation';

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
accentTypographyBuild();
awardAnimation();
resultTitleAnimation();

const fullPageScroll = new FullPageScroll();
fullPageScroll.init();
