// console.log('✅ header_footer.ts 연결 확인');
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getAxios } from '../../utils/axios';

const api = getAxios();

// 1. 스와이퍼용 랜덤 6개 데이터
async function fetchSwiperPosts() {
  const res = await api.get('/posts', {
    params: {
      type: 'brunch',
      limit: 6,
      sort: JSON.stringify({ random: 1 }),
    },
  });
  return res.data.item;
}

// 2. '요즘 뜨는 브런치' 영역 데이터
async function fetchBrunchPosts() {
  const res = await api.get('/posts', {
    params: {
      type: 'brunch',
      limit: 10,
      sort: JSON.stringify({ createdAt: -1 }),
    },
  });

  return res.data.item;
}

// 3. '오늘의 작가' 영역 데이터
async function fetchTodayAuthor() {
  // 전체 브런치 글 목록
  const posts = await fetchBrunchPosts();

  // 1) 랜덤 post 오늘의 작가 선정
  const randomPost = posts[Math.floor(Math.random() * posts.length)];
  const author = randomPost.user;

  // 2) 작가가 쓴 글 2개 고르기
  const authorPosts = posts
    .filter((p: any) => p.user?.email === author.email)
    .slice(0, 2);

  return { author, authorPosts };
}

// 4. '탑 구독 작가' 영역 데이터
async function fetchtopAuthorLists() {
  const res = await api.get('/posts', {
    params: {
      type: 'brunch',
      limit: 4,
      sort: JSON.stringify({ bookmarks: -1 }),
    },
  });
  return res.data.item;
}

//////////////////////////////// DOM에 데이터 뿌리기
window.addEventListener('DOMContentLoaded', async () => {
  // 1. 스와이퍼
  const swiperPosts = await fetchSwiperPosts();

  const swiperEl = document.querySelector('.swiper-wrapper');
  swiperEl!.innerHTML = swiperPosts
    .map(
      (post: any) => `
      <div class="swiper-slide">
        <div class="slide-text">
          <h3>${post.title}</h3>
          <h4><span class="by">by</span> ${post.user?.name || '익명'}</h4>
        </div>
        <img src="${post.image}" alt="${post.title}">
      </div>
    `,
    )
    .join('');

  // 2. 요즘 뜨는 브런치
  const posts = await fetchBrunchPosts();

  console.log(posts); // 🟧🟧 콘솔 확인

  const brunchLiEl = document.querySelector('.brunch-list ol');

  brunchLiEl!.innerHTML = posts
    .map(
      (post: any) =>
        `<li class="brunch-list-books" data-id="${post._id}">
      <div class="brunch-list-book">
<h3>${post.title}</h3>
<h4><span class="by-small">by</span> ${post.user?.name || '익명'}</h4>
<p>${post.content || ''}</p>
</div>
      <img src="${post.image}" alt="${post.title} 이미지" 
      // onerror="this.src='/src/assets/images/brunch-list-book.svg'"
      /> </li>`,
    )
    .join('');

  // ㄴ li 클릭 시 상세 페이지 이동 기능 추가
  document.querySelectorAll('.brunch-list-books').forEach(li => {
    li.addEventListener('click', () => {
      const id = li.getAttribute('data-id');
      if (!id) return;

      location.href = `/src/pages/detail-page/detail.html?id=${id}`;
    });
  });

  // 3. 오늘의 작가
  const todayAuthorData = await fetchTodayAuthor();
  const { author, authorPosts } = todayAuthorData;

  const todayAuthorRoot = document.querySelector('.today-author');
  const recentBooksRoot = document.querySelector('.recent-books');

  todayAuthorRoot!.innerHTML = `
  <div class="today-author-top">
  <div class="today-author-info">
  <h3>오늘의 작가</h3>
  <h4>${author.name}</h4>
  <p class="today-author-job">${author.extra?.job ?? '비공개'}</p>
  </div>

      <img 
      class="today-author-img"
      src="${author.image}"
      alt="${author.name} 사진"
      onerror="this.src='/src/assets/images/today-author-img.svg'"
    />
  </div>

  <p class="today-author-desc">
    ${author.extra?.biography ?? ''}
  </p>
  `;

  // 2) 아래 “최근 글 2개”
  recentBooksRoot!.innerHTML = authorPosts
    .map(
      (post: any) => `
      <li class="recent-book">
        <div class="recent-book-flex">
          <img 
            src="${post.image}" 
            alt="${post.title} 표지" 
            onerror="this.src='/src/assets/images/recent-book-cover-1.svg'"
          />
          <div class="recent-book-info">
            <h4>${post.title}</h4>
            <p>${post.content}</p>
          </div>
        </div>
      </li>
    `,
    )
    .join('');

  // 4. 탑 구독 작가
  const topAuthorLists = await fetchtopAuthorLists();
  const topAuthorEl = document.querySelector(
    '.top-author-list .top-author-grid ul',
  );

  topAuthorEl!.innerHTML = topAuthorLists
    .map(
      (post: any) =>
        `
<li data-id="${post.user?._id}">
<img src="${post.user?.image}" alt="${post.user?.name ?? '작가'} 이미지" 
      // onerror="this.src='/src/assets/images/top-author-grid-1.svg'"
      />
      <h3>${post.user?.name ?? '익명'}</h3>
      <p>${post.user?.extra?.job ?? '비공개'}</p>
      <p>${post.content ?? ''}</p>
</li>
`,
    )
    .join('');

  // ㄴ 탑 구독 작가 클릭 시 상세 페이지 이동 기능 추가
  document.querySelectorAll('.top-author-grid li').forEach(li => {
    li.addEventListener('click', () => {
      const userId = li.getAttribute('data-id');
      if (!userId) return;

      location.href = `/src/pages/writer-home-page/writer-home.html?id=${userId}`;
    });
  });
});

// swiper 영역
new Swiper('.swiper', {
  modules: [Pagination],

  // 페이지네이션 디폴트 모양 bullet 기호
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'bullets',
  },

  slidesPerView: 1, // 디폴트는 'auto'
  spaceBetween: 0, // 슬라이드 .swiper-slide 들 사이 가로 간격
});
