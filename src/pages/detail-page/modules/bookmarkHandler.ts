import {
  addBookmark,
  getMyBookmarks,
  removeBookmark,
} from '../../../apis/likePostAPIs';
import { getAuthorizationHeader } from '../../../utils/axios';

type BookmarkItem = {
  _id: number;
  post?: { _id: number };
};

export async function setupBookmarkButton(post: any) {
  const likeBtn = document.querySelector('.like-btn') as HTMLButtonElement;
  if (!likeBtn) return;

  const countSpan = likeBtn.querySelector('span') as HTMLSpanElement;
  if (!countSpan) return;

  let isBookmarked = false;
  let isBookmarking = false;

  const authHeader = getAuthorizationHeader();
  const isLoggedIn = authHeader && authHeader.startsWith('Bearer ');

  if (isLoggedIn) {
    const myBookmarks = (await getMyBookmarks()) as BookmarkItem[];
    const found = myBookmarks.find(
      b => Number(b.post?._id) === Number(post._id),
    );

    if (found) {
      isBookmarked = true;
      likeBtn.classList.add('on');
    }
  }

  likeBtn.addEventListener('click', async () => {
    const authHeader = getAuthorizationHeader();
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      alert('로그인 후 이용 가능합니다');
      return;
    }

    if (isBookmarking) return;
    isBookmarking = true;

    try {
      if (!isBookmarked) {
        await addBookmark(Number(post._id));

        countSpan.textContent = String(Number(countSpan.textContent) + 1);
        likeBtn.classList.add('on');
        isBookmarked = true;
      } else {
        const bookmarks = (await getMyBookmarks()) as BookmarkItem[];
        const target = bookmarks.find(
          b => Number(b.post?._id) === Number(post._id),
        );

        if (target) {
          await removeBookmark(Number(target._id));

          countSpan.textContent = String(
            Math.max(0, Number(countSpan.textContent) - 1),
          );
          likeBtn.classList.remove('on');
          isBookmarked = false;
        }
      }
    } catch (err) {
      alert('좋아요 처리 실패');
    } finally {
      isBookmarking = false;
    }
  });
}
