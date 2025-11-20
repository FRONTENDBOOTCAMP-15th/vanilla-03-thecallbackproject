export interface PostContent {
  _id: number;
  type: string;
  title: string;
  extra: {
    subTitle: string;
    align: string;
  };
  content: string;
  tag: string;
  createdAt: string;
  image: string;
}
