import { getAxios } from '../utils/axios';

const axiosInstance = getAxios();

export async function uploadImage(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('attach', file);

    const { data } = await axiosInstance.post('/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('파일 업로드 응답:', data);
    // ★ 성공 시 이미지 경로 반환
    return data.item[0].path;
  } catch (err) {
    console.error('이미지 업로드 실패:', err);
    throw err;
  }
}
