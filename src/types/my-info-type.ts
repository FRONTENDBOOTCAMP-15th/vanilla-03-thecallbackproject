export interface FollowAuthor {
  _id: number;
  memo: string;
  user: {
    _id: number;
    name: string;
    image: string;
  };
}
