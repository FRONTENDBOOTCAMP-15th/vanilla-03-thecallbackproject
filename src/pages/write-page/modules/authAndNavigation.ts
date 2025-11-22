import { getAuthorizationHeader } from '../../../utils/axios';

export function checkAuthAndBackButton() {
  const auth = getAuthorizationHeader();

  if (!auth || !auth.startsWith('Bearer ')) {
    window.location.href = '/src/pages/login-page/login.html';
    return;
  }
  localStorage.removeItem('writePage');

  const backBtn = document.querySelector('.back-btn') as HTMLAnchorElement;
  backBtn?.addEventListener('click', () => {
    history.back();
  });
}
