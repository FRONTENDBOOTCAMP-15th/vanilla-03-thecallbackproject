import { getAuthorizationHeader } from '../../utils/axios';

window.addEventListener('DOMContentLoaded', function () {
  const auth = getAuthorizationHeader();

  if (!auth || !auth.startsWith('Bearer')) {
    window.location.href = '/src/pages/login-page/login.html';
  }
  // 로그인토큰이 없는 상태면 로그인화면으로 반환
});
