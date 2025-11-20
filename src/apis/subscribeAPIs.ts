import { getAxios } from '../utils/axios';
const axiosInstance = getAxios();

export async function addSubscribe(userId: number) {
  const body = { target_id: userId };
  const { data } = await axiosInstance.post('/bookmarks/user', body);
  return data;
}

export async function removeSubscribe(bookmarkId: number) {
  const { data } = await axiosInstance.delete(`/bookmarks/${bookmarkId}`);
  return data;
}

export async function getMySubscriptions() {
  const { data } = await axiosInstance.get('/bookmarks/user');
  return data.item ?? [];
}
