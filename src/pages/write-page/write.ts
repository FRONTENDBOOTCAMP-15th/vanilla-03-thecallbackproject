import { addPost } from '../../apis/postAPIs';
import { createPostRequest } from './createPostRequest';
// import type { PostContent } from '../../types/post';

window.addEventListener('DOMContentLoaded', function () {
  //닫기(뒤로 가기) 버튼 함수 및 이벤트 추가
  const backBtn = document.querySelector('.back-btn') as HTMLAnchorElement;
  function closeWritePage() {
    history.back();
  }
  backBtn?.addEventListener('click', closeWritePage);
  // 폼 요소
  const writeForm = document.querySelector('#writeForm');
  const toast = document.querySelector('.toast-message');

  // 폼의 유효성 검사해서 빈 필드 배열 만들어 반환
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

  // 빈 필드가 있다면 토스트 메시지를 만든다.
  function createToastMessage(missingFields: string[]) {
    if (missingFields.length === 0) {
      return '';
    } else {
      return (
        missingFields.map(f => `<u>${f}</u>`).join('과 ') + '을 입력해주세요.'
      );
    }
  }

  // 만들어진 토스트 메시지를 토스트 메시지 창을 띄워 보여준다.
  function showToastMessage(toastMessage: string) {
    const toastText = document.querySelector('.message-text');
    toast!.classList.add('on');
    toastText!.innerHTML = toastMessage;
  }

  // 텍스트 정렬 관련 요소
  const alignBtn = document.querySelector('.text-align-btn');
  const contentTextarea = document.querySelector('.input-content');
  const aligns = ['left', 'center', 'right'];
  let index = 0;

  // 텍스트 정렬 토글 업데이트
  function updateTextAlign() {
    index = (index + 1) % aligns.length;
    const currentAlign = aligns[index];

    contentTextarea?.classList.remove('left', 'center', 'right');
    contentTextarea?.classList.add(currentAlign);
  }

  // 텍스트 정렬 버튼 누르면 함수 실행
  alignBtn?.addEventListener('click', updateTextAlign);

  // 현재 textarea가 가진 정렬 클래스를 반환
  function getAlign() {
    if (contentTextarea?.classList.contains('left')) return 'left';
    if (contentTextarea?.classList.contains('center')) return 'center';
    if (contentTextarea?.classList.contains('right')) return 'right';

    return 'left'; // 기본값
  }

  // 제목, 소제목, 내용 입력 요소
  const titleInput = document.querySelector('.input-title') as HTMLInputElement;
  const subtitleInput = document.querySelector(
    '.input-subtitle',
  ) as HTMLInputElement;
  const contentInput = document.querySelector(
    '.input-content',
  ) as HTMLTextAreaElement;

  // 전송 버튼 활성화
  titleInput.addEventListener('input', updateSubmitBtn);
  subtitleInput.addEventListener('input', updateSubmitBtn);
  contentInput.addEventListener('input', updateSubmitBtn);

  // 전송 버튼 상태 업데이트
  function updateSubmitBtn() {
    const submitBtn = document.querySelector('.write-btn');
    const title = titleInput.value.trim();
    const subtitle = subtitleInput.value.trim();
    const content = contentInput.value.trim();

    const isValid = title && subtitle && content;

    if (isValid) {
      submitBtn?.classList.remove('undone');
      submitBtn?.classList.add('done');
    } else {
      submitBtn?.classList.remove('done');
      submitBtn?.classList.add('undone');
    }
  }

  // 파일 첨부 관련 요소
  const fileInput = document.querySelector('#add-image') as HTMLInputElement;
  const previewFigure = document.querySelector('.image-preview') as HTMLElement;
  const previewImage = document.querySelector(
    '.preview-image',
  ) as HTMLImageElement;

  // 미리보기 처리 함수
  function handleImagePreview() {
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      previewImage.src = reader.result as string;
      previewFigure.classList.add('on');
    };

    reader.readAsDataURL(file);
  }

  // 파일 선택 이벤트
  fileInput.addEventListener('change', handleImagePreview);

  // 전송 이벤트 핸들러
  async function submitHandler(e: Event) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const title = form.elements.namedItem('title') as HTMLInputElement;
    const subtitle = form.elements.namedItem('subtitle') as HTMLInputElement;
    const content = form.elements.namedItem('content') as HTMLTextAreaElement;
    const tagsEl = form.elements.namedItem('tags') as HTMLInputElement;
    // 1) 빈 필드 확인
    const missingFields = validateForm(title, subtitle, content);

    if (missingFields.length !== 0) {
      const toastMessage = createToastMessage(missingFields);
      showToastMessage(toastMessage);
      return;
    }
    // 2) 파일 가져오기
    const file = fileInput.files?.[0];

    // 3) postData 생성 (이미지 업로드 포함)
    const postData = await createPostRequest(
      title.value,
      subtitle.value,
      content.value,
      tagsEl.value,
      getAlign, // 정렬 함수
      file, // 파일
    );

    console.log('최종 전송 데이터:', postData);

    // 4) 서버에 게시물 저장(JSON 전송)

    try {
      await addPost(postData);
      alert('글이 등록되었습니다.');
    } catch (error) {
      alert('글쓰기에 실패했습니다. 다시 시도해주세요.');
      return; // ★ 실패면 아래 코드 실행하지 않음
    }

    // 5) 입력값 초기화
    title.value = '';
    subtitle.value = '';
    content.value = '';
    tagsEl.value = '';
    contentTextarea?.classList.remove('left', 'center', 'right');
    contentTextarea?.classList.add('left');

    previewImage.src = '';
    previewFigure.classList.remove('on');
  }

  // write 폼 요소에 전송 이벤트 등록
  writeForm?.addEventListener('submit', submitHandler);

  // 토스트 메시지 확인 버튼
  const closeBtn = document.querySelector('.close-btn');

  closeBtn?.addEventListener('click', function () {
    toast!.classList.remove('on');
  });

  // 툴바 위치 제어 (모바일에서 키보드가 나올 때)
  const toolbar = document.querySelector('.write-tools') as HTMLElement;

  function updateToolbarPosition() {
    const mobileVisualViewport = window.visualViewport;
    if (!mobileVisualViewport) return;

    const keyboardHeight =
      window.innerHeight -
      mobileVisualViewport.height -
      mobileVisualViewport.offsetTop;

    if (keyboardHeight > 0) {
      toolbar.style.bottom = `${keyboardHeight}px`;
    } else {
      toolbar.style.bottom = `0px`;
    }
  }

  window.visualViewport?.addEventListener('resize', updateToolbarPosition);
  window.visualViewport?.addEventListener('scroll', updateToolbarPosition);

  // 키보드 숨김 버튼
  function hideKeyboard() {
    const inputs = document.querySelectorAll<
      HTMLInputElement | HTMLTextAreaElement
    >('input, textarea');
    inputs.forEach(el => el.blur());
  }

  const hideKeyboardBtn = document.querySelector('.hide-keyboard-btn');
  hideKeyboardBtn?.addEventListener('click', hideKeyboard);
});
