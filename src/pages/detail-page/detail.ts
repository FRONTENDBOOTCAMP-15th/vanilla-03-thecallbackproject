import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import type { PostDetail } from '../../types/post-detail';

import { formatDate } from './modules/dateFormatter';
import { getProfileImage } from './modules/profile';

import {
  renderComments,
  setupCommentForm,
  setupCommentDelete,
  renderCommentWriterInfo,
  setPostCreatedAt,
} from './modules/commentHandler';

import { setupBookmarkButton } from './modules/bookmarkHandler';
import { setupSubscribeButton } from './modules/subscribeHandler';

import { renderAuthorDetail } from './modules/authorRenderer';
import { updateMetaTags } from './modules/metaUpdater';
import { setupPostDeleteButton } from './modules/postDeleteHandler';
import { saveRecentPost } from './modules/recentPosts';

import { getAuthorizationHeader } from '../../utils/axios';
import defaultHeaderImage from '/images/thumnail-image.jpg';

window.addEventListener('DOMContentLoaded', initDetailPage);

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

async function initDetailPage() {
  const params = new URLSearchParams(location.search);
  const postId = Number(params.get('id'));

  if (!postId || Number.isNaN(postId)) {
    alert('잘못된 접근입니다');
    history.back();
    return;
  }

  // 로그인 안 되어 있으면 댓글 UI 비활성화
  const auth = getAuthorizationHeader();
  if (!auth || !auth.startsWith('Bearer ')) {
    disableCommentUI();
  }

  try {
    const post = await fetchPostDetail(postId);
    const author = await fetchAuthorDetail(Number(post.user._id));

    setPostCreatedAt(post.createdAt);

    // 최근 본 글 저장
    saveRecentPost(Number(post._id));

    // 화면 렌더링
    renderPostDetail(post);
    setupPostDeleteButton(post);
    await setupBookmarkButton(post);
    await setupSubscribeButton(Number(author._id));
    renderAuthorDetail(author);
    renderCommentWriterInfo();

    const loginUserId = getLoginUserId();

    setupCommentForm(postId, loginUserId);
    setupCommentDelete(postId);
  } catch (err) {
    console.error(err);
    alert('게시물을 불러오지 못했습니다');
    history.back();
  }
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

function renderPostDetail(post: PostDetail) {
  const header = document.querySelector('.post-header') as HTMLElement;

  const imgUrl = post?.image?.trim?.();

  if (imgUrl) {
    header.style.setProperty('--header-image', `url(${imgUrl})`);
  } else {
    header.style.setProperty('--header-image', `url(${defaultHeaderImage})`);
  }

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

  // 댓글 렌더링
  const loginUserId = getLoginUserId();
  renderComments(post.replies ?? [], loginUserId);

  document.querySelector('.comment-btn span')!.textContent = String(
    post.replies?.length ?? 0,
  );

  // SEO
  updateMetaTags(post);
}
