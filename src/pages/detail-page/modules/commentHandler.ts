import { createReply, deleteReplyAPI } from '../../../apis/commentAPIs';
import { formatDate } from './dateFormatter';
import { getProfileImage } from './profile';

let postCreatedAt = '';

export function setPostCreatedAt(value: string) {
  postCreatedAt = value;
}

export function renderCommentWriterInfo() {
  const item = localStorage.getItem('item');
  if (!item) return;

  try {
    const parsed = JSON.parse(item);

    const writerImg = document.querySelector(
      '.now-comment-author img',
    ) as HTMLImageElement;
    const writerName = document.querySelector(
      '.now-comment-author-name',
    ) as HTMLElement;

    if (writerImg) writerImg.src = getProfileImage(parsed.image);
    if (writerName) writerName.textContent = parsed.name;
  } catch {}
}

export function renderComments(replies: any[], loginUserId: number | null) {
  const commentList = document.querySelector('.comment-list') as HTMLElement;
  commentList.innerHTML = '';

  const countEl = document.querySelector('.comment-title span')!;

  if (!Array.isArray(replies) || replies.length === 0) {
    countEl.textContent = '0';
    return;
  }

  replies.forEach(reply => {
    const li = document.createElement('li');
    li.className = 'comment';

    const formatted = formatDate(reply.createdAt || postCreatedAt);
    const isMyComment = loginUserId === Number(reply.user._id);

    li.innerHTML = `
      <header>
        <img src="${getProfileImage(reply.user.image)}" alt="" />
        <strong class="comment-author">${reply.user.name}</strong>
        <time>${formatted}</time>
        ${
          isMyComment
            ? `<button class="comment-delete-btn" data-id="${reply._id}" type="button">삭제</button>`
            : ''
        }
      </header>
      <p class="comment-content">${reply.content}</p>
    `;

    commentList.appendChild(li);
  });

  countEl.textContent = String(replies.length);
}

function appendCommentToDOM(reply: any, loginUserId: number | null) {
  const commentList = document.querySelector('.comment-list') as HTMLElement;

  const li = document.createElement('li');
  li.className = 'comment';

  const formatted = formatDate(reply.createdAt || postCreatedAt);
  const isMyComment = loginUserId === Number(reply.user._id);

  li.innerHTML = `
    <header>
      <img src="${getProfileImage(reply.user.image)}" alt="" />
      <strong class="comment-author">${reply.user.name}</strong>
      <time>${formatted}</time>
      ${
        isMyComment
          ? `<button class="comment-delete-btn" data-id="${reply._id}" type="button">삭제</button>`
          : ''
      }
    </header>
    <p class="comment-content">${reply.content}</p>
  `;

  commentList.appendChild(li);

  const countEl = document.querySelector('.comment-title span')!;
  countEl.textContent = String(Number(countEl.textContent) + 1);
}

export function setupCommentForm(postId: number, loginUserId: number | null) {
  let isSubmitting = false;

  const form = document.querySelector('.comment-form') as HTMLFormElement;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    const textarea = form.querySelector('#commentInput') as HTMLTextAreaElement;
    const submitBtn = form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    const content = textarea.value.trim();
    if (!content) {
      isSubmitting = false;
      return;
    }

    submitBtn.style.opacity = '0.5';
    submitBtn.style.pointerEvents = 'none';

    try {
      const newReply = await createReply(postId, content);
      appendCommentToDOM(newReply, loginUserId);
      textarea.value = '';
    } catch (err) {
      alert('댓글 작성 실패');
    } finally {
      isSubmitting = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'auto';
    }
  });
}

export function setupCommentDelete(postId: number) {
  document.addEventListener('click', async e => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('comment-delete-btn')) return;

    const replyId = Number(target.getAttribute('data-id'));
    if (!replyId || !postId) return;

    const ok = confirm('댓글을 삭제하시겠습니까');
    if (!ok) return;

    try {
      await deleteReplyAPI(postId, replyId);

      const commentItem = target.closest('li.comment');
      commentItem?.remove();

      const countEl = document.querySelector('.comment-title span')!;
      countEl.textContent = String(
        Math.max(0, Number(countEl.textContent) - 1),
      );
    } catch (err) {
      alert('댓글 삭제 실패');
    }
  });
}
