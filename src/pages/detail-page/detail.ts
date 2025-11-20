import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import { createReply, deleteReplyAPI } from '../../apis/commentAPIs';
import { getAuthorizationHeader } from '../../utils/axios';
import type { PostDetail } from '../../types/post-detail';
import type { AuthorDetail } from '../../types/detail-author';
import defaultHeaderImage from '/images/thumnail-image.jpg';
import { deletePostAPI } from '../../apis/deletePostAPIs';
import {
  addBookmark,
  getMyBookmarks,
  removeBookmark,
} from '../../apis/likePostAPIs';
import {
  addSubscribe,
  removeSubscribe,
  getMySubscriptions,
} from '../../apis/subscribeAPIs';

window.addEventListener('DOMContentLoaded', () => {
  let postCreatedAt = '';
  let isSubscribed = false;
  let currentSubscriptionId: number | null = null;

  function getLoginUserId(): number | null {
    const item = localStorage.getItem('item');
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      return Number(parsed._id) ?? null;
    } catch {
      return null;
    }
  }

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

  const auth = getAuthorizationHeader();
  if (!auth || !auth.startsWith('Bearer ')) {
    disableCommentUI();
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const normalized = dateStr.replace(/\./g, '-');
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return '';

    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}. ${year}`;
  }

  function getProfileImage(src?: string) {
    if (!src || src.trim() === '') {
      return './../../../icons/logo.svg';
    }
    return src;
  }

  async function initDetailPage() {
    const params = new URLSearchParams(location.search);
    const postId = Number(params.get('id'));

    if (!postId || Number.isNaN(postId)) {
      alert('잘못된 접근입니다');
      history.back();
      return;
    }

    try {
      const post = await fetchPostDetail(postId);
      const author = await fetchAuthorDetail(Number(post.user._id));

      postCreatedAt = post.createdAt;

      renderPostDetail(post);
      setupPostDeleteButton(post);
      await setupBookmarkButton(post);
      await setupSubscribeButton(Number(author._id));
      renderAuthorDetail(author);
      renderCommentWriterInfo();
      setupCommentForm();
    } catch (err) {
      console.error(err);
      alert('게시물을 불러오지 못했습니다');
      history.back();
    }
  }

  function setupPostDeleteButton(post: PostDetail) {
    const deleteBtn = document.querySelector(
      '.post-delete-btn',
    ) as HTMLButtonElement;
    if (!deleteBtn) return;

    const loginUserId = getLoginUserId();
    if (loginUserId === null) return;

    const isMyPost = loginUserId === Number(post.user._id);
    if (!isMyPost) return;

    deleteBtn.style.display = 'block';

    deleteBtn.addEventListener('click', async () => {
      const ok = confirm('이 게시글을 삭제하시겠습니까?');
      if (!ok) return;

      try {
        await deletePostAPI(Number(post._id));

        alert('게시글이 삭제되었습니다');
        location.href = '/index.html';
      } catch (err) {
        console.error(err);
        alert('게시글 삭제 실패');
      }
    });
  }

  async function setupBookmarkButton(post: PostDetail) {
    const likeBtn = document.querySelector('.like-btn') as HTMLButtonElement;
    if (!likeBtn) return;

    const countSpan = likeBtn.querySelector('span') as HTMLSpanElement;
    if (!countSpan) return;

    let isBookmarked = false;
    let isBookmarking = false;

    const myBookmarks = await getMyBookmarks();
    const found = myBookmarks.find(
      b => Number(b.post?._id) === Number(post._id),
    );

    if (found) {
      isBookmarked = true;
      likeBtn.classList.add('on');
    }

    likeBtn.addEventListener('click', async () => {
      const authHeader = getAuthorizationHeader();
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        alert('로그인 후 이용 가능합니다');
        return;
      }

      if (isBookmarking) return;
      isBookmarking = true;

      try {
        if (!isBookmarked) {
          await addBookmark(Number(post._id));

          countSpan.textContent = String(Number(countSpan.textContent) + 1);
          likeBtn.classList.add('on');
          isBookmarked = true;
        } else {
          const bookmarks = await getMyBookmarks();
          const target = bookmarks.find(
            b => Number(b.post?._id) === Number(post._id),
          );

          if (!target) {
            console.warn('북마크 ID를 찾을 수 없음');
          } else {
            await removeBookmark(Number(target._id));

            countSpan.textContent = String(
              Math.max(0, Number(countSpan.textContent) - 1),
            );
            likeBtn.classList.remove('on');
            isBookmarked = false;
          }
        }
      } catch (err) {
        console.error(err);
        alert('좋아요 처리 실패');
      } finally {
        isBookmarking = false;
      }
    });
  }

  async function setupSubscribeButton(authorId: number) {
    const btn = document.querySelector('.subscribe-btn') as HTMLButtonElement;
    if (!btn) return;

    const subscriberCountEl = document.querySelector(
      '.subscriber-count',
    ) as HTMLElement;

    const authHeader = getAuthorizationHeader();
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      btn.disabled = true;
      btn.textContent = '로그인 필요';
      return;
    }

    const subscriptions = await getMySubscriptions();
    const found = subscriptions.find(
      item => Number(item.user?._id) === authorId,
    );

    if (found) {
      isSubscribed = true;
      currentSubscriptionId = Number(found._id);
    } else {
      isSubscribed = false;
      currentSubscriptionId = null;
    }

    updateSubscribeButtonUI(btn);

    btn.addEventListener('click', async () => {
      try {
        if (isSubscribed) {
          // 구독 취소
          await removeSubscribe(currentSubscriptionId!);

          isSubscribed = false;
          currentSubscriptionId = null;

          // 구독자 숫자 감소
          subscriberCountEl.textContent = String(
            Math.max(0, Number(subscriberCountEl.textContent) - 1),
          );
        } else {
          // 구독 추가
          await addSubscribe(authorId);

          const refreshed = await getMySubscriptions();
          const newItem = refreshed.find(
            item => Number(item.user?._id) === authorId,
          );

          isSubscribed = true;
          currentSubscriptionId = newItem ? Number(newItem._id) : null;

          // 구독자 숫자 증가
          subscriberCountEl.textContent = String(
            Number(subscriberCountEl.textContent) + 1,
          );
        }

        updateSubscribeButtonUI(btn);
      } catch (err) {
        console.error(err);
        alert('구독 처리 중 오류 발생');
      }
    });
  }

  function updateSubscribeButtonUI(btn: HTMLButtonElement) {
    if (isSubscribed) {
      btn.classList.add('on');
      btn.textContent = '✔ 구독중';
    } else {
      btn.classList.remove('on');
      btn.textContent = '+ 구독';
    }
  }
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
    contentEl.innerHTML = post.content.trimStart().replace(/\n/g, '<br/>');

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

    document.querySelector('.like-btn span')!.textContent = String(
      post.bookmarks ?? 0,
    );

    renderComments(post.replies ?? []);
    document.querySelector('.comment-btn span')!.textContent = String(
      post.replies?.length ?? 0,
    );
  }

  function renderComments(replies: PostDetail['replies']) {
    const commentList = document.querySelector('.comment-list') as HTMLElement;
    commentList.innerHTML = '';

    const countEl = document.querySelector('.comment-title span')!;

    if (!Array.isArray(replies) || replies.length === 0) {
      countEl.textContent = '0';
      return;
    }

    const loginUserId = getLoginUserId();

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

  function appendCommentToDOM(reply: {
    _id: number;
    content: string;
    createdAt?: string;
    user: { _id: number; name: string; image?: string };
  }) {
    const commentList = document.querySelector('.comment-list') as HTMLElement;

    const li = document.createElement('li');
    li.className = 'comment';

    const formatted = formatDate(reply.createdAt || postCreatedAt);
    const loginUserId = getLoginUserId();
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

    const postId = Number(new URLSearchParams(location.search).get('id'));

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

  function setupCommentForm() {
    const form = document.querySelector('.comment-form') as HTMLFormElement;
    form.addEventListener('submit', handleCommentSubmit);
  }

  document.addEventListener('click', async e => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('comment-delete-btn')) return;

    const replyId = Number(target.getAttribute('data-id'));
    const postId = Number(new URLSearchParams(location.search).get('id'));

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

  function renderAuthorDetail(author: AuthorDetail) {
    const linkEl = document.querySelector(
      '.author-info-box a',
    ) as HTMLAnchorElement;
    linkEl.href = `/src/pages/writer-home-page/writer-home.html?id=${author._id}`;

    const nameEl = linkEl.querySelector('.author-name') as HTMLElement;
    const jobEl = linkEl.querySelector('.author-job') as HTMLElement;
    const profileImg = linkEl.querySelector('img') as HTMLImageElement;

    nameEl.textContent = author.name;
    jobEl.textContent = author.extra?.job || '';
    profileImg.src = getProfileImage(author.image);

    document.querySelector('.author-desc')!.textContent =
      author.extra?.biography || '';
    document.querySelector('.subscriber-count')!.textContent = String(
      author.bookmarkedBy?.users ?? 0,
    );
  }

  initDetailPage();
});
