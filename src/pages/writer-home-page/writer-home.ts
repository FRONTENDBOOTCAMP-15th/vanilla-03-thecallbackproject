import { getAxios } from '../../utils/axios';

document.addEventListener('DOMContentLoaded', async () => {
  const api = getAxios();

  const FIXED_AUTHOR_ID = 4; // 프롬프트 마스터 고정

  /* DOM 요소 */
  const nameEl = document.querySelector<HTMLElement>('.name')!;
  const roleEl = document.querySelector<HTMLElement>('.role')!;
  const profileImg = document.querySelector<HTMLImageElement>('.profile-img')!;
  const countsEl = document.querySelector<HTMLElement>('.counts')!;
  const postList = document.querySelector<HTMLUListElement>('.post-list')!;
  const subscribeBtn =
    document.querySelector<HTMLButtonElement>('.subscribe-btn')!;

  let subscriberCount = 0; // 구독자 수 저장

  // 작가 정보 불러오기

  async function loadAuthor() {
    try {
      const res = await api.get('/users');
      const users = res.data?.item || [];

      const author = users.find((u: any) => u._id === FIXED_AUTHOR_ID);

      if (!author) {
        alert('작가 정보를 찾을 수 없습니다.');
        return null;
      }

      // 프로필 렌더링
      nameEl.textContent = author.name;
      roleEl.textContent = author.extra?.job ?? '작가';
      profileImg.src = author.image;

      // 구독자 수 저장
      subscriberCount = author.bookmarkedBy?.users ?? 0;

      // 구독자 수 / 관심작가 수 동적
      countsEl.innerHTML = `
        <span>구독자 <b class="sub-count">${subscriberCount}</b></span>
        <span>관심작가 <b>${author.likedBy?.users ?? 0}</b></span>
      `;

      return author;
    } catch (error) {
      console.error('작가 로드 실패', error);
      return null;
    }
  }

  // 작가의 게시글 목록 불러오기

  async function loadAuthorPosts() {
    try {
      const res = await api.get('/posts');
      const posts = res.data?.item || [];

      // user._id 가 4인 글만 표시
      const authorPosts = posts.filter(
        (p: any) => p.user?._id === FIXED_AUTHOR_ID,
      );

      renderPosts(authorPosts);
    } catch (error) {
      console.error('게시글 로드 실패', error);
    }
  }

  // 게시글 렌더링

  function renderPosts(posts: any[]) {
    postList.innerHTML = posts
      .map(
        post => `
      <li class="post">
        <p class="tag">${post.extra?.subTitle ?? '글'}</p>

        <h3>
          <a href="../detail-page/detail.html?id=${post._id}">
            ${post.title}
          </a>
        </h3>

        <p class="desc">${(post.content ?? '').slice(0, 80)}...</p>

        <p class="date">댓글 ${post.repliesCount ?? 0} · ${post.createdAt}</p>
      </li>
    `,
      )
      .join('');
  }

  // 구독 버튼 토글 + 구독자 수 변경

  function setupSubscribeButton() {
    let subscribed = true; // 기본값

    const subCountEl = document.querySelector<HTMLElement>('.sub-count')!;

    const updateButton = () => {
      if (subscribed) {
        subscribeBtn.textContent = '✔ 구독중';
        subscribeBtn.style.background = '#00c6be';
        subscribeBtn.style.color = '#fff';
      } else {
        subscribeBtn.textContent = '+ 구독';
        subscribeBtn.style.background = '#ddd';
        subscribeBtn.style.color = '#222';
      }
    };

    updateButton();

    subscribeBtn.addEventListener('click', () => {
      // 상태 토글
      subscribed = !subscribed;

      // 구독자 수 변경
      if (subscribed) subscriberCount++;
      else subscriberCount--;

      if (subscriberCount < 0) subscriberCount = 0;

      // 구독자 수 화면 반영
      subCountEl.textContent = String(subscriberCount);

      updateButton();
    });
  }

  await loadAuthor();
  await loadAuthorPosts();
  setupSubscribeButton();
});
