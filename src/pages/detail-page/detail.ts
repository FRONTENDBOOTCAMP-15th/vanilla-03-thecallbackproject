import { fetchPostDetail, fetchAuthorDetail } from '../../apis/fetchAPIs';
import type { PostDetail } from '../../types/post-detail';
import type { AuthorDetail } from '../../types/detail-author';

window.addEventListener('DOMContentLoaded', () => {
  initDetailPage();
});

// 공통 프로필 이미지 대체 처리
function getProfileImage(src?: string): string {
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
    alert('잘못된 접근입니다.');
    history.back();
    return;
  }

  try {
    const post = await fetchPostDetail(postId);
    const author = await fetchAuthorDetail(String(post.user._id));

    renderPostDetail(post);
    renderAuthorDetail(author);
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

  document.querySelector('.post-author time')!.textContent = post.createdAt;

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

  const contentWrapper = document.querySelector('.post-content') as HTMLElement;
  contentWrapper.classList.remove('left', 'center', 'right');
  contentWrapper.classList.add(post.extra.align || 'left');

  const tagsUl = document.querySelector('.post-tags') as HTMLUListElement;
  tagsUl.innerHTML = '';

  if (post.tag && typeof post.tag === 'string') {
    const tagList = post.tag.split(',').map(t => t.trim());
    tagList.forEach(tag => {
      const li = document.createElement('li');
      li.textContent = tag;
      tagsUl.appendChild(li);
    });
  }

  document.querySelector('.like-btn span')!.textContent = String(post.likes);

  const replyCount = post.replies ? post.replies.length : 0;
  document.querySelector('.comment-btn span')!.textContent = String(replyCount);

  renderComments(post.replies ?? []);
}

// 댓글 렌더링
function renderComments(replies: PostDetail['replies']) {
  const commentList = document.querySelector(
    '.comment-list',
  ) as HTMLUListElement;
  commentList.innerHTML = '';

  if (!Array.isArray(replies) || replies.length === 0) {
    const countEl = document.querySelector('.comment-title span')!;
    countEl.textContent = '0';
    return;
  }

  replies.forEach(reply => {
    const li = document.createElement('li');
    li.className = 'comment';

    li.innerHTML = `
      <header>
        <img src="${getProfileImage(reply.user.image)}" alt="" />
        <strong class="comment-author">${reply.user.name}</strong>
      </header>
      <p class="comment-content">${reply.content}</p>
    `;

    commentList.appendChild(li);
  });

  const countEl = document.querySelector('.comment-title span')!;
  countEl.textContent = String(replies.length);
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
