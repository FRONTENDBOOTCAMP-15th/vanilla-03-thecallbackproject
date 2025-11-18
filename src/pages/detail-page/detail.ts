import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import { createReply } from '../../apis/commentAPIs';
import type { PostDetail } from '../../types/post-detail';
import type { AuthorDetail } from '../../types/detail-author';

window.addEventListener('DOMContentLoaded', () => {
  // 전역: 게시물 createdAt 저장용
  let postCreatedAt = '';

  // 날짜 포맷: "Jul 23. 2025"

  function formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';

    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}. ${year}`;
  }

  // 프로필 기본 이미지 처리
  function getProfileImage(src?: string): string {
    if (!src || src.trim() === '') {
      return './../../../icons/logo.svg';
    }
    return src;
  }

  // 페이지 초기 실행

  async function initDetailPage() {
    const params = new URLSearchParams(location.search);
    const postId = params.get('id');

    if (!postId) {
      alert('잘못된 접근입니다.');
      history.back();
      return;
    }

    try {
      const post = await fetchPostDetail(postId);
      const author = await fetchAuthorDetail(String(post.user._id));

      // 게시물 작성일 저장(댓글 fallback용)
      postCreatedAt = post.createdAt;

      renderPostDetail(post);
      renderAuthorDetail(author);
      setupCommentForm();
    } catch (err) {
      console.error(err);
      alert('게시물을 불러오지 못했습니다.');
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

    // 날짜 포맷 적용
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

    const contentEl = document.querySelector('.post-content p')!;
    contentEl.innerHTML = post.content.replace(/\n/g, '<br/>');

    const wrapper = document.querySelector('.post-content') as HTMLElement;
    wrapper.classList.remove('left', 'center', 'right');
    wrapper.classList.add(post.extra.align || 'left');

    // 태그
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

    // 댓글 수 표시
    const countEl = document.querySelector('.comment-title span')!;

    if (!Array.isArray(replies) || replies.length === 0) {
      countEl.textContent = '0';
      return;
    }

    replies.forEach(reply => {
      const li = document.createElement('li');
      li.className = 'comment';

      const dateToUse = reply.createdAt || postCreatedAt;
      const formatted = formatDate(dateToUse);

      li.innerHTML = `
        <header>
          <img src="${getProfileImage(reply.user.image)}" alt="" />
          <strong class="comment-author">${reply.user.name}</strong>
          <time>${formatted}</time>
        </header>
        <p class="comment-content">${reply.content}</p>
      `;

      commentList.appendChild(li);
    });

    countEl.textContent = String(replies.length);
  }

  // 새로운 댓글 DOM 추가

  function appendCommentToDOM(reply: {
    user: { name: string; image?: string };
    content: string;
    createdAt?: string;
  }) {
    const commentList = document.querySelector('.comment-list') as HTMLElement;

    const li = document.createElement('li');
    li.className = 'comment';

    const formatted = formatDate(reply.createdAt || postCreatedAt);

    li.innerHTML = `
      <header>
        <img src="${getProfileImage(reply.user.image)}" alt="" />
        <strong class="comment-author">${reply.user.name}</strong>
        <time>${formatted}</time>
      </header>
      <p class="comment-content">${reply.content}</p>
    `;

    commentList.prepend(li);

    // 댓글 수 증가
    const countEl = document.querySelector('.comment-title span')!;
    countEl.textContent = String(Number(countEl.textContent) + 1);
  }

  // 댓글 등록 핸들러

  let isSubmitting = false;

  async function handleCommentSubmit(e: Event) {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    const form = e.currentTarget as HTMLFormElement;
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

  // 실행
  initDetailPage();
});
