import { axiosInstance, getAxios } from '../../utils/axios';
import type { FollowAuthor, BookmarkPost } from '../../types/my-info-type';

window.addEventListener('DOMContentLoaded', async () => {
  const UserItem = localStorage.getItem('item');
  const user = UserItem ? JSON.parse(UserItem) : null;

  //이것때문에 오류났음. -> 인스턴스만 부르고 Axios안에 데이터를 가져와서 초기화해주지 않아서
  if (!axiosInstance) {
    getAxios();
  }
  //로그인 여부 확인
  if (!user) {
    window.location.href = '/src/pages/login-page/login.html';
  }

  // 관심 작가
  async function fetchFollowedAuthors(): Promise<FollowAuthor[]> {
    if (!axiosInstance) throw new Error('Axios not initialized');
    const res = await axiosInstance!.get('/bookmarks/user');
    return res.data.item as FollowAuthor[];
  }
  const followedAuthorsList = await fetchFollowedAuthors();
  const followedAuthorsEl = document.querySelector('.authors-list');
  if (!followedAuthorsList || !followedAuthorsEl) return;

  followedAuthorsEl.innerHTML = followedAuthorsList
    .map(value => {
      const author = value.user;
      return `
            <li>
            <a href="/src/pages/writer-home-page/writer-home.html?id=${author._id}">
            <figure>
            <img src="${author.image}" alt="${author.name}}" />
            <figcaption>${author.name}</figcaption>
            </figure>
            </a>
            </li>`;
    })
    .join('');
  // 최근 본 글

  // 관심 글
  async function fetchBookmarkPosts(): Promise<BookmarkPost[]> {
    if (!axiosInstance) throw new Error('Axios not initialized');
    const res = await axiosInstance!.get('/bookmarks/post');
    return res.data.item as BookmarkPost[];
  }
  const bookmarkList = await fetchBookmarkPosts();
  const bookmarkEl = document.querySelector('.post-list');
  if (!bookmarkList || !bookmarkEl) return;

  bookmarkEl.innerHTML = bookmarkList
    .map(value => {
      const bookmark = value.post;
      return `
      <li>
          <a href="/src/pages/detail-page/detail.html?id=${bookmark._id}">
            <figure>
              <img
                src="${bookmark.image}"
                alt="${bookmark.user.name}"
              />
              <figcaption class="bookcover-box">
                <h3>${bookmark.title}</h3>
                <p>${bookmark.user.name}</p>
              </figcaption>
            </figure>
          </a>
          <h3 class="book-title">${bookmark.title}</h3>
          <p class="book-author">${bookmark.user.name}</p>
        </li>
      `;
    })
    .join('');

  // 데이터 확인용
});
