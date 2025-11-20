import type { PostDetail } from '../../../types/post-detail';

export function updateMetaTags(post: PostDetail) {
  const titleTag = document.querySelector('title');
  const metaTitle = document.querySelector('meta[name="title"]');
  const metaDesc = document.querySelector('meta[name="description"]');
  const metaAuthor = document.querySelector('meta[name="author"]');

  const contentText = post.content.replace(/<[^>]+>/g, '').trim();
  const shortDescription =
    contentText.length > 100 ? contentText.slice(0, 97) + '...' : contentText;

  if (titleTag) titleTag.textContent = post.title;
  if (metaTitle) metaTitle.setAttribute('content', post.title);
  if (metaDesc)
    metaDesc.setAttribute(
      'content',
      shortDescription || post.extra.subTitle || '',
    );
  if (metaAuthor) metaAuthor.setAttribute('content', post.user.name);
}
