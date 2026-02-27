export interface Video {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  orderIndex: number;
  completed?: boolean;
}

export interface Section {
  id: string;
  title: string;
  videos: Video[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  totalDuration: string;
  totalLessons: number;
  rating: number;
  students: number;
  sections: Section[];
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete React & TypeScript Masterclass 2026",
    description: "Master React 19, TypeScript, hooks, state management, testing, and build production-ready apps from scratch.",
    instructor: "Sarah Chen",
    thumbnail: "",
    totalDuration: "42h 30m",
    totalLessons: 285,
    rating: 4.8,
    students: 125400,
    sections: [
      {
        id: "s1",
        title: "Getting Started with React",
        videos: [
          { id: "v1", title: "Welcome & Course Overview", duration: "5:30", videoUrl: "", orderIndex: 0 },
          { id: "v2", title: "Setting Up Your Development Environment", duration: "12:15", videoUrl: "", orderIndex: 1 },
          { id: "v3", title: "Understanding JSX & Components", duration: "18:42", videoUrl: "", orderIndex: 2 },
          { id: "v4", title: "Props and State Fundamentals", duration: "22:10", videoUrl: "", orderIndex: 3 },
        ],
      },
      {
        id: "s2",
        title: "Advanced Hooks & Patterns",
        videos: [
          { id: "v5", title: "Deep Dive into useState & useEffect", duration: "25:00", videoUrl: "", orderIndex: 4 },
          { id: "v6", title: "Custom Hooks: Building Reusable Logic", duration: "19:30", videoUrl: "", orderIndex: 5 },
          { id: "v7", title: "useReducer for Complex State", duration: "21:45", videoUrl: "", orderIndex: 6 },
          { id: "v8", title: "Performance with useMemo & useCallback", duration: "16:20", videoUrl: "", orderIndex: 7 },
        ],
      },
      {
        id: "s3",
        title: "TypeScript Integration",
        videos: [
          { id: "v9", title: "TypeScript Basics for React", duration: "28:15", videoUrl: "", orderIndex: 8 },
          { id: "v10", title: "Typing Props, State & Events", duration: "20:00", videoUrl: "", orderIndex: 9 },
          { id: "v11", title: "Generic Components & Utility Types", duration: "24:30", videoUrl: "", orderIndex: 10 },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    description: "Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow for data science and ML.",
    instructor: "Dr. James Wilson",
    thumbnail: "",
    totalDuration: "56h 15m",
    totalLessons: 340,
    rating: 4.9,
    students: 203800,
    sections: [],
  },
  {
    id: "3",
    title: "Full-Stack Web Development Bootcamp",
    description: "HTML, CSS, JavaScript, Node.js, Express, MongoDB — everything you need to become a full-stack developer.",
    instructor: "Maria Rodriguez",
    thumbnail: "",
    totalDuration: "63h 45m",
    totalLessons: 420,
    rating: 4.7,
    students: 178200,
    sections: [],
  },
  {
    id: "4",
    title: "UI/UX Design: From Wireframe to Prototype",
    description: "Master Figma, design principles, user research, and create stunning interfaces that users love.",
    instructor: "Alex Kim",
    thumbnail: "",
    totalDuration: "32h 20m",
    totalLessons: 195,
    rating: 4.8,
    students: 89500,
    sections: [],
  },
];
