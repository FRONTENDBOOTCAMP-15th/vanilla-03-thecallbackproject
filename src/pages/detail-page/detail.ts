import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import type { PostDetail } from '../../types/post-detail';
// import type { PostDetail } from '../../types/post-detail';

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
    console.log('=== fetchPostDetail 전체 ===', post);
    console.log('post.user =', post.user);
    console.log('==== 상세페이지 post.user 확인 ====');
    console.log('post.user =', post.user);
    const author = await fetchAuthorDetail(Number(post.user._id));
    setPostCreatedAt(post.createdAt);

    // 화면 렌더링
    renderPostDetail(post);
    setupPostDeleteButton(post);
    await setupBookmarkButton(post);
    await setupSubscribeButton(Number(author._id));
    renderAuthorDetail(author);
    renderCommentWriterInfo();

    // 최근 본 글 저장
    saveRecentPost(post);
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

  // 제목 + aria-label
  const titleEl = document.querySelector('.post-title')!;
  titleEl.textContent = post.title;
  titleEl.setAttribute('aria-label', `글 제목 ${post.title}`);

  // 작성자명 + aria-label
  const authorNameEl = document.querySelector('.post-author .author-name')!;
  authorNameEl.textContent = post.user.name;
  authorNameEl.setAttribute('aria-label', `작성자 ${post.user.name}`);

  // 프로필 이미지 alt 설정
  const authorImg = document.querySelector(
    '.post-author img',
  ) as HTMLImageElement;
  authorImg.src = getProfileImage(post.user.image);
  authorImg.alt = `${post.user.name}의 프로필 이미지`;

  // 작성일 + aria-label
  const timeEl = document.querySelector('.post-author time')!;
  timeEl.textContent = formatDate(post.createdAt);
  timeEl.setAttribute('aria-label', `작성일 ${formatDate(post.createdAt)}`);

  // 소제목 + aria-label
  const subtitleEl = document.querySelector('.post-subtitle')!;
  subtitleEl.textContent = post.extra.subTitle || '';
  subtitleEl.setAttribute('aria-label', `소제목 ${post.extra.subTitle || ''}`);

  // 본문 이미지
  const postImage = document.querySelector('.post-image') as HTMLImageElement;
  if (post.image && post.image.trim() !== '') {
    postImage.src = post.image;
    postImage.style.display = '';
    postImage.alt = `${post.title} 관련 이미지`;
    postImage.setAttribute('aria-label', `${post.title} 관련 이미지`);
  } else {
    postImage.style.display = 'none';
  }

  // 본문 내용
  const contentEl = document.querySelector('.post-content p')!;
  contentEl.innerHTML = post.content.trimStart().replace(/\n/g, '<br/>');
  contentEl.setAttribute('aria-label', '본문 내용');

  // 정렬
  const wrapper = document.querySelector('.post-content') as HTMLElement;
  wrapper.classList.remove('left', 'center', 'right');
  wrapper.classList.add(post.extra.align || 'left');

  // 태그 + aria-label
  const tagsUl = document.querySelector('.post-tags') as HTMLUListElement;
  tagsUl.innerHTML = '';

  if (post.tag && typeof post.tag === 'string') {
    post.tag
      .split(',')
      .map(t => t.trim())
      .forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        li.setAttribute('aria-label', `태그 ${tag}`);
        tagsUl.appendChild(li);
      });
  }

  // 좋아요 수 + aria-label
  const likeSpan = document.querySelector('.like-btn span')!;
  const likeCount = post.bookmarks ?? 0;
  likeSpan.textContent = String(likeCount);
  likeSpan.setAttribute('aria-label', `좋아요 ${likeCount}개`);

  // 댓글 렌더링
  const loginUserId = getLoginUserId();
  renderComments(post.replies ?? [], loginUserId);

  // 댓글 개수 + aria-label
  const commentSpan = document.querySelector('.comment-btn span')!;
  const replyCount = post.replies?.length ?? 0;
  commentSpan.textContent = String(replyCount);
  commentSpan.setAttribute('aria-label', `댓글 ${replyCount}개`);

  // SEO
  updateMetaTags(post);
}
