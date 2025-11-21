import type { PostDetail } from '../../../types/post-detail';

// export function saveRecentPost(postId: number) {
//   const key = 'recentPosts';

//   const stored = JSON.parse(localStorage.getItem(key) || '[]');

//   const filtered = stored.filter((id: number) => id !== postId);

//   filtered.unshift(postId);

//   const limited = filtered.slice(0, 10);

//   localStorage.setItem(key, JSON.stringify(limited));
// }

export function saveRecentPost(post: PostDetail) {
  const recent = JSON.parse(localStorage.getItem('recentPosts') ?? '[]');
  const newItem = {
    id: post._id,
    title: post.title,
    image: post.image,
    author: post.user.name,
    createdAt: post.createdAt,
  };
  const filtered = recent.filter((item: any) => item.id !== newItem.id);
  const updated = [newItem, ...filtered];
  localStorage.setItem('recentPosts', JSON.stringify(updated.slice(0, 5)));
}
