export interface PostContent {
  _id: number;
  type: string;
  title: string;
  extra: {
    subtitle: string;
    align: string;
  };
  content: string;
  tag: string;
  createdAt: string;
  image: string;
}
