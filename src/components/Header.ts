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

    // 로그인 시, 표시될 "프로필" 버튼 (검색 버튼 뒤에 위치) + 드롭다운 추가
    const profileHTML = `
    <div class="profile-dropdown-wrapper">
      <a href="/src/pages/myinfo/my-info.html" class="profile-btn" aria-label="프로필 버튼">
        <img
          src="${user.image}"
          onerror="this.src='/images/login-profile-fallback.svg'"
        />
      </a>

        <ul class="profile-dropdown">
          <li><a href="/src/pages/myinfo/my-info.html">내 서랍</a></li>
          <li><a href="/src/pages/write-page/write.html">글쓰기</a></li>
          <li class="logout-btn">로그아웃</li>
        </ul>
      </div>
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

    this.addDropdownEvent();
  }

  // 드롭다운 + 로그아웃 기능 추가
  private addDropdownEvent() {
    const profileBtn = this.querySelector('.profile-btn');
    const dropdown = this.querySelector('.profile-dropdown');
    const logoutBtn = this.querySelector('.logout-btn');

    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', e => {
        e.preventDefault();
        dropdown.classList.toggle('show');
      });

      document.addEventListener('click', e => {
        if (!this.contains(e.target as Node)) dropdown.classList.remove('show');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('item');
        alert('로그아웃 되었습니다.');
        location.reload();
      });
    }
  }

  private getUser(): User {
    const raw = localStorage.getItem('item');
    if (!raw || raw === 'undefined') return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
}

customElements.define('brunch-header', HeaderComponent);
