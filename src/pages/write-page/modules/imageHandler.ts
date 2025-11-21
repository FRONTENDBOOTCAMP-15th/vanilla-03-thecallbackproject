export function initImageHandler() {
  const fileInput = document.querySelector('#add-image') as HTMLInputElement;
  const previewFigure = document.querySelector('.image-preview') as HTMLElement;
  const previewImage = document.querySelector(
    '.preview-image',
  ) as HTMLImageElement;
  const fileInfo = document.querySelector('.file-info') as HTMLElement;
  const removeImageBtn = document.querySelector(
    '.remove-image-btn',
  ) as HTMLButtonElement;

  fileInput.addEventListener('change', handlePreview);
  removeImageBtn?.addEventListener('click', clearImage);

  function handlePreview() {
    const file = fileInput.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    if (file.size > maxSize) {
      previewImage.src = '';
      previewFigure.classList.remove('on');
      fileInfo.textContent = `${fileSizeMB}MB (최대 2MB까지 업로드 가능합니다)`;
      fileInfo.classList.add('error');
      alert('파일 용량이 2MB를 초과했습니다.');
      fileInput.value = '';
      return;
    }

    fileInfo.classList.remove('error');
    fileInfo.textContent = `${fileSizeMB}MB / 최대 2MB`;

    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result as string;
      previewFigure.classList.add('on');
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    fileInput.value = '';
    previewImage.src = '';
    previewFigure.classList.remove('on');
    fileInfo.textContent = '';
    fileInfo.classList.remove('error');
  }
}
