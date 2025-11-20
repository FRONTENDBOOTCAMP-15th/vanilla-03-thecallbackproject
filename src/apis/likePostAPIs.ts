import { getAxios } from '../utils/axios';

const axiosInstance = getAxios();

// 관심글 등록(좋아요)
export async function addBookmark(postId: number) {
  const body = {
    target_id: postId,
  };

  const { data } = await axiosInstance.post('/bookmarks/post', body);
  return data;
}

// 관심글 삭제(좋아요 취소)
export async function removeBookmark(bookmarkId: number) {
  const { data } = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
  return data;
}

// 내 북마크(좋아요) 목록 가져오기
export async function getMyBookmarks() {
  const { data } = await axiosInstance.get('/bookmarks/post');
  // data.item 배열이 반환됨 (내가 북마크한 게시글 리스트)
  return data.item ?? [];
}
