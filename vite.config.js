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
        // 글쓰기 페이지
        'pages/write': 'src/pages/write.html',
        // 상세 페이지
        'pages/detail': 'src/pages/detail.html',
      },
    },
  },
  appType: 'mpa', // fallback 사용안함
});
