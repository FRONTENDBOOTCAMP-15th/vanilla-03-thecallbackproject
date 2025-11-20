import { checkAuthAndBackButton } from './modules/authAndNavigation';
import { initToastCloseButton } from './modules/validation';
import { initTextAlign, getAlign } from './modules/textAlign';
import { initSubmitButton } from './modules/submitButton';
import { initImageHandler } from './modules/imageHandler';
import { initSubmitHandler } from './modules/submitHandler';
import { initKeyboardToolbar } from './modules/keyboardHandler';

window.addEventListener('DOMContentLoaded', () => {
  checkAuthAndBackButton();
  initToastCloseButton();
  initTextAlign();
  initSubmitButton();
  initImageHandler();
  initSubmitHandler(getAlign);
  initKeyboardToolbar();
});
