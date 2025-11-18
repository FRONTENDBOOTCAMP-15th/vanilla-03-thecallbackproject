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
        'pages/login-page/login': 'src/pages/login-page/login.html',
        // 회원가입 페이지
        'pages/login-page/login-join': 'src/pages/login-page/login-join.html',
        // 내 서랍 페이지
        'pages/myinfo/my-info': 'src/pages/myinfo/my-info.html',
        // 작가 홈 페이지
        'pages/writer-home-page/writer-home':
          'src/pages/writer-home-page/writer-home.html',
        // 발견 페이지
        'pages/search-page/search': 'src/pages/search-page/search.html',
        // 글쓰기 페이지
        'pages/write-page/write': 'src/pages/write-page/write.html',
        // 상세 페이지
        'pages/detail-page/detail': 'src/pages/detail-page/detail.html',
        //
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});