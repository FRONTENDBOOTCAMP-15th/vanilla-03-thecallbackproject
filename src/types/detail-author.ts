export interface AuthorDetail {
  _id: number;
  name: string;
  image?: string; // 프로필 안 넣을 수 있음
  extra?: {
    job?: string;
    biography?: string;
  };
  bookmarkedBy?: {
    users?: number;
  };
}
