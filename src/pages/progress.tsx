import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getAllCourses } from '@/lib/courses';
import { CourseMetadata } from '@/types';

interface Props {
  courses: CourseMetadata[];
}

interface CourseStats {
  completedSlugs: Set<string>;
  exerciseTimes: Record<string, number>;
  hasNotes: boolean;
  hasCertificate: boolean;
}

function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-5">
      <p className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-0.5">{value}</p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

const levelColors: Record<string, string> = {
  Beginner: 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20',
  Intermediate: 'text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-900/20',
  Advanced: 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/20',
};

export default function ProgressPage({ courses }: Props) {
  const [stats, setStats] = useState<Record<string, CourseStats>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const result: Record<string, CourseStats> = {};
    for (const course of courses) {
      try {
        const progressRaw = localStorage.getItem(`progress:${course.slug}`);
        const completedSlugs = new Set<string>(progressRaw ? JSON.parse(progressRaw) : []);

        const exerciseTimes: Record<string, number> = {};
        for (const ex of course.exercises) {
          const raw = localStorage.getItem(`timer:${course.slug}:${ex.slug}`);
          if (raw) exerciseTimes[ex.slug] = parseInt(raw, 10);
        }

        const notesRaw = localStorage.getItem(`notes:${course.slug}`);
        const hasNotes = !!(notesRaw && notesRaw.trim().length > 0);

        const certRaw = localStorage.getItem(`certificate:${course.slug}`);
        const hasCertificate = !!certRaw;

        result[course.slug] = { completedSlugs, exerciseTimes, hasNotes, hasCertificate };
      } catch {
        result[course.slug] = { completedSlugs: new Set(), exerciseTimes: {}, hasNotes: false, hasCertificate: false };
      }
    }
    setStats(result);
    setLoaded(true);
  }, [courses]);

  const startedCourses = loaded
    ? courses.filter((c) => stats[c.slug] && stats[c.slug].completedSlugs.size > 0)
    : [];

  const completedCourses = startedCourses.filter((c) => {
    const s = stats[c.slug];
    const totalItems = c.lessons.length + c.exercises.length;
    return s && s.completedSlugs.size === totalItems && totalItems > 0;
  });

  const totalExerciseTime = Object.values(stats).reduce((sum, s) => {
    return sum + Object.values(s.exerciseTimes).reduce((a, b) => a + b, 0);
  }, 0);

  const totalCertificates = startedCourses.filter((c) => stats[c.slug]?.hasCertificate).length;

  const totalItemsCompleted = Object.values(stats).reduce(
    (sum, s) => sum + s.completedSlugs.size,
    0,
  );

  return (
    <Layout title="My Progress" description="Your learning progress across all courses.">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="mb-10">
          <nav className="text-sm text-gray-400 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">My Progress</span>
          </nav>
          <h1 className="text-4xl font-black text-gray-900 dark:text-gray-100 mb-2">My Progress</h1>
          <p className="text-gray-500 dark:text-gray-400">Your learning activity across all courses. Stored locally in your browser.</p>
        </div>

        {/* Summary stats */}
        {loaded && startedCourses.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <StatCard label="Courses started" value={startedCourses.length} />
            <StatCard label="Courses completed" value={completedCourses.length} />
            <StatCard label="Lessons & exercises done" value={totalItemsCompleted} />
            <StatCard
              label="Total exercise time"
              value={totalExerciseTime > 0 ? formatTime(totalExerciseTime) : '—'}
            />
          </div>
        )}

        {/* Course list */}
        {!loaded ? (
          <div className="flex items-center justify-center py-24 text-gray-400 dark:text-gray-600">
            <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </div>
        ) : startedCourses.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-brand-gray-light dark:border-dm-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-dm-raised flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No progress yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Start a course to track your learning here.</p>
            <Link href="/courses" className="btn-primary">
              Browse courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {startedCourses.map((course) => {
              const s = stats[course.slug];
              const totalItems = course.lessons.length + course.exercises.length;
              const count = s.completedSlugs.size;
              const percent = totalItems > 0 ? Math.round((count / totalItems) * 100) : 0;
              const finished = count === totalItems && totalItems > 0;

              const lessonsCompleted = course.lessons.filter((l) => s.completedSlugs.has(l.slug)).length;
              const exercisesCompleted = course.exercises.filter((e) => s.completedSlugs.has(e.slug)).length;
              const totalExTime = Object.values(s.exerciseTimes).reduce((a, b) => a + b, 0);

              const allItems = [...course.lessons, ...course.exercises].sort((a, b) => a.order - b.order);
              const resumeItem = allItems.find((item) => !s.completedSlugs.has(item.slug));
              const resumeUrl = resumeItem
                ? resumeItem.type === 'exercise'
                  ? `/courses/${course.slug}/exercises/${resumeItem.slug}`
                  : `/courses/${course.slug}/${resumeItem.slug}`
                : `/courses/${course.slug}`;

              return (
                <div
                  key={course.slug}
                  className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-6 hover:border-brand-cyan/40 dark:hover:border-blue-500/40 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelColors[course.level]}`}>
                          {course.level}
                        </span>
                        <span className="tag">{course.category}</span>
                        {finished && (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed
                          </span>
                        )}
                        {s.hasCertificate && (
                          <span className="text-xs font-semibold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Certificate earned
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{course.title}</h2>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 line-clamp-1">{course.description}</p>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{count} of {totalItems} items complete</span>
                          <span className="text-xs font-bold text-brand-orange">{percent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-dm-raised rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${finished ? 'bg-emerald-500' : 'bg-brand-orange'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Detail row */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {lessonsCompleted}/{course.lessons.length} lessons
                        </span>
                        {course.exercises.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {exercisesCompleted}/{course.exercises.length} exercises
                          </span>
                        )}
                        {totalExTime > 0 && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatTime(totalExTime)} on exercises
                          </span>
                        )}
                        {s.hasNotes && (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Notes saved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0 flex flex-col gap-2 sm:items-end">
                      <Link
                        href={resumeUrl}
                        className="btn-primary whitespace-nowrap"
                      >
                        {finished ? 'Review Course' : 'Continue'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-xs text-center text-gray-400 dark:text-gray-500 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors"
                      >
                        Course overview
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Certificates section */}
        {loaded && totalCertificates > 0 && (
          <div className="mt-12 pt-8 border-t border-brand-gray-light dark:border-dm-border">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Certificates Earned
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {startedCourses
                .filter((c) => stats[c.slug]?.hasCertificate)
                .map((course) => (
                  <Link
                    key={course.slug}
                    href={`/courses/${course.slug}`}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-dm-surface border border-brand-orange/20 dark:border-brand-orange/20 rounded-xl hover:border-brand-orange/40 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 transition-colors">
                      <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{course.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Certificate of Completion</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const courses = getAllCourses();
  return { props: { courses } };
}
