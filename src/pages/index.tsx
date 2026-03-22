import Link from 'next/link';
import Layout from '@/components/Layout';
import CourseCard from '@/components/CourseCard';
import { getAllCourses } from '@/lib/courses';
import { useLastVisited } from '@/hooks/useLastVisited';
import siteConfig from '@/config/site';
import { CourseMetadata } from '@/types';

interface Props {
  courses: CourseMetadata[];
}

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Track your progress',
    description: 'Progress is saved automatically to your browser. Pick up right where you left off, anytime.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Learn at your own pace',
    description: 'No schedules or deadlines. Work through lessons whenever suits you best.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Knowledge checks',
    description: 'Built-in quizzes let you test your understanding as you progress through each lesson.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Downloadable resources',
    description: 'Courses include reference files and templates you can download and keep.',
  },
];

export default function HomePage({ courses }: Props) {
  const { hero } = siteConfig;
  const headlineParts = hero.headline.split('\n');
  const lastVisited = useLastVisited();
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <Layout title={siteConfig.name} description={siteConfig.description}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Resume prompt */}
        {lastVisited && (
          <div className="pt-8 animate-fade-in-up">
            <Link
              href={lastVisited.itemType === 'exercise' ? `/courses/${lastVisited.courseSlug}/exercises/${lastVisited.lessonSlug}` : `/courses/${lastVisited.courseSlug}/${lastVisited.lessonSlug}`}
              className="inline-flex items-center gap-3 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl px-4 py-3 shadow-sm hover:border-brand-cyan/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Continue where you left off</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                  {lastVisited.lessonTitle}
                  <span className="font-normal text-gray-400 dark:text-gray-500"> — {lastVisited.courseTitle}</span>
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-brand-cyan dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}

        {/* Hero */}
        <div className="relative py-24 md:py-36 overflow-hidden">
          <div className="hero-dot-grid" aria-hidden="true" />
          <div className="relative max-w-3xl animate-fade-in-up">
            <p className="text-brand-orange font-semibold text-sm uppercase tracking-widest mb-5">
              {hero.eyebrow}
            </p>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-gray-100 leading-[1.05] mb-5">
              {headlineParts.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < headlineParts.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className="w-12 h-1 bg-brand-orange rounded-full mb-7" />
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
              {hero.subheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses" className="btn-primary">
                Get started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/team" className="btn-secondary">
                Support Team
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="py-16">
          <h2
            className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 animate-fade-in-up"
            style={{ animationDelay: '120ms' }}
          >
            Course features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-6 hover:border-brand-cyan/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${140 + i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course preview */}
        <div
          className="border-t border-brand-gray-light dark:border-dm-border py-16 animate-fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Available courses</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                {courses.length} course{courses.length !== 1 ? 's' : ''} · {totalLessons} lessons
              </p>
            </div>
            <Link href="/courses" className="text-sm font-medium text-brand-cyan dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0 mb-0.5">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <div
                key={course.slug}
                className="animate-fade-in-up"
                style={{ animationDelay: `${220 + i * 50}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>

        {/* Browser storage notice */}
        <div
          className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-xl px-4 py-3 mb-12 animate-fade-in-up"
          style={{ animationDelay: '260ms' }}
        >
          <svg className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
            Your progress, quiz answers, and notes are saved locally in your browser only. Nothing is sent to or stored in any database.
            Clearing your browser data will reset them.
          </p>
        </div>

      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const courses = getAllCourses();
  return { props: { courses } };
}
