import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import { createReply, deleteReplyAPI } from '../../apis/commentAPIs';
import { getAuthorizationHeader } from '../../utils/axios';
import type { PostDetail } from '../../types/post-detail';
import type { AuthorDetail } from '../../types/detail-author';
import defaultHeaderImage from '/images/thumnail-image.jpg';

window.addEventListener('DOMContentLoaded', () => {
  // 전역 게시물 createdAt 저장용
  let postCreatedAt = '';

  // 로그인 사용자 id 가져오기
  function getLoginUserId() {
    const item = localStorage.getItem('item');
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      return parsed._id ?? null;
    } catch {
      return null;
    }
  }

  // 로그인한 사용자의 프로필·이름을 댓글 입력창에 표시하기
  function renderCommentWriterInfo() {
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

  // 로그인 안 되어 있을 때 댓글 UI 비활성화
  function disableCommentUI() {
    const textarea = document.querySelector(
      '#commentInput',
    ) as HTMLTextAreaElement;
    const submitBtn = document.querySelector(
      '.comment-form button[type="submit"]',
    ) as HTMLButtonElement;

    if (textarea) {
      textarea.disabled = true;
      textarea.placeholder = '로그인 후 작성 가능합니다';
      textarea.style.background = '#f2f2f2';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.pointerEvents = 'none';
    }
  }

  // 로그인 검증 후 댓글 입력 막기
  const auth = getAuthorizationHeader();
  if (!auth || !auth.startsWith('Bearer ')) {
    disableCommentUI();
  }

  // 날짜 포맷 함수
  function formatDate(dateStr: string) {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}. ${year}`;
  }

  // 프로필 기본 이미지 처리
  function getProfileImage(src?: string) {
    if (!src || src.trim() === '') {
      return './../../../icons/logo.svg';
    }
    return src;
  }

  // 초기 실행
  async function initDetailPage() {
    const params = new URLSearchParams(location.search);
    const postId = params.get('id');

    if (!postId) {
      alert('잘못된 접근입니다');
      history.back();
      return;
    }

    try {
      const post = await fetchPostDetail(postId);
      const author = await fetchAuthorDetail(String(post.user._id));

      postCreatedAt = post.createdAt;

      renderPostDetail(post);
      renderAuthorDetail(author);
      renderCommentWriterInfo(); // 로그인 유저 정보 반영
      setupCommentForm();
    } catch (err) {
      console.error(err);
      alert('게시물을 불러오지 못했습니다');
      history.back();
    }
  }

  // 게시물 렌더링
  function renderPostDetail(post: PostDetail) {
    document.querySelector('.post-title')!.textContent = post.title;
    document.querySelector('.post-author .author-name')!.textContent =
      post.user.name;

    const authorImg = document.querySelector(
      '.post-author img',
    ) as HTMLImageElement;
    authorImg.src = getProfileImage(post.user.image);

    document.querySelector('.post-author time')!.textContent = formatDate(
      post.createdAt,
    );
    document.querySelector('.post-subtitle')!.textContent =
      post.extra.subTitle || '';

    const postImage = document.querySelector('.post-image') as HTMLImageElement;
    if (post.image && post.image.trim() !== '') {
      postImage.src = post.image;
      postImage.style.display = '';
    } else {
      postImage.style.display = 'none';
    }

    const postHeader = document.querySelector('.post-header') as HTMLElement;

    if (post.image && post.image.trim() !== '') {
      postHeader.style.setProperty('--header-image', `url(${post.image})`);
    } else {
      postHeader.style.setProperty(
        '--header-image',
        `url(${defaultHeaderImage})`,
      );
    }

    const contentEl = document.querySelector('.post-content p')!;
    contentEl.innerHTML = post.content.replace(/\n/g, '<br/>');

    const wrapper = document.querySelector('.post-content') as HTMLElement;
    wrapper.classList.remove('left', 'center', 'right');
    wrapper.classList.add(post.extra.align || 'left');

    const tagsUl = document.querySelector('.post-tags') as HTMLUListElement;
    tagsUl.innerHTML = '';

    if (post.tag && typeof post.tag === 'string') {
      post.tag
        .split(',')
        .map(t => t.trim())
        .forEach(tag => {
          const li = document.createElement('li');
          li.textContent = tag;
          tagsUl.appendChild(li);
        });
    }

    document.querySelector('.like-btn span')!.textContent = String(post.likes);

    renderComments(post.replies ?? []);
    document.querySelector('.comment-btn span')!.textContent = String(
      post.replies?.length ?? 0,
    );
  }

  // 댓글 목록 렌더링
  function renderComments(replies: PostDetail['replies']) {
    const commentList = document.querySelector('.comment-list') as HTMLElement;
    commentList.innerHTML = '';

    const countEl = document.querySelector('.comment-title span')!;

    if (!Array.isArray(replies) || replies.length === 0) {
      countEl.textContent = '0';
      countEl.setAttribute('aria-label', '댓글 0개');
      return;
    }

    const loginUserId = getLoginUserId();

    replies.forEach(reply => {
      const li = document.createElement('li');
      li.className = 'comment';

      const formatted = formatDate(reply.createdAt || postCreatedAt);
      const isMyComment = loginUserId === reply.user._id;

      li.innerHTML = `
        <header>
          <img src="${getProfileImage(reply.user.image)}" alt="" />
          <strong class="comment-author">${reply.user.name}</strong>
          <time>${formatted}</time>
          ${isMyComment ? `<button class="comment-delete-btn" data-id="${reply._id}" type="button">삭제</button>` : ''}
        </header>
        <p class="comment-content">${reply.content}</p>
      `;

      commentList.appendChild(li);
    });

    countEl.textContent = String(replies.length);
    countEl.setAttribute('aria-label', `댓글 ${replies.length}개`);
  }

  // 새 댓글 DOM 추가
  function appendCommentToDOM(reply: {
    _id: string;
    content: string;
    createdAt?: string;
    user: { _id: string; name: string; image?: string };
  }) {
    const commentList = document.querySelector('.comment-list') as HTMLElement;

    const li = document.createElement('li');
    li.className = 'comment';

    const formatted = formatDate(reply.createdAt || postCreatedAt);
    const loginUserId = getLoginUserId();
    const isMyComment = loginUserId === reply.user._id;

    li.innerHTML = `
      <header>
        <img src="${getProfileImage(reply.user.image)}" alt="" />
        <strong class="comment-author">${reply.user.name}</strong>
        <time>${formatted}</time>
        ${isMyComment ? `<button class="comment-delete-btn" data-id="${reply._id}" type="button">삭제</button>` : ''}
      </header>
      <p class="comment-content">${reply.content}</p>
    `;

    commentList.prepend(li);

    const countEl = document.querySelector('.comment-title span')!;
    countEl.textContent = String(Number(countEl.textContent) + 1);
  }

  // 댓글 등록 핸들러
  let isSubmitting = false;

  async function handleCommentSubmit(e: Event) {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    const textarea = (e.currentTarget as HTMLFormElement).querySelector(
      '#commentInput',
    ) as HTMLTextAreaElement;
    const submitBtn = document.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    const content = textarea.value.trim();
    if (!content) {
      isSubmitting = false;
      return;
    }

    submitBtn.style.opacity = '0.5';
    submitBtn.style.pointerEvents = 'none';

    const postId = new URLSearchParams(location.search).get('id')!;

    try {
      const newReply = await createReply(postId, content);
      appendCommentToDOM(newReply);
      textarea.value = '';
    } catch (err) {
      console.error(err);
      alert('댓글 작성 실패');
    } finally {
      isSubmitting = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.pointerEvents = 'auto';
    }
  }

  // 댓글 폼 이벤트 연결
  function setupCommentForm() {
    const form = document.querySelector('.comment-form') as HTMLFormElement;
    form.addEventListener('submit', handleCommentSubmit);
  }

  // 댓글 삭제
  document.addEventListener('click', async e => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('comment-delete-btn')) return;

    const replyId = target.getAttribute('data-id');
    const postId = new URLSearchParams(location.search).get('id');

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
      console.error(err);
      alert('댓글 삭제 실패');
    }
  });

  // 작성자 정보 렌더링
  function renderAuthorDetail(author: AuthorDetail) {
    document.querySelector('.author-info-box .author-name')!.textContent =
      author.name;
    document.querySelector('.author-info-box .author-job')!.textContent =
      author.extra?.job || '';

    const profileImg = document.querySelector(
      '.author-info-box img',
    ) as HTMLImageElement;
    profileImg.src = getProfileImage(author.image);

    document.querySelector('.author-desc')!.textContent =
      author.extra?.biography || '';

    document.querySelector('.subscriber-count')!.textContent = String(
      author.bookmarkedBy?.users ?? 0,
    );
  }

  initDetailPage();
});
