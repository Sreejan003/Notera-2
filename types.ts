
export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  university: string;
  avatar: string;
  age?: number;
  classOrDept?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  tags: string[];
  createdAt: string;
  imageUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  author: string;
  downloads: number;
  rating: number;
  previewUrl: string;
  fileSize: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  link: string;
  price: string;
  image: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
