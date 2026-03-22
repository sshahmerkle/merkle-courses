export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface LessonResource {
  name: string;
  file: string;
}

export interface CourseMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  author: string;
  lastUpdated: string;
  coverImage?: string | null;
  files: { name: string; file: string }[];
  lessons: LessonMeta[];
  exercises: ExerciseMeta[];
}

export interface CourseItemMeta {
  slug: string;
  title: string;
  order: number;
  duration?: string | null;
  type: 'lesson' | 'exercise';
}

export interface LessonMeta extends CourseItemMeta {
  type: 'lesson';
}

export interface ExerciseMeta extends CourseItemMeta {
  type: 'exercise';
}

export interface Lesson extends LessonMeta {
  content: string;
  courseSlug: string;
  courseTitle: string;
  readingTime: string;
  toc: TocItem[];
  prev?: CourseItemMeta | null;
  next?: CourseItemMeta | null;
  quiz?: QuizQuestion[];
  resources?: LessonResource[];
}

export interface Exercise extends ExerciseMeta {
  content: string;
  courseSlug: string;
  courseTitle: string;
  readingTime: string;
  toc: TocItem[];
  prev?: CourseItemMeta | null;
  next?: CourseItemMeta | null;
  resources?: LessonResource[];
  difficulty?: 'easy' | 'medium' | 'hard' | null;
  objectives?: string[];
  hints?: string[];
}

export interface Course extends CourseMetadata {
  content: string;
}

export type ResourceType = 'link' | 'pdf' | 'video' | 'tool';

export interface Resource {
  name: string;
  description: string;
  url: string;
  type: ResourceType;
  category?: string;
}

export interface KbArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  courseSlug: string | null;
  courseTitle: string | null;
  lastUpdated: string;
}

export interface KbArticle extends KbArticleMeta {
  content: string;
}
