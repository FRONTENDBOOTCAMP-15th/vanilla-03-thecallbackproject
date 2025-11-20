import { getAxios } from '../../utils/axios';

document.addEventListener('DOMContentLoaded', () => {
  type SearchType = 'post' | 'author';

  const api = getAxios();

  // DOM 캐싱
  const screens = document.querySelectorAll<HTMLDivElement>('.screen');
  const searchInput =
    document.querySelector<HTMLInputElement>('.search-input')!;
  const postList = document.querySelector<HTMLUListElement>('.post-list')!;
  const authorList = document.querySelector<HTMLUListElement>('.author-list')!;
  const postCount = document.querySelector<HTMLDivElement>('.post-count')!;
  const recentList = document.querySelector<HTMLUListElement>(
    '.recent-keywords ul',
  )!;
  const closeButtons =
    document.querySelectorAll<HTMLButtonElement>('.close-btn');
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab');
  const sortButtons = document.querySelectorAll<HTMLButtonElement>('.sort');

  // 전역 상태
  let currentKeyword = '';
  let currentType: SearchType = 'post';
  let page = 1;
  let isLoading = false;
  let isEnd = false;

  // 공통: 화면 전환 & 헤더 변경

  function showScreen(index: number) {
    screens.forEach((s, i) => {
      s.style.display = i === index ? 'block' : 'none';
    });
  }

  function updateSearchTitle(keyword: string) {
    document.querySelectorAll('.search-keyword h1').forEach(el => {
      el.textContent = keyword;
    });
  }

  // 최근 검색어
  function saveRecentKeyword(keyword: string) {
    let list = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
    list = list.filter((v: string) => v !== keyword);
    list.unshift(keyword);
    list = list.slice(0, 5);
    localStorage.setItem('recentKeywords', JSON.stringify(list));
    renderRecentKeywords();
  }

  function renderRecentKeywords() {
    const list = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
    recentList.innerHTML = list
      .map(
        (k: string) => `
        <li>
          <span class="keyword-text">${k}</span>
          <button class="recent-remove" data-key="${k}">×</button>
        </li>`,
      )
      .join('');

    recentList.querySelectorAll('.keyword-text').forEach(el => {
      el.addEventListener('click', () => {
        searchInput.value = el.textContent!.trim();
        performSearch(searchInput.value.trim(), 'post', true);
      });
    });

    recentList.querySelectorAll('.recent-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key')!;
        let list = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
        list = list.filter((v: string) => v !== key);
        localStorage.setItem('recentKeywords', JSON.stringify(list));
        renderRecentKeywords();
      });
    });
  }

  // 하드코딩 렌더링: 글 목록
  function renderHardcodedPosts() {
    postList.innerHTML = `
      <li class="post-item">
        <a href="#">
          <div class="text-content">
            <h3 class="title">딸의 정부청사 출장에 부모님이 동행하는 이유</h3>
            <p class="desc">법이 명시로, 감사합니다! 직장인딸의 출장길이었으므로....</p>
            <p class="meta">Apr 19. 2024 · <span class="author">by 은선</span></p>
          </div>
          <div class="thumbnail"><img src="./../../assets/images/image1.png"></div>
        </a>
      </li>

      <li class="post-item">
        <a href="#">
          <div class="text-content">
            <h3 class="title">덴마크의 ‘꿀 하트’ 쿠키, Honninghjerter</h3>
            <p class="desc">안녕하세요 쿠키 좋아하는 윈즈버드입니다. 데니쉬 여왕의 마음쿠키...</p>
            <p class="meta">Nov 16. 2023 · <span class="author">by Windsbird</span></p>
          </div>
          <div class="thumbnail"><img src="./../../assets/images/image2.png"></div>
        </a>
      </li>

      <li class="post-item">
        <a href="#">
          <div class="text-content">
            <h3 class="title">꿀 빠는 풍경</h3>
            <p class="desc">책을 보다 기다리던 것도 잊다. 책을 끌어안는 그 순간의 행복...</p>
            <p class="meta">Jan 25. 2024 · <span class="author">by 북쪽루씨</span></p>
          </div>
          <div class="thumbnail"><img src="./../../assets/images/image3.png"></div>
        </a>
      </li>

      <li class="post-item">
        <a href="#">
          <div class="text-content">
            <h3 class="title">373) 사진만 봐도 꿀팁 윤기가 좌르르, 구움과자</h3>
            <p class="desc">홍대에서 여행지 시장, 크로플과 휘낭시에 향연...</p>
            <p class="meta">Mar 28. 2023 · <span class="author">by 빵덕 설리언케익</span></p>
          </div>
          <div class="thumbnail"><img src="./../../assets/images/image4.png"></div>
        </a>
      </li>
    `;
  }

  // 하드코딩 렌더링: 작가 목록
  function renderHardcodedAuthors() {
    authorList.innerHTML = `
      <li class="author-item">
        <a href="#"><div class="profile-thumb">
          <img src="./../../assets/images/Link1.png"></div>
          <div class="author-info">
            <h3 class="name">꿀아빠</h3>
            <p class="desc">두아들 아빠 기록남기기 좋아하는 아빠 고민하는 아빠입니다</p>
            <ul class="tags"><li><span class="tag">여행</span></li></ul>
          </div>
        </a>
      </li>

      <li class="author-item">
        <a href="#"><div class="profile-thumb">
          <img src="./../../assets/images/Link2.png"></div>
          <div class="author-info">
            <h3 class="name">꿀별</h3>
            <p class="desc">글 쓰고 디자인 하는 사람. 마음이 담긴 일을 해요.</p>
            <ul class="tags">
              <li><span class="tag">콘텐츠</span></li>
              <li><span class="tag">만화</span></li>
              <li><span class="tag">여행</span></li>
              <li><span class="tag">크리에이터</span></li>
            </ul>
          </div>
        </a>
      </li>

      <li class="author-item">
        <a href="#"><div class="profile-thumb">
          <img src="./../../assets/images/Link3.png"></div>
          <div class="author-info">
            <h3 class="name">개발자 꿀</h3>
            <p class="desc">느리게 흘러가는 스토플룸에서 사는 개발자입니다🧡</p>
            <ul class="tags">
              <li><span class="tag">해외생활</span></li>
              <li><span class="tag">IT</span></li>
              <li><span class="tag">개발자</span></li>
            </ul>
          </div>
        </a>
      </li>

      <li class="author-item">
        <a href="#"><div class="profile-thumb">
          <img src="./../../assets/images/Link4.png"></div>
          <div class="author-info">
            <h3 class="name">꿀갱</h3>
            <p class="desc">제 일상에 대한 글입니다.</p>
            <ul class="tags">
              <li><span class="tag">여행</span></li>
              <li><span class="tag">CEO</span></li>
            </ul>
          </div>
        </a>
      </li>
    `;
  }

  // 검색 수행 (API + 하드코딩 UI 조합)

  async function performSearch(
    keyword: string,
    type: SearchType,
    reset: boolean = true,
  ) {
    if (!keyword) return;

    currentKeyword = keyword;
    currentType = type;
    updateSearchTitle(keyword);
    saveRecentKeyword(keyword);

    if (reset) {
      page = 1;
      isEnd = false;
      postList.innerHTML = '';
      authorList.innerHTML = '';
    }

    // "꿀"만 정상 처리
    if (keyword !== '꿀') {
      showScreen(3);
      return;
    }

    try {
      const res = await api.get('/posts', {
        params: { keyword, page, limit: 10 },
      });

      const items = res.data?.item || [];

      if (!items.length && page === 1) {
        showScreen(3);
        return;
      }

      // 글 탭
      if (type === 'post') {
        renderHardcodedPosts();
        postCount.textContent = `글 검색 결과 ${items.length}건`;
        showScreen(1);
      }

      // 작가 탭
      if (type === 'author') {
        renderHardcodedAuthors();
        showScreen(2);
      }
    } catch (err) {
      showScreen(3);
    }
  }

  // 무한 스크롤

  window.addEventListener('scroll', () => {
    if (isLoading || isEnd) return;

    const nearBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom) {
      page++;
      performSearch(currentKeyword, currentType, false);
    }
  });

  // 이벤트
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value.trim(), 'post');
    }
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => showScreen(0));
  });

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      tabButtons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const keyword = searchInput.value.trim();
      const type: SearchType = tab.textContent === '글' ? 'post' : 'author';

      if (keyword) performSearch(keyword, type);
    });
  });

  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sortButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* 초기 */
  renderRecentKeywords();
  showScreen(0);
});
