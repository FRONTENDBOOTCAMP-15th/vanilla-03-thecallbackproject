import type { User } from '../types/user';
import search from '/src/assets/images/search.svg';
import logo from '/src/assets/images/logo-header.svg';
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const user = this.getUser();

    const loginHTML = `
      <a class="alarm-btn" aria-label="알림 버튼">
        <img src="/src/assets/images/noti-btn.svg" />
      </a>
      <a href="/src/pages/myinfo/my-info.html" class="profile-btn" aria-label="프로필 버튼">
        <img
          src="${user.image}"
          onerror="this.src='/src/assets/images/login-profile.svg'"
        />
      </a>
    `;

    const logoutHTML = `
      <a href="/src/pages/login-page/login.html" class="start-btn" aria-label="시작하기 버튼">
        시작하기
      </a>
    `;

    this.innerHTML = `
      <header class="header">
        <h1 class="logo">
          <a href="/index.html">
            <img
              src="${logo}"
              aria-label="브런치 홈"
            />
          </a>
        </h1>

        <nav>
          <a href="/src/pages/search-page/search.html" class="search-btn" aria-label="검색 버튼">
            <img src="${search}" alt="검색" />
          </a>

          ${user?.name ? loginHTML : logoutHTML}
        </nav>
      </header>
    `;
  }

  private getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}

customElements.define('brunch-header', HeaderComponent);
