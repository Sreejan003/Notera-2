
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
    title: 'Concepts of Physics (Vol. 1 & 2)',
    author: 'H.C. Verma',
    subject: 'Physics',
    link: 'https://www.amazon.in/Concepts-Physics-1-2-2019-20-Set-Session/dp/B07QNVY9W6',
    price: '₹945',
    image: 'https://m.media-amazon.com/images/I/81IpxvH-SLL.jpg'
  },
  {
    id: 'b2',
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    subject: 'Engineering',
    link: 'https://www.amazon.in/Higher-Engineering-Mathematics-B-S-Grewal/dp/8193328493',
    price: '₹850',
    image: 'https://m.media-amazon.com/images/I/81-pS9P6V+L.jpg'
  },
  {
    id: 'b3',
    title: 'Indian Art and Culture',
    author: 'Nitin Singhania',
    subject: 'History/UPSC',
    link: 'https://www.amazon.in/Indian-Art-Culture-Nitin-Singhania/dp/9354601804',
    price: '₹575',
    image: 'https://m.media-amazon.com/images/I/71X8k8-p8dL.jpg'
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

export const CENSORED_WORDS = ['hate', 'spam', 'violent', 'abuse'];
