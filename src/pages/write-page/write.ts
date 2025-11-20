import { addPost } from '../../apis/postAPIs';
import { getAuthorizationHeader } from '../../utils/axios';
import { createPostRequest } from './createPostRequest';

window.addEventListener('DOMContentLoaded', function () {
  const auth = getAuthorizationHeader();

  if (!auth || !auth.startsWith('Bearer ')) {
    window.location.href = '/src/pages/login-page/login.html';
  }

  //닫기(뒤로 가기) 버튼
  const backBtn = document.querySelector('.back-btn') as HTMLAnchorElement;
  function closeWritePage() {
    history.back();
  }
  backBtn?.addEventListener('click', closeWritePage);

  // 폼
  const writeForm = document.querySelector('#writeForm');
  const toast = document.querySelector('.toast-message');

  // 유효성 검사
  function validateForm(
    title: HTMLInputElement,
    subtitle: HTMLInputElement,
    content: HTMLTextAreaElement,
  ) {
    const missingFields: string[] = [];

    if (!title.value.trim()) missingFields.push('제목');
    if (!subtitle.value.trim()) missingFields.push('소제목');
    if (!content.value.trim()) missingFields.push('내용');

    return missingFields;
  }

  // 토스트 메시지 생성
  function createToastMessage(missingFields: string[]) {
    if (missingFields.length === 0) return '';
    return (
      missingFields.map(f => `<u>${f}</u>`).join('과 ') + '을 입력해주세요.'
    );
  }

  // 토스트 표시
  function showToastMessage(toastMessage: string) {
    const toastText = document.querySelector('.message-text');
    toast!.classList.add('on');
    toastText!.innerHTML = toastMessage;
  }

  // 텍스트 정렬
  const alignBtn = document.querySelector('.text-align-btn');
  const contentTextarea = document.querySelector('.input-content');
  const aligns = ['left', 'center', 'right'];
  let index = 0;

  function updateTextAlign() {
    index = (index + 1) % aligns.length;
    const currentAlign = aligns[index];

    contentTextarea?.classList.remove('left', 'center', 'right');
    contentTextarea?.classList.add(currentAlign);
  }

  alignBtn?.addEventListener('click', updateTextAlign);

  function getAlign() {
    if (contentTextarea?.classList.contains('left')) return 'left';
    if (contentTextarea?.classList.contains('center')) return 'center';
    if (contentTextarea?.classList.contains('right')) return 'right';
    return 'left';
  }

  // 입력 요소
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
    const submitBtn = document.querySelector('.write-btn');
    const isValid =
      titleInput.value.trim() &&
      subtitleInput.value.trim() &&
      contentInput.value.trim();

    if (isValid) {
      submitBtn?.classList.remove('undone');
      submitBtn?.classList.add('done');
    } else {
      submitBtn?.classList.remove('done');
      submitBtn?.classList.add('undone');
    }
  }

  // 파일 첨부
  const fileInput = document.querySelector('#add-image') as HTMLInputElement;
  const previewFigure = document.querySelector('.image-preview') as HTMLElement;
  const previewImage = document.querySelector(
    '.preview-image',
  ) as HTMLImageElement;
  const fileInfo = document.querySelector('.file-info') as HTMLElement;

  // 삭제 버튼
  const removeImageBtn = document.querySelector(
    '.remove-image-btn',
  ) as HTMLButtonElement;

  // 미리보기 + 용량 검사
  function handleImagePreview() {
    const file = fileInput.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    // 용량 초과
    if (file.size > maxSize) {
      previewImage.src = '';
      previewFigure.classList.remove('on');
      fileInfo.textContent = `${fileSizeMB}MB (최대 2MB까지 업로드 가능합니다)`;
      fileInfo.classList.add('error');
      alert('파일 용량이 2MB를 초과했습니다.');
      fileInput.value = '';
      return;
    }

    // 정상 파일
    fileInfo.textContent = `${fileSizeMB}MB / 최대 2MB`;
    fileInfo.classList.remove('error');

    const reader = new FileReader();
    reader.onload = () => {
      previewImage.src = reader.result as string;
      previewFigure.classList.add('on');
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', handleImagePreview);

  // 이미지 삭제
  removeImageBtn?.addEventListener('click', () => {
    fileInput.value = ''; // 파일 제거
    previewImage.src = ''; // 미리보기 제거
    previewFigure.classList.remove('on');
    fileInfo.textContent = ''; // 파일 정보 제거
    fileInfo.classList.remove('error');
  });

  // 제출
  async function submitHandler(e: Event) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const title = form.elements.namedItem('title') as HTMLInputElement;
    const subtitle = form.elements.namedItem('subtitle') as HTMLInputElement;
    const content = form.elements.namedItem('content') as HTMLTextAreaElement;
    const tagsEl = form.elements.namedItem('tags') as HTMLInputElement;

    const missingFields = validateForm(title, subtitle, content);

    if (missingFields.length !== 0) {
      showToastMessage(createToastMessage(missingFields));
      return;
    }

    const file = fileInput.files?.[0];

    const postData = await createPostRequest(
      title.value,
      subtitle.value,
      content.value,
      tagsEl.value,
      getAlign,
      file,
    );

    try {
      const result = await addPost(postData);
      const newPostId = result.item._id;

      alert('글이 등록되었습니다.');
      window.location.href = `/src/pages/detail-page/detail.html?id=${newPostId}`;
    } catch (error) {
      alert('글쓰기에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // 초기화
    title.value = '';
    subtitle.value = '';
    content.value = '';
    tagsEl.value = '';
    contentTextarea?.classList.remove('left', 'center', 'right');
    contentTextarea?.classList.add('left');
    previewImage.src = '';
    previewFigure.classList.remove('on');
    fileInfo.textContent = '';
  }

  writeForm?.addEventListener('submit', submitHandler);

  const closeBtn = document.querySelector('.close-btn');
  closeBtn?.addEventListener('click', () => toast!.classList.remove('on'));

  // 툴바 위치 제어
  const toolbar = document.querySelector('.write-tools') as HTMLElement;

  function updateToolbarPosition() {
    const mobileVisualViewport = window.visualViewport;
    if (!mobileVisualViewport) return;

    const visualHeight = mobileVisualViewport.height;
    const fullHeight = window.innerHeight;

    const keyboardHeight = fullHeight - visualHeight;
    toolbar.style.bottom = `${keyboardHeight}px`;
  }

  window.visualViewport?.addEventListener('resize', updateToolbarPosition);
  window.visualViewport?.addEventListener('scroll', updateToolbarPosition);

  function hideKeyboard() {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input, textarea');
    inputs.forEach(el => el.blur());
  }

  const hideKeyboardBtn = document.querySelector('.hide-keyboard-btn');
  hideKeyboardBtn?.addEventListener('click', hideKeyboard);
});
