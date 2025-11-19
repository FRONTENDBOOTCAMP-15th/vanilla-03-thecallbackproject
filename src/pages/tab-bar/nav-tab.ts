class TabNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="tab-nav" aria-label="하단 메뉴">
        <ul class="tab-list">
          <li class="home-li">
            <a href="/index.html" class="tab-item">
              <img src="./../../../icons/home.png" class="off" alt="" aria-hidden="true" />
              <img src="./../../../icons/home-on.png" class="on" alt="" aria-hidden="true" />
              <span>홈</span>
            </a>
          </li>

          <li class="search-li">
            <a href="/src/pages/search-page/search.html" class="tab-item">
              <img src="./../../../icons/search.png" class="off" alt="" aria-hidden="true" />
              <img src="./../../../icons/search-on.png" class="on" alt="" aria-hidden="true" />
              <span>발견</span>
            </a>
          </li>

          <li class="write-li">
            <a href="/src/pages/write-page/write.html" class="tab-item">
              <img src="./../../../icons/write.png" class="off" alt="" aria-hidden="true" />
              <img src="./../../../icons/write-click.png" class="click" alt="" aria-hidden="true" />
              <span>글쓰기</span>
            </a>
          </li>

          <li class="myinfo-li">
            <a href="/src/pages/myinfo/my-info.html" class="tab-item">
              <img src="./../../../icons/myinfo.png" class="off" alt="" aria-hidden="true" />
              <img src="./../../../icons/myinfo-on.png" class="on" alt="" aria-hidden="true" />
              <span>내 서랍</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('tab-nav', TabNav);
