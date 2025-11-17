// console.log('✅ header_footer.ts 연결 확인');
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getAxios } from '../../utils/axios';

const api = getAxios();

// 서버에서 데이터 fetch 해오기
async function fetchBrunchPosts() {
  const res = await api.get('/posts', {
    params: {
      type: 'brunch',
      limit: 10,
      sort: JSON.stringify({ createdAt: -1 }),
    },
  });

  return res.data.item;
}

// DOM에 데이터 뿌리기
window.addEventListener('DOMContentLoaded', async () => {
  const posts = await fetchBrunchPosts();

  console.log(posts); // 🔥 콘솔 확인

  const brunchLiEl = document.querySelector('.brunch-list ol');

  brunchLiEl!.innerHTML = posts
    .map(
      (post: any, i: number) =>
        `<li class="brunch-list-books">
      <div class="brunch-list-book">
<h3>${post.title}</h3>
<h4>by ${post.user?.name || '익명'}</h4>
<p>${post.content || ''}</p>
</div>
      <img src="${post.image}" alt="${post.title} 이미지" 
      // onerror="this.src='/src/assets/images/brunch-list-book.svg'"
      /> </li>`,
    )
    .join('');
});

// swiper 영역
const swiper = new Swiper('.swiper', {
  modules: [Pagination],

  // 페이지네이션 디폴트 모양 bullet 기호
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'bullets',
  },

  // fraction 구현 보류
  // on: {
  //   init(swiper) {
  //     const fractionEl = document.querySelector(
  //       '.swiper-pagination-fraction',
  //     ) as HTMLElement;
  //     fractionEl.textContent = `1 / ${swiper.slides.length}`;
  //   },
  //   slideChange(swiper) {
  //     const fractionEl = document.querySelector(
  //       '.swiper-pagination-fraction',
  //     ) as HTMLElement;
  //     fractionEl.textContent = `${swiper.activeIndex + 1} / ${swiper.slides.length}`;
  //   },
  // },

  slidesPerView: 1, // 디폴트는 'auto'
  spaceBetween: 0, // 슬라이드 .swiper-slide 들 사이 가로 간격
});
