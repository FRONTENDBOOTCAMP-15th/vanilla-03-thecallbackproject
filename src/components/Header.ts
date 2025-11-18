import type { User } from '../types/user';

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
      <a href="#" class="profile-btn" aria-label="프로필 버튼">
        <img
          src="${user.image}"
          onerror="this.src='/src/assets/images/login-profile.svg'"
        />
      </a>
    `;

    const logoutHTML = `
      <a href="#" class="start-btn" aria-label="시작하기 버튼">
        시작하기
      </a>
    `;

    this.innerHTML = `
      <header>
        <h1 class="logo">
          <a href="https://brunch.co.kr/">
            <img
              src="/src/assets/images/logo-header.svg"
              aria-label="브런치 홈"
            />
          </a>
        </h1>

        <nav>
          <a class="search-btn" aria-label="검색 버튼">
            <img src="/src/assets/images/search.svg" alt="검색" />
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
