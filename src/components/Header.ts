import type { User } from '../types/user';
import search from '/src/assets/images/search.svg';
import noti from '/src/assets/images/noti-btn.svg';
import logo from '/src/assets/images/logo-header.svg';
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const user = this.getUser();

    // 로그인 시, 표시될 '알림' 버튼
    const loginHTML = `
      <a class="alarm-btn" aria-label="알림 버튼">
        <img src="${noti}" />
      </a>
      `;

    // 로그인 시, 표시될 "프로필" 버튼 (검색 버튼 뒤에 위치)
    const profileHTML = `
      <a href="/src/pages/myinfo/my-info.html" class="profile-btn" aria-label="프로필 버튼">
        <img
          src="${user.image}"
          onerror="this.src='/images/login-profile-fallback.svg'"
        />
      </a>
      `;

    const logoutHTML = `
      <a href="/src/pages/login-page/login.html" class="start-btn" aria-label="시작하기 버튼">
        시작하기
      </a>
    `;

    this.innerHTML = `
      <header class="header ${user?.token ? 'login' : ''}">
        <h1 class="logo">
          <a href="/index.html">
            <img
              src="${logo}"
              aria-label="브런치 홈"
            />
          </a>
        </h1>

        <nav>

        ${user?.token ? loginHTML : ''}


          <a href="/src/pages/search-page/search.html" class="search-btn" aria-label="검색 버튼">
            <img src="${search}" alt="검색" />
          </a>


          ${user?.token ? profileHTML : logoutHTML}
        </nav>
      </header>
    `;
  }

  private getUser(): User {
    return JSON.parse(localStorage.getItem('item') || '{}');
  }
}

customElements.define('brunch-header', HeaderComponent);
