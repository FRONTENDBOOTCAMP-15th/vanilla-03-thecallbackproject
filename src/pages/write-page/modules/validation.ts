export function validateForm(
  title: HTMLInputElement,
  subtitle: HTMLInputElement,
  content: HTMLTextAreaElement,
) {
  const missing: string[] = [];

  if (!title.value.trim()) missing.push('제목');
  if (!subtitle.value.trim()) missing.push('소제목');
  if (!content.value.trim()) missing.push('내용');

  return missing;
}

export function createToastMessage(missingFields: string[]) {
  if (missingFields.length === 0) return '';
  return missingFields.map(f => `<u>${f}</u>`).join('과 ') + '을 입력해주세요.';
}

export function showToastMessage(message: string) {
  const toast = document.querySelector('.toast-message');
  const text = document.querySelector('.message-text');

  if (!toast || !text) return;

  toast.classList.add('on');
  text.innerHTML = message;
}

export function initToastCloseButton() {
  const closeBtn = document.querySelector('.close-btn');
  const toast = document.querySelector('.toast-message');

  closeBtn?.addEventListener('click', () => {
    toast?.classList.remove('on');
  });
}
