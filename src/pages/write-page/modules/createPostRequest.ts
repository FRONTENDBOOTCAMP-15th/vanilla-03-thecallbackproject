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
    .map(t => t.replace('#', '').trim())
    .filter(Boolean)
    .slice(0, 5)
    .join(', ');

  let imageUrl: string | undefined = undefined;

  if (file) {
    imageUrl = await uploadImage(file);
    if (!imageUrl) imageUrl = undefined;
  } else {
    // ★ 첨부 이미지 없을 때 기본 이미지 강제 설정
    imageUrl = '/images/thumnail-image.jpg';
  }

  const data: any = {
    type: 'brunch',
    title,
    content,
  };

  // extra 처리
  const align = getAlign();
  const hasSubtitle = subTitle.trim().length > 0;

  if (hasSubtitle || align) {
    data.extra = {};
    if (hasSubtitle) data.extra.subTitle = subTitle;
    if (align) data.extra.align = align;
  }

  // ★ 이미지 추가
  if (imageUrl) data.image = imageUrl;

  // 태그 추가
  if (tag) data.tag = tag;

  return data;
}
