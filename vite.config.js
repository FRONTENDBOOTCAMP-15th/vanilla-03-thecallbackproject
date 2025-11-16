import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        // 메인 페이지
        index: 'index.html',
        // 로그인 페이지
        'pages/login/login-default': 'src/pages/login/login.html',
        // 카카오 로그인 페이지
        'pages/login/login-kakao': 'src/pages/login/login-kakao.html',
        // 카카오 간편로그인 페이지
        'pages/login/login-kakao-easy': 'src/pages/login/login-kakao-easy.html',
        // 회원가입 페이지
        'pages/login/login-join': 'src/pages/login/login-join.html',
        // 내 서랍 페이지
        'pages/my-info': 'src/pages/my-info.html',
        // 작가 홈 페이지
        'pages/writer-home': 'src/pages/writer-home.html',
        // 발견 페이지
        'pages/search': 'src/pages/search.html',
        // 글쓰기 페이지
        'pages/write': 'src/pages/write.html',
        // 상세 페이지
        'pages/detail': 'src/pages/detail.html',
        //
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
