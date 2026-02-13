
import { Post, Note, Book } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'u1',
    authorName: 'Dr. Aris Thorne',
    authorRole: 'Teacher',
    title: 'Tips for Final Examination in Quantum Mechanics',
    content: 'Ensure you review the Schrodinger equations for non-linear potentials. Most students struggle with the boundary conditions. I have uploaded extra practice sets in the Notes section.',
    upvotes: 142,
    comments: 24,
    tags: ['Physics', 'Exams', 'StudyTips'],
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    authorId: 'u2',
    authorName: 'Sarah Jenkins',
    authorRole: 'Student',
    title: 'Anyone up for a study group for Data Structures?',
    content: 'Planning to meet at the Central Library tomorrow at 2 PM. We are focusing on Dynamic Programming and Graphs. Everyone is welcome!',
    upvotes: 45,
    comments: 12,
    tags: ['CS', 'StudyGroup', 'Networking'],
    createdAt: '5 hours ago'
  }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Introduction to Algorithms - Complete Lecture Notes',
    subject: 'Computer Science',
    author: 'Prof. Miller',
    downloads: 1250,
    rating: 4.8,
    previewUrl: 'https://picsum.photos/seed/n1/400/300',
    fileSize: '4.2 MB'
  },
  {
    id: 'n2',
    title: 'Microeconomics Theory Summary',
    subject: 'Economics',
    author: 'Jessica Wu',
    downloads: 840,
    rating: 4.5,
    previewUrl: 'https://picsum.photos/seed/n2/400/300',
    fileSize: '1.8 MB'
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'The Art of Computer Programming',
    author: 'Donald Knuth',
    subject: 'Algorithms',
    link: 'https://amazon.com',
    price: '$45.99',
    image: 'https://picsum.photos/seed/b1/200/300'
  },
  {
    id: 'b2',
    title: 'Organic Chemistry: A Biological Approach',
    author: 'John McMurry',
    subject: 'Chemistry',
    link: 'https://amazon.com',
    price: '$89.00',
    image: 'https://picsum.photos/seed/b2/200/300'
  }
];

export const CENSORED_WORDS = ['hate', 'spam', 'violent', 'abuse'];
