import type { PostDetail } from '../../../types/post-detail';

// export function saveRecentPost(post: PostDetail) {
//   const recent = JSON.parse(localStorage.getItem('recentPosts') ?? '[]');
//   const newItem = {
//     id: post._id,
//     title: post.title,
//     image: post.image,
//     author: post.user.name,
//     createdAt: post.createdAt,
//   };
//   const filtered = recent.filter((item: any) => item.id !== newItem.id);
//   const updated = [newItem, ...filtered];
//   localStorage.setItem('`recentPosts', JSON.stringify(updated.slice(0, 5)));
// }
export function saveRecentPost(post: PostDetail) {
  const userItem = localStorage.getItem('item');
  const user = userItem ? JSON.parse(userItem) : null;

  if (!user?._id) return;
  const key = `recentPosts_${user._id}`;

  const stored = JSON.parse(localStorage.getItem(key) ?? '[]');

  const cleaned = stored.filter((item: any) => item && item.id);

  const newItem = {
    id: post._id,
    title: post.title,
    image: post.image,
    author: post.user.name ?? '미공개',
    createdAt: post.createdAt,
  };

  const filtered = cleaned.filter((item: any) => item.id !== newItem.id);

  const updated = [newItem, ...filtered];

  localStorage.setItem(key, JSON.stringify(updated.slice(0, 5)));
}
