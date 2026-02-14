
export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  university: string;
  avatar: string;
  age?: number;
  classOrDept?: string;
  department?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  department?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  subject: string;
  upvotes: number;
  comments: number;
  commentsList?: Comment[];
  tags: string[];
  createdAt: string;
  imageUrl?: string;
  isResolved?: boolean;
  resolution?: string;
  isPinned?: boolean; 
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
  fileUrl: string;
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

export interface AcademicStats {
  totalQuizzes: number;
  studentQuizzes: number;
  teacherQuizzes: number;
  doubtsRaised: number;
  doubtsResolved: number;
}
