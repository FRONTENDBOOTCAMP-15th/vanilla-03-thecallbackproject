import type { PostContent } from '../types/post';
import { getAxios } from './../utils/axios';

const axiosInstance = getAxios();

export async function addPost(postData: PostContent) {
  try {
    const { data } = await axiosInstance.post('/posts', postData );
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
