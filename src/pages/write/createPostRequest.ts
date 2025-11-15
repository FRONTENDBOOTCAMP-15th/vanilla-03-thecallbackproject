import { uploadImage } from '../../apis/uploadAPIs';

export async function createPostRequest(
  title: string,
  subtitle: string,
  content: string,
  getAlign: () => string,
  file?: File,
) {
  let imageUrl = '';

  if (file) {
    // 업로드 API 호출해서 URL 받아오기
    imageUrl = await uploadImage(file);
  }

  return {
    _id: Date.now(),
    type: 'brunch',
    title,
    extra: {
      subtitle,
      align: getAlign(),
    },
    content,
    createdAt: new Date().toISOString(),
    image: imageUrl, // ← 업로드 API에서 받은 URL 저장
  };
}
