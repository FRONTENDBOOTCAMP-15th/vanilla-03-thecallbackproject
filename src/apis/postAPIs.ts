import type { PostContent } from '../types/post';
import { getAxios } from './../utils/axios';

const axiosInstance = getAxios();

export async function addPost(postData: PostContent) {
  try {
    console.log('보내는 데이터', postData);
    const { data } = await axiosInstance.post('/posts', postData);
    console.log('성공 응답:', data);
    return data;
  } catch (err) {
    console.log('실패 응답:', err);
    throw err;
  }
}
