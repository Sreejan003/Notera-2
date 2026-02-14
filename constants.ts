
import { Post, Note, Book } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'u1',
    authorName: 'Dr. Sunil Jadhav',
    authorRole: 'Teacher',
    title: 'Tips for Final Examination in Quantum Mechanics',
    content: 'Ensure you review the Schrödinger equation ($H\\psi = E\\psi$) for non-linear potentials. Most students struggle with boundary conditions in the infinite square well problem.',
    subject: 'Physics',
    upvotes: 142,
    comments: 2,
    commentsList: [
      { id: 'c1', authorName: 'Aditi Verma', authorRole: 'Student', text: 'Thank you Professor! Will the tunneling effect be covered in the paper?', createdAt: '1h ago' },
      { id: 'c2', authorName: 'Rohan Sharma', authorRole: 'Student', text: 'I have a doubt regarding the normalization of the wave function for complex potentials.', createdAt: '30m ago' }
    ],
    tags: ['Physics', 'Exams'],
    createdAt: '2h ago',
    isResolved: true,
    resolution: 'The tunneling effect is a core topic, please review the potential barrier problem in chapter 4. Remember that the transmission coefficient $T$ depends exponentially on the barrier width $L$.',
    isPinned: true
  },
  {
    id: '2',
    authorId: 'u2',
    authorName: 'Sanya Iyer',
    authorRole: 'Student',
    title: 'Anyone up for a study group for Data Structures?',
    content: 'Planning to meet at the Central Library. We are focusing on Dynamic Programming and Big O notation like $O(n \\log n)$. We will also cover Graph algorithms.',
    subject: 'Computer Science',
    upvotes: 45,
    comments: 1,
    commentsList: [
      { id: 'c3', authorName: 'Ishaan Kapur', authorRole: 'Student', text: 'Count me in! What time are you meeting?', createdAt: '4h ago' }
    ],
    tags: ['CS', 'StudyGroup'],
    createdAt: '5h ago',
    isResolved: false,
    isPinned: false
  }
];

export const MOCK_NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Introduction to Algorithms - Complete Lecture Notes',
    subject: 'Computer Science',
    author: 'Prof. Rajesh Khanna',
    downloads: 1250,
    rating: 4.8,
    previewUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400',
    fileSize: '4.2 MB',
    fileUrl: '#'
  },
  {
    id: 'n2',
    title: 'Microeconomics Theory Summary',
    subject: 'Economics',
    author: 'Ananya Deshmukh',
    downloads: 840,
    rating: 4.5,
    previewUrl: 'https://images.unsplash.com/photo-1611974717482-480928d195d6?auto=format&fit=crop&q=80&w=400',
    fileSize: '1.8 MB',
    fileUrl: '#'
  },
  {
    id: 'n3',
    title: 'Organic Chemistry: Reaction Mechanisms',
    subject: 'Chemistry',
    author: 'Dr. Meera Nair',
    downloads: 2100,
    rating: 4.9,
    previewUrl: 'https://images.unsplash.com/photo-1603126731709-642fd5a7bb95?auto=format&fit=crop&q=80&w=400',
    fileSize: '5.5 MB',
    fileUrl: '#'
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Introduction to Algorithms (CLRS)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    subject: 'Computer Science',
    link: 'https://www.amazon.in/Introduction-Algorithms-Eastern-Economy-Edition/dp/8120340078',
    price: '₹945',
    image: 'https://m.media-amazon.com/images/I/41T07nqZneL._SX382_BO1,204,203,200_.jpg'
  },
  {
    id: 'b2',
    title: 'Concepts of Physics (Vol. 1)',
    author: 'H.C. Verma',
    subject: 'Physics',
    link: 'https://www.amazon.in/Concepts-Physics-1-2018-2019-Session/dp/8177091875',
    price: '₹460',
    image: 'https://m.media-amazon.com/images/I/81IpxvH-SLL.jpg'
  }
];

export const UPCOMING_BOOKS = [
  {
    id: 'ub1',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    subject: 'AI & ML',
    image: 'https://m.media-amazon.com/images/I/81Y7y6O2ZtL.jpg',
    expectedDate: 'Nov 2025'
  }
];

export const CENSORED_WORDS = ['hate', 'spam', 'violent', 'abuse'];
