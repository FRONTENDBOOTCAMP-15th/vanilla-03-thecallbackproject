import { getAxios } from '../utils/axios';

const axiosInstance = getAxios();

/**
 * 댓글 생성 API
 * @param postId - 댓글을 달 게시물 ID
 * @param content - 댓글 내용
 */
export async function createReply(postId: string, content: string) {
  try {
    const { data } = await axiosInstance.post(`/posts/${postId}/replies`, {
      content,
    });

    // 서버 응답이 { ok: 1, item: {...} } 형태이므로 ok 체크
    if (!data.ok) {
      throw new Error('댓글 작성 실패');
    }

    return data.item; // 서버가 돌려주는 댓글 객체
  } catch (err) {
    console.error('댓글 생성 API 오류:', err);
    throw err; // detail.ts에서 처리하게 던짐
  }
}

export async function deleteReplyAPI(postId: string, replyId: string) {
  try {
    const { data } = await axiosInstance.delete(
      `/posts/${postId}/replies/${replyId}`,
    );
    return data;
  } catch (error) {
    console.error('댓글 삭제 API 호출 중 오류:', error);
    throw error;
  }
}
