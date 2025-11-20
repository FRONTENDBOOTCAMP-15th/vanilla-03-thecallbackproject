import { deletePostAPI } from '../../../apis/deletePostAPIs';

function getLoginUserId(): number | null {
  const item = localStorage.getItem('item');
  if (!item) return null;

  try {
    const parsed = JSON.parse(item);
    return Number(parsed._id) ?? null;
  } catch {
    return null;
  }
}

export function setupPostDeleteButton(post: any) {
  const deleteBtn = document.querySelector(
    '.post-delete-btn',
  ) as HTMLButtonElement;

  if (!deleteBtn) return;

  const loginUserId = getLoginUserId();
  if (loginUserId === null) return;

  const isMyPost = loginUserId === Number(post.user._id);
  if (!isMyPost) return;

  deleteBtn.style.display = 'block';

  deleteBtn.addEventListener('click', async () => {
    const ok = confirm('이 게시글을 삭제하시겠습니까?');
    if (!ok) return;

    try {
      await deletePostAPI(Number(post._id));

      alert('게시글이 삭제되었습니다');
      location.href = '/index.html';
    } catch {
      alert('게시글 삭제 실패');
    }
  });
}
