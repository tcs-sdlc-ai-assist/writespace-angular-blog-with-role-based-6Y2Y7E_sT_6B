export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface PostInput {
  title: string;
  content: string;
}