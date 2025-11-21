import { uploadImage } from './../../../apis/uploadAPIs';

export async function createPostRequest(
  title: string,
  subTitle: string,
  content: string,
  tagsEl: string,
  getAlign: () => string,
  file?: File,
) {
  const tag = tagsEl
    .split(' ')
    .map(tag => tag.replace('#', ''))
    .filter(tag => tag.trim() !== '')
    .slice(0, 5)
    .join(', ');

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
      subTitle,
      align: getAlign(),
    },
    content,
    tag,
    createdAt: new Date().toISOString(),
    image: imageUrl, // ← 업로드 API에서 받은 URL 저장
  };
}
