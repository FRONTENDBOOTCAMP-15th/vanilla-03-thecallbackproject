export interface FollowAuthor {
  _id: number;
  memo: string;
  user: {
    _id: number;
    name: string;
    image: string;
  };
}
export type BookmarkPost = {
  _id: number;
  memo: string;
  post: {
    _id: number;
    title: string;
    image: string;
    user: {
      _id: number;
      name: string;
      image: string;
    };
  };
};
