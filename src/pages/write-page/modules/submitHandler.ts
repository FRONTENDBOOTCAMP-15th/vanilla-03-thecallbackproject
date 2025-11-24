import { addPost } from '../../../apis/postAPIs';
import { createPostRequest } from './createPostRequest';
import {
  validateForm,
  createToastMessage,
  showToastMessage,
} from './validation';

export function initSubmitHandler(getAlign: () => string) {
  const writeForm = document.querySelector('#writeForm') as HTMLFormElement;
  const fileInput = document.querySelector('#add-image') as HTMLInputElement;
  const contentTextarea = document.querySelector(
    '.input-content',
  ) as HTMLTextAreaElement;
  const previewImage = document.querySelector(
    '.preview-image',
  ) as HTMLImageElement;
  const previewFigure = document.querySelector('.image-preview') as HTMLElement;
  const fileInfo = document.querySelector('.file-info') as HTMLElement;

  writeForm?.addEventListener('submit', submitHandler);

  async function submitHandler(e: Event) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const title = form.elements.namedItem('title') as HTMLInputElement;
    const subtitle = form.elements.namedItem('subtitle') as HTMLInputElement;
    const content = form.elements.namedItem('content') as HTMLTextAreaElement;
    const tagsEl = form.elements.namedItem('tags') as HTMLInputElement;

    const missingFields = validateForm(title, subtitle, content);

    if (missingFields.length !== 0) {
      const msg = createToastMessage(missingFields);
      showToastMessage(msg);
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
      console.log('fetchPostDetail post.user = ', postData.user);
      const result = await addPost(postData);
      const newPostId = result.item._id;

      alert('글이 등록되었습니다.');
      window.location.href = `/src/pages/detail-page/detail.html?id=${newPostId}`;
    } catch (err) {
      alert('글쓰기에 실패했습니다. 다시 시도해주세요.');
      return;
    }

    // 글 입력 UI 초기화
    title.value = '';
    subtitle.value = '';
    content.value = '';
    tagsEl.value = '';
    contentTextarea.classList.remove('left', 'center', 'right');
    contentTextarea.classList.add('left');
    previewImage.src = '';
    previewFigure.classList.remove('on');
    fileInfo.textContent = '';
    fileInfo.classList.remove('error');
  }
}
