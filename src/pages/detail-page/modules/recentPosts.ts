export function saveRecentPost(postId: number) {
  const key = 'recentPosts';

  const stored = JSON.parse(localStorage.getItem(key) || '[]');

  const filtered = stored.filter((id: number) => id !== postId);

  filtered.unshift(postId);

  const limited = filtered.slice(0, 10);

  localStorage.setItem(key, JSON.stringify(limited));
}
