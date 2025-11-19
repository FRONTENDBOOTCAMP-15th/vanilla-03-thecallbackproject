document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------------------
  // 타입 정의
  // -----------------------------------------------------
  type SearchType = "post" | "author";
  type SortType = "accuracy" | "latest";

  interface PostItem {
    id: number;
    title: string;
    desc: string;
    date: string;
    author: string;
    thumbnail: string;
  }

  interface AuthorItem {
    id: number;
    name: string;
    desc: string;
    tags: string[];
    profileImg: string;
  }

  interface SearchResponse<T> {
    total: number;
    items: T[];
  }

  // -----------------------------------------------------
  // mock API
  // -----------------------------------------------------
  async function fetchSearch(
    keyword: string,
    type: SearchType,
    sort: SortType
  ): Promise<SearchResponse<any>> {
    const res = await fetch("/mock/search.json");
    return await res.json();
  }

  // -----------------------------------------------------
  // DOM 요소들
  // -----------------------------------------------------
  const screens = document.querySelectorAll<HTMLDivElement>(".screen");
  const searchInput = document.querySelector<HTMLInputElement>(".search-input");
  const chips = document.querySelectorAll<HTMLSpanElement>(".chip");
  const recentList = document.querySelector(".recent-keywords ul");
  const closeButtons = document.querySelectorAll<HTMLButtonElement>(".close-btn");
  const tabButtons = document.querySelectorAll<HTMLButtonElement>(".tab");
  const sortButtons = document.querySelectorAll<HTMLButtonElement>(".sort");

  const postList = document.querySelector(".post-list");
  const authorList = document.querySelector(".author-list");

  // -----------------------------------------------------
  // 화면 전환 함수
  // -----------------------------------------------------
  function showScreen(index: number) {
    screens.forEach((screen, i) => {
      screen.style.display = i === index ? "block" : "none";
    });
  }

  // -----------------------------------------------------
  // 최근 검색어 저장/삭제/렌더링
  // -----------------------------------------------------
  function saveRecentKeyword(keyword: string) {
    let recents = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    recents = recents.filter((k: string) => k !== keyword);
    recents.unshift(keyword);
    recents = recents.slice(0, 5);

    localStorage.setItem("recentKeywords", JSON.stringify(recents));
    renderRecentKeywords();
  }

  function deleteRecentKeyword(keyword: string) {
    let recents = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    recents = recents.filter((k: string) => k !== keyword);
    localStorage.setItem("recentKeywords", JSON.stringify(recents));
    renderRecentKeywords();
  }

  function renderRecentKeywords() {
    const recents = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    if (!recentList) return;

    recentList.innerHTML = recents
      .map(
        (k: string) => `
      <li>
        <span class="keyword-text">${k}</span>
        <button class="recent-remove" data-key="${k}">×</button>
      </li>
    `
      )
      .join("");

    // 검색어 클릭
    recentList.querySelectorAll(".keyword-text").forEach((item) => {
      item.addEventListener("click", () => {
        const keyword = item.textContent!.trim();
        searchInput!.value = keyword;
        performSearch(keyword, "post");
      });
    });

    // 개별 삭제
    recentList.querySelectorAll(".recent-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key")!;
        deleteRecentKeyword(key);
      });
    });
  }

  // -----------------------------------------------------
  // 검색 실행
  // -----------------------------------------------------
  async function performSearch(keyword: string, type: SearchType) {
    if (!keyword) return;

    saveRecentKeyword(keyword);

    const result = await fetchSearch(keyword, type, "accuracy");

    if (type === "post") {
      renderPostResults(result);
      showScreen(1);
    }

    if (type === "author") {
      renderAuthorResults(result);
      showScreen(2);
    }

    if (result.items.length === 0) {
      showScreen(3);
    }
  }

  // -----------------------------------------------------
  // 글/작가 렌더링 함수
  // -----------------------------------------------------
  function renderPostResults(res: SearchResponse<PostItem>) {
    const info = document.querySelector(".result-info p");
    if (info) info.innerHTML = `글 검색 결과 <strong>${res.total}건</strong>`;

    if (!postList) return;

    postList.innerHTML = res.items
      .map(
        (item) => `
      <li class="post-item">
        <a href="#">
          <div class="text-content">
            <h3 class="title">${item.title}</h3>
            <p class="desc">${item.desc}</p>
            <p class="meta">${item.date} · <span class="author">by ${item.author}</span></p>
          </div>
          <div class="thumbnail"><img src="${item.thumbnail}" /></div>
        </a>
      </li>`
      )
      .join("");
  }

  function renderAuthorResults(res: SearchResponse<AuthorItem>) {
    const info = document.querySelector(".search-section p");
    if (info) info.innerHTML = `작가 검색 결과 <strong>${res.total}건</strong>`;

    if (!authorList) return;

    authorList.innerHTML = res.items
      .map(
        (item) => `
      <li class="author-item">
        <a href="#">
          <div class="profile-thumb">
            <img src="${item.profileImg}" alt="${item.name}" />
          </div>
          <div class="author-info">
            <h3 class="name">${item.name}</h3>
            <p class="desc">${item.desc}</p>
            <ul class="tags">
              ${item.tags.map((tag) => `<li><span class="tag">${tag}</span></li>`).join("")}
            </ul>
          </div>
        </a>
      </li>`
      )
      .join("");
  }

  // -----------------------------------------------------
  // 이벤트 바인딩
  // -----------------------------------------------------

  // 엔터 검색
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch(searchInput.value.trim(), "post");
    }
  });

  // 인기 키워드 클릭
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const keyword = chip.textContent!.trim();
      searchInput!.value = keyword;
      performSearch(keyword, "post");
    });
  });

  // 닫기 버튼 → 입력 화면으로
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => showScreen(0));
  });

  // 탭 전환
  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabButtons.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const keyword = searchInput!.value.trim();
      const type = tab.textContent === "글" ? "post" : "author";

      if (keyword) {
        performSearch(keyword, type);
      }
    });
  });

  // 정렬 버튼
  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // 초기 세팅
  renderRecentKeywords();
  showScreen(0);
});
