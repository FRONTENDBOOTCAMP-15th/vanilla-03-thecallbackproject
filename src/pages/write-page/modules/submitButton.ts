export function initSubmitButton() {
  const titleInput = document.querySelector('.input-title') as HTMLInputElement;
  const subtitleInput = document.querySelector(
    '.input-subtitle',
  ) as HTMLInputElement;
  const contentInput = document.querySelector(
    '.input-content',
  ) as HTMLTextAreaElement;

  titleInput.addEventListener('input', updateSubmitBtn);
  subtitleInput.addEventListener('input', updateSubmitBtn);
  contentInput.addEventListener('input', updateSubmitBtn);

  function updateSubmitBtn() {
    const btn = document.querySelector('.write-btn') as HTMLButtonElement;

    const isValid =
      titleInput.value.trim() &&
      subtitleInput.value.trim() &&
      contentInput.value.trim();

    if (isValid) {
      btn.classList.remove('undone');
      btn.classList.add('done');
    } else {
      btn.classList.remove('done');
      btn.classList.add('undone');
    }
  }
}
