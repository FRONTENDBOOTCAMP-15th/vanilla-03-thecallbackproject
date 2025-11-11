console.log('✅ header_footer.ts 연결 확인');

window.addEventListener('DOMContentLoaded', () => {
  // map은 posts 배열의 각 요소(객체)를 p로 받아서,
  // 그 안의 title, author, views 값을 꺼내 HTML 문자열로 만들어 반환
  const posts = [
    {
      title: 'dummy1',
      author: 'by 작가 A',
      views: 100,
      subject: '제목 1',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy2',
      author: 'by 작가 B',
      views: 90,
      subject: '제목 2',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy3',
      author: 'by 작가 C',
      views: 80,
      subject: '제목 3',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy4',
      author: 'by 작가 D',
      views: 70,
      subject: '제목 4',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy5',
      author: 'by 작가 E',
      views: 60,
      subject: '제목 5',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy6',
      author: 'by 작가 F',
      views: 50,
      subject: '제목 6',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy7',
      author: 'by 작가 G',
      views: 40,
      subject: '제목 7',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy8',
      author: 'by 작가 H',
      views: 30,
      subject: '제목 8',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy9',
      author: 'by 작가 I',
      views: 20,
      subject: '제목 9',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
    {
      title: 'dummy10',
      author: 'by 작가 J',
      views: 10,
      subject: '제목 10',
      comment: '“abcdesdfsdgsdgsdgsgd”',
      occupation: 'OOO',
    },
  ];

  const listEl = document.querySelector('.brunch-list')!;
  listEl.innerHTML += posts
    .map(p => {
      return `<section><h3>${p.title}</h3><p>${p.author} · ${p.views} views</p></section>`;
    })
    .join('');

  const authorEl = document.querySelector('.author-grid')!;
  authorEl.innerHTML = posts
    .slice(0, 4)
    .map(p => {
      return `<article><h3>${p.author}</h3><p>${p.comment}</p></article>`;
    })
    .join('');
});
