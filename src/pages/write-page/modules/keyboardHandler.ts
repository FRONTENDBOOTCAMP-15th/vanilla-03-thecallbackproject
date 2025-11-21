export function initKeyboardToolbar() {
  const toolbar = document.querySelector('.write-tools') as HTMLElement;
  const hideKeyboardBtn = document.querySelector(
    '.hide-keyboard-btn',
  ) as HTMLElement;

  function updateToolbarPosition() {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const visualHeight = viewport.height;
    const fullHeight = window.innerHeight;
    const keyboardHeight = fullHeight - visualHeight;

    toolbar.style.bottom = `${keyboardHeight}px`;
  }

  window.visualViewport?.addEventListener('resize', updateToolbarPosition);
  window.visualViewport?.addEventListener('scroll', updateToolbarPosition);

  hideKeyboardBtn?.addEventListener('click', () => {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input, textarea');
    inputs.forEach(el => el.blur());
  });
}
