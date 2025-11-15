/**
 * 게시글 전체 정보 (서버에서 반환하는 완전한 형태)
 */
export interface PostContent {
  _id: number;
  type: string;
  // "user": {
  //   "_id": number;
  //   "name": string;
  // };
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  createdAt: string;
  image: string;
}
