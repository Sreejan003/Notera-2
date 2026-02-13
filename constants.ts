
import { Post, Note, Book } from './types';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'u1',
    authorName: 'Dr. Aris Thorne',
    authorRole: 'Teacher',
    title: 'Tips for Final Examination in Quantum Mechanics',
    content: 'Ensure you review the Schrödinger equation ($H\psi = E\psi$) for non-linear potentials. Most students struggle with boundary conditions. I have uploaded practice sets in the Notes section.',
    upvotes: 142,
    comments: 24,
    tags: ['Physics', 'Exams', 'StudyTips'],
    createdAt: ''
  },
  {
    id: '2',
    authorId: 'u2',
    authorName: 'Sarah Jenkins',
    authorRole: 'Student',
    title: 'Anyone up for a study group for Data Structures?',
    content: 'Planning to meet at the Central Library. We are focusing on Dynamic Programming and Big O notation ($O(n \log n)$). Everyone is welcome!',
    upvotes: 45,
    comments: 12,
    tags: ['CS', 'StudyGroup', 'Networking'],
    createdAt: ''
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
    previewUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400',
    fileSize: '4.2 MB'
  },
  {
    id: 'n2',
    title: 'Microeconomics Theory Summary',
    subject: 'Economics',
    author: 'Jessica Wu',
    downloads: 840,
    rating: 4.5,
    previewUrl: 'https://images.unsplash.com/photo-1611974717482-480928d195d6?auto=format&fit=crop&q=80&w=400',
    fileSize: '1.8 MB'
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
  },
  {
    id: 'b3',
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    subject: 'Engineering',
    link: 'https://www.amazon.in/Higher-Engineering-Mathematics-B-S-Grewal/dp/8193328493',
    price: '₹850',
    image: 'https://m.media-amazon.com/images/I/81-pS9P6V+L.jpg'
  },
  {
    id: 'b4',
    title: 'Object Oriented Programming with C++',
    author: 'E. Balagurusamy',
    subject: 'Computer Science',
    link: 'https://www.amazon.in/Object-Oriented-Programming-C-8th/dp/9389949181',
    price: '₹620',
    image: 'https://m.media-amazon.com/images/I/71YyP626PqL.jpg'
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
  },
  {
    id: 'ub2',
    title: 'Operating System Concepts',
    author: 'Silberschatz, Galvin, Gagne',
    subject: 'Computer Science',
    image: 'https://m.media-amazon.com/images/I/81q75xXvXBL.jpg',
    expectedDate: 'Dec 2025'
  },
  {
    id: 'ub3',
    title: 'Principles of Mathematical Analysis',
    author: 'Walter Rudin',
    subject: 'Mathematics',
    image: 'https://m.media-amazon.com/images/I/71p0v7pXnSL.jpg',
    expectedDate: 'Jan 2026'
  },
  {
    id: 'ub4',
    title: 'Microeconomic Analysis',
    author: 'Hal Varian',
    subject: 'Economics',
    image: 'https://m.media-amazon.com/images/I/71X8k8-p8dL.jpg',
    expectedDate: 'Feb 2026'
  }
];

export const CENSORED_WORDS = ['hate', 'spam', 'violent', 'abuse'];
