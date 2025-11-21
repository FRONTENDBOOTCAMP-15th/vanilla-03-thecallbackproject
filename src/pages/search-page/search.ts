import { getAxios } from '../../utils/axios';

document.addEventListener('DOMContentLoaded', () => {
  type SearchType = 'post' | 'author';

  const api = getAxios();

  // const POSTS = [
  //   {
  //     _id: 1001,
  //     id: 1,
  //     title: '딸의 정부청사 출장에 부모님이 동행하는 이유',
  //     content: '법이 명시로, 감사합니다! 직장인딸의 출장길이었으므로...',
  //     tags: ['출장', '가족'],
  //     author: '은선',
  //     thumbnail: './../../assets/images/image1.png',
  //   },
  //   {
  //     _id: 1002,
  //     id: 2,
  //     title: '덴마크의 꿀 하트 쿠키, Honninghjerter',
  //     content: '안녕하세요 쿠키 좋아하는 윈즈버드입니다...',
  //     tags: ['쿠키', '디저트', '꿀'],
  //     author: 'Windsbird',
  //     thumbnail: './../../assets/images/image2.png',
  //   },
  //   {
  //     _id: 1003,
  //     id: 3,
  //     title: '꿀 빠는 풍경',
  //     content: '책을 보다 기다리던 것도 잊다...',
  //     tags: ['꿀', '일상'],
  //     author: '북쪽루씨',
  //     thumbnail: './../../assets/images/image3.png',
  //   },
  //   {
  //     _id: 1004,
  //     id: 4,
  //     title: '373) 사진만 봐도 꿀팁 윤기가 좌르르, 구움과자',
  //     content: '홍대에서 여행지처럼 시장, 크로플과 휘낭시에...',
  //     tags: ['디저트', '꿀팁', '구움과자'],
  //     author: '빵덕 설리언케익',
  //     thumbnail: './../../assets/images/image4.png',
  //   },
  // ];

  // DOM

  const screens = document.querySelectorAll<HTMLDivElement>('.screen');
  const searchInput = document.querySelector<HTMLInputElement>('.search-input');

  const postList = document.querySelector<HTMLUListElement>('.post-list')!;
  const postCount =
    document.querySelector<HTMLParagraphElement>('.post-count')!;
  const authorList = document.querySelector<HTMLUListElement>('.author-list')!;
  const recentList = document.querySelector<HTMLUListElement>(
    '.recent-keywords ul',
  )!;

  const closeButtons =
    document.querySelectorAll<HTMLButtonElement>('.close-btn');
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.tab');
  const sortButtons = document.querySelectorAll<HTMLButtonElement>('.sort');

  // 화면 전환
  function showScreen(index: number) {
    screens.forEach((screen, i) => {
      screen.style.display = i === index ? 'block' : 'none';
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

    recentList.querySelectorAll('.keyword-text').forEach(item => {
      item.addEventListener('click', () => {
        const keyword = item.textContent!.trim();
        searchInput!.value = keyword;
        performSearch(keyword, 'post');
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

  // 렌더링
  function renderPosts(results: any[]) {
    postList.innerHTML = results
      .map(
        post => `
      <li class="post-item">
        <a href="../../pages/detail-page/detail.html?id=${post._id}">
          <div class="text-content">
            <h3 class="title">${post.title}</h3>
            <p class="desc">${(post.content ?? '').slice(0, 50)}...</p>
            <p class="meta">by ${post.user?.name ?? post.author}</p>
          </div>
          <div class="thumbnail">
            <img src="${post.image ?? post.thumbnail}">
          </div>
        </a>
      </li>`,
      )
      .join('');

    postCount.textContent = `글 검색 결과 ${results.length}건`;
  }

  function renderAuthors(results: any[]) {
    authorList.innerHTML = results
      .map(
        a => `
      <li class="author-item">
        <a href="../../pages/writer-home-page/writer-home.html?id=${a._id}">
          <div class="profile-thumb">
            <img src="${a.image ?? a.thumbnail}">
          </div>
          <div class="author-info">
            <h3 class="name">${a.name}</h3>
            <p class="desc">${a.desc ?? ''}</p>
          </div>
        </a>
      </li>`,
      )
      .join('');
  }

  // 검색 기능
  async function performSearch(keyword: string, type: SearchType) {
    if (!keyword) return;

    updateSearchTitle(keyword);
    saveRecentKeyword(keyword);

    /* -------- 글 검색 -------- */
    if (type === 'post') {
      let posts: any[] = [];

      try {
        const res = await api.get('/posts', { params: { keyword } });
        posts = Array.isArray(res.data?.item) ? res.data.item : [];
      } catch (_) {
        posts = [];
      }

      if (!posts.length) {
        showScreen(3);

        const tabs = screens[3].querySelectorAll<HTMLButtonElement>('.tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabs[0].classList.add('active');

        return;
      }

      renderPosts(posts);

      const tabs = screens[1].querySelectorAll<HTMLButtonElement>('.tab');
      tabs.forEach(t => t.classList.remove('active'));
      tabs[0].classList.add('active');

      showScreen(1);
      return;
    }

    /* -------- 작가 검색 -------- */
    if (type === 'author') {
      let authors: any[] = [];

      try {
        const res = await api.get('/users'); // 전체 작가 가져오기
        authors = Array.isArray(res.data?.item) ? res.data.item : [];
      } catch (_) {
        authors = [];
      }

      // 🔥 프론트에서 직접 필터링
      const filtered = authors.filter(a =>
        a.name.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (!filtered.length) {
        showScreen(3);

        const tabs = screens[3].querySelectorAll<HTMLButtonElement>('.tab');
        tabs.forEach(t => t.classList.remove('active'));
        tabs[1].classList.add('active');

        return;
      }

      renderAuthors(filtered);

      const tabs = screens[2].querySelectorAll<HTMLButtonElement>('.tab');
      tabs.forEach(t => t.classList.remove('active'));
      tabs[1].classList.add('active');

      showScreen(2);
      return;
    }
  }

  // 이벤트
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') performSearch(searchInput.value.trim(), 'post');
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => showScreen(0));
  });

  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      const currentScreen = Array.from(screens).find(
        sc => sc.style.display === 'block',
      );
      if (!currentScreen) return;

      const tabs = currentScreen.querySelectorAll<HTMLButtonElement>('.tab');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const keyword = searchInput!.value.trim();
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
