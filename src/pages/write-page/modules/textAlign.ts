const aligns = ['left', 'center', 'right'];
let index = 0;

export function initTextAlign() {
  const alignBtn = document.querySelector('.text-align-btn') as HTMLElement;
  const contentTextarea = document.querySelector(
    '.input-content',
  ) as HTMLElement;

  alignBtn?.addEventListener('click', () => {
    index = (index + 1) % aligns.length;
    const current = aligns[index];

    contentTextarea.classList.remove('left', 'center', 'right');
    contentTextarea.classList.add(current);
  });
}

export function getAlign() {
  const contentTextarea = document.querySelector(
    '.input-content',
  ) as HTMLElement;

  if (contentTextarea.classList.contains('left')) return 'left';
  if (contentTextarea.classList.contains('center')) return 'center';
  if (contentTextarea.classList.contains('right')) return 'right';

  return 'left';
}
