import { getAxios } from '../utils/axios';

// 게시글 삭제 API
export async function deletePostAPI(postId: number) {
  const axiosInstance = getAxios();

  try {
    const { data } = await axiosInstance.delete(`/posts/${postId}`);

    return data;
  } catch (error) {
    console.error('게시글 삭제 요청 실패:', error);
    throw error;
  }
}
