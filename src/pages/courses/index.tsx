import { useState } from 'react';
import Layout from '@/components/Layout';
import CourseCard from '@/components/CourseCard';
import { getAllCourses } from '@/lib/courses';
import { CourseMetadata } from '@/types';
import siteConfig from '@/config/site';

interface Props {
  courses: CourseMetadata[];
  categories: string[];
  levels: string[];
}

export default function CoursesPage({ courses, categories, levels }: Props) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [level, setLevel] = useState('All');

  const filtered = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === 'All' || c.category === cat;
    const matchLevel = level === 'All' || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  const { courses: coursesConfig } = siteConfig;

  return (
    <Layout title={`${coursesConfig.heading} | ${siteConfig.name}`} description={coursesConfig.subheading}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{coursesConfig.heading}</h1>
          <p className="text-brand-muted dark:text-gray-500 text-sm">
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
          {categories.length > 1 && (
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors shadow-sm"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
          {levels.length > 1 && (
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-lg px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors shadow-sm"
            >
              <option value="All">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-400 dark:text-gray-500 text-base mb-1">No courses found</p>
            <p className="text-gray-300 dark:text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => (
              <div key={c.slug} className="animate-fade-in-up h-full" style={{ animationDelay: `${i * 60}ms` }}>
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const courses = getAllCourses();
  const categories = [...new Set(courses.map((c) => c.category))];
  const levels = [...new Set(courses.map((c) => c.level))];
  return { props: { courses, categories, levels } };
}
