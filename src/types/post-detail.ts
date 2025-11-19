// 댓글 작성자 정보
export interface ReplyUser {
  _id: number;
  name: string;
  image: string;
}

// 댓글 정보
export interface Reply {
  _id: number;
  content: string;
  user: ReplyUser;
  createdAt: string;
}

// 작성자 정보
export interface PostUser {
  _id: number;
  name: string;
  image: string;
}

// 상세 게시물 타입
export interface PostDetail {
  _id: number;
  type: string;
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  views: number;
  user: PostUser;
  replies?: Reply[];
  createdAt: string;
  bookmarks: number;
  likes: number;
  image?: string;
  tag?: string;
}
