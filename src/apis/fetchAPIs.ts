import type { AuthorDetail } from '../types/detail-author';
import type { PostDetail } from '../types/post-detail';
import { getAxios } from '../utils/axios';

const axiosInstance = getAxios();

// 게시물 상세조회
export async function fetchPostDetail(id: string): Promise<PostDetail> {
  try {
    const { data } = await axiosInstance.get<{ item: PostDetail }>(
      `/posts/${id}`,
    );
    return data.item;
  } catch (err) {
    console.error('상세조회 실패:', err);
    throw err;
  }
}
// 작가 상세조회 (게시물 상세페이지용)
export async function fetchAuthorDetail(id: string): Promise<AuthorDetail> {
  try {
    const { data } = await axiosInstance.get<{ item: AuthorDetail }>(
      `/users/${id}`,
    );
    return data.item;
  } catch (err) {
    console.error('작성자 상세 조회 실패:', err);
    throw err;
  }
}
