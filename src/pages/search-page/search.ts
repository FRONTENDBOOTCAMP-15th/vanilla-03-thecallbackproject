import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
  type SearchType = "post" | "author";

  const api = axios.create({
    baseURL: "https://fesp-api.koyeb.app/market",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Client-Id": "febc15-vanilla03-ecad",
    },
  });

  const screens = document.querySelectorAll<HTMLDivElement>(".screen");
  const searchInput = document.querySelector<HTMLInputElement>(".search-input");
  const chips = document.querySelectorAll<HTMLSpanElement>(".chip");
  const recentList = document.querySelector(".recent-keywords ul");
  const closeButtons = document.querySelectorAll<HTMLButtonElement>(".close-btn");
  const tabButtons = document.querySelectorAll<HTMLButtonElement>(".tab");
  const sortButtons = document.querySelectorAll<HTMLButtonElement>(".sort");

  function showScreen(index: number) {
    screens.forEach((screen, i) => {
      screen.style.display = i === index ? "block" : "none";
    });
  }

  function updateSearchTitle(keyword: string) {
    const titles = document.querySelectorAll(".search-keyword h1");
    titles.forEach((t) => (t.textContent = keyword));
  }

  function saveRecentKeyword(keyword: string) {
    let list = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    list = list.filter((v: string) => v !== keyword);
    list.unshift(keyword);
    list = list.slice(0, 5);
    localStorage.setItem("recentKeywords", JSON.stringify(list));
    renderRecentKeywords();
  }

  function deleteRecentKeyword(keyword: string) {
    let list = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    list = list.filter((v: string) => v !== keyword);
    localStorage.setItem("recentKeywords", JSON.stringify(list));
    renderRecentKeywords();
  }

  function renderRecentKeywords() {
    const list = JSON.parse(localStorage.getItem("recentKeywords") || "[]");
    if (!recentList) return;

    recentList.innerHTML = list
      .map(
        (k: string) => `
      <li>
        <span class="keyword-text">${k}</span>
        <button class="recent-remove" data-key="${k}">×</button>
      </li>`
      )
      .join("");

    recentList.querySelectorAll(".keyword-text").forEach((item) => {
      item.addEventListener("click", () => {
        const keyword = item.textContent!.trim();
        searchInput!.value = keyword;
        performSearch(keyword, "post");
      });
    });

    recentList.querySelectorAll(".recent-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key")!;
        deleteRecentKeyword(key);
      });
    });
  }

  
  // 검색 엔진
  
  async function performSearch(keyword: string, type: SearchType) {
    if (!keyword) return;

    updateSearchTitle(keyword);
    saveRecentKeyword(keyword);

    // "꿀" 검색
    if (keyword === "꿀") {
      if (type === "post") showScreen(1);
      else showScreen(2);
      return;
    }
    // 그 외 검색어는 결과 없음 화면으로
    // 나중에 api 해야됨
    showScreen(3);
  }

  
  // 이벤트
  
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const keyword = searchInput.value.trim();
      performSearch(keyword, "post");
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const keyword = chip.textContent!.trim();
      searchInput!.value = keyword;
      performSearch(keyword, "post");
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => showScreen(0));
  });

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabButtons.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const keyword = searchInput!.value.trim();
      const type = tab.textContent === "글" ? "post" : "author";

      if (keyword) performSearch(keyword, type);
    });
  });

  sortButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sortButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  renderRecentKeywords();
  showScreen(0);
});
