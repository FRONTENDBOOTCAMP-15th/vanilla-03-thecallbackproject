import { getAxios } from '../utils/axios';

const axiosInstance = getAxios();

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('attach', file); // 서버 요구사항!

  const { data } = await axiosInstance.post('/files/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('파일 업로드 응답:', data);

  // 서버 응답이 { ok: 1, item: [...] } 구조임
  if (data && data.item && Array.isArray(data.item) && data.item.length > 0) {
    return data.item[0].path; // ← 정답
  }

  return ''; // 업로드 실패 시 기본값
}
