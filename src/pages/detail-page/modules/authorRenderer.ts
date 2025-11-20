import type { AuthorDetail } from '../../../types/detail-author';
import { getProfileImage } from './profile';

export function renderAuthorDetail(author: AuthorDetail) {
  const linkEl = document.querySelector(
    '.author-info-box a',
  ) as HTMLAnchorElement;
  linkEl.href = `/src/pages/writer-home-page/writer-home.html?id=${author._id}`;

  const nameEl = linkEl.querySelector('.author-name') as HTMLElement;
  const jobEl = linkEl.querySelector('.author-job') as HTMLElement;
  const profileImg = linkEl.querySelector('img') as HTMLImageElement;

  nameEl.textContent = author.name;
  jobEl.textContent = author.extra?.job || '';
  profileImg.src = getProfileImage(author.image);

  document.querySelector('.author-desc')!.textContent =
    author.extra?.biography || '';
  document.querySelector('.subscriber-count')!.textContent = String(
    author.bookmarkedBy?.users ?? 0,
  );
}
