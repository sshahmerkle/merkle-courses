import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import CertificateModal from '@/components/CertificateModal';
import { getAllCourses, getCourse } from '@/lib/courses';
import { useProgress } from '@/hooks/useProgress';
import { useNotes } from '@/hooks/useNotes';
import { Course, CourseItemMeta } from '@/types';

interface Props { course: Course }

export default function CoursePage({ course }: Props) {
  const allItems: CourseItemMeta[] = [...course.lessons, ...course.exercises].sort((a, b) => a.order - b.order);
  const totalItems = allItems.length;
  const { completed, isComplete, count, percent, reset } = useProgress(course.slug, totalItems);
  const started = count > 0;
  const finished = count === totalItems && totalItems > 0;
  const [certOpen, setCertOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { hasNotes, exportNotes } = useNotes(course.slug, course.title);

  const doReset = () => {
    reset();
    course.exercises.forEach((ex) => {
      try {
        localStorage.removeItem(`objectives:${course.slug}:${ex.slug}`);
        localStorage.removeItem(`timer:${course.slug}:${ex.slug}`);
      } catch {}
    });
    setExerciseTimes({});
    setConfirmReset(false);
  };
  const [exerciseTimes, setExerciseTimes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!finished) return;
    const times: Record<string, number> = {};
    course.exercises.forEach((ex) => {
      try {
        const saved = localStorage.getItem(`timer:${course.slug}:${ex.slug}`);
        if (saved) times[ex.slug] = parseInt(saved, 10);
      } catch {}
    });
    setExerciseTimes(times);
  }, [finished, course.slug, course.exercises]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
  };

  const levelColors: Record<string, string> = {
    Beginner: 'text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20',
    Intermediate: 'text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-900/20',
    Advanced: 'text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-900/20',
  };

  const resumeItem = allItems.find((item) => !completed.has(item.slug)) ?? allItems[0];
  const resumeUrl = resumeItem
    ? resumeItem.type === 'exercise'
      ? `/courses/${course.slug}/exercises/${resumeItem.slug}`
      : `/courses/${course.slug}/${resumeItem.slug}`
    : null;

  return (
    <Layout title={course.title} description={course.description}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/courses" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${levelColors[course.level]}`}>{course.level}</span>
              <span className="tag">{course.category}</span>
              {finished && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 mb-4">{course.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">{course.description}</p>

            <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-brand-gray-light dark:border-dm-border">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {course.author}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {course.duration}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {course.lessons.length} lessons{course.exercises.length > 0 && `, ${course.exercises.length} exercises`}
              </div>
            </div>

            {course.content && (
              <div className="prose-custom mb-10" dangerouslySetInnerHTML={{ __html: course.content }} />
            )}

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Course Contents</h2>
            <div className="space-y-2">
              {allItems.map((item, i) => {
                const done = isComplete(item.slug);
                const isExercise = item.type === 'exercise';
                const href = isExercise
                  ? `/courses/${course.slug}/exercises/${item.slug}`
                  : `/courses/${course.slug}/${item.slug}`;
                return (
                  <Link
                    key={`${item.type}:${item.slug}`}
                    href={href}
                    className={`flex items-center gap-4 p-4 bg-white dark:bg-dm-surface border rounded-xl hover:shadow-sm transition-all group ${
                      isExercise
                        ? 'border-violet-200 dark:border-violet-900/50 hover:border-violet-400 dark:hover:border-violet-700'
                        : 'border-brand-gray-light dark:border-dm-border hover:border-brand-cyan/50 dark:hover:border-blue-500/50'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : isExercise
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 group-hover:bg-violet-500 group-hover:text-white'
                          : 'bg-gray-100 dark:bg-dm-raised text-gray-500 dark:text-gray-400 group-hover:bg-brand-orange group-hover:text-white'
                    }`}>
                      {done ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isExercise ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <div className="flex-1">
                      {isExercise && (
                        <p className="text-xs font-semibold text-violet-500 dark:text-violet-400 mb-0.5">Exercise</p>
                      )}
                      <p className={`font-medium transition-colors ${done ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`}>
                        {item.title}
                      </p>
                      {item.duration && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.duration}</p>}
                    </div>
                    <svg className={`w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-all ${isExercise ? 'group-hover:text-violet-500 dark:group-hover:text-violet-400' : 'group-hover:text-brand-cyan dark:group-hover:text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>

            {course.files && course.files.length > 0 && (
              <div className="mt-10 pt-8 border-t border-brand-gray-light dark:border-dm-border">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Course Files</h2>
                <ul className="flex flex-wrap gap-3">
                  {course.files.map((f) => (
                    <li key={f.file}>
                      <a
                        href={`/resources/${course.slug}/${f.file}`}
                        download
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-gray-light dark:border-dm-border bg-white dark:bg-dm-surface text-sm text-gray-600 dark:text-gray-300 hover:border-brand-cyan dark:hover:border-blue-500 hover:text-brand-cyan dark:hover:text-blue-400 transition-all"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {f.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-brand-gray-light dark:border-dm-border bg-gray-50 dark:bg-dm-raised">
                {started ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{finished ? 'Course complete!' : 'Your progress'}</p>
                      <span className="text-sm font-bold text-brand-orange">{percent}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-dm-border rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${finished ? 'bg-emerald-500' : 'bg-brand-orange'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {resumeUrl && (
                      <Link href={resumeUrl} className="btn-primary w-full justify-center">
                        {finished ? 'Review Course' : 'Continue'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </Link>
                    )}
                    {hasNotes && (
                      <button
                        onClick={() => exportNotes()}
                        className="btn-secondary w-full justify-center mt-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Notes
                      </button>
                    )}
                    {finished && (
                      <button
                        onClick={() => setCertOpen(true)}
                        className="btn-secondary w-full justify-center mt-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        Get Certificate
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start with the first item</p>
                    {resumeUrl && (
                      <Link href={resumeUrl} className="btn-primary w-full justify-center">
                        Start Course
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </Link>
                    )}
                  </>
                )}
              </div>
              {finished && course.exercises.length > 0 && Object.keys(exerciseTimes).length > 0 && (
                <div className="p-6 border-b border-brand-gray-light dark:border-dm-border">
                  <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Exercise Times
                  </h4>
                  <ul className="space-y-2">
                    {course.exercises.map((ex) => {
                      const secs = exerciseTimes[ex.slug];
                      if (!secs) return null;
                      return (
                        <li key={ex.slug} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-gray-500 dark:text-gray-400 truncate">{ex.title}</span>
                          <span className="font-mono text-xs font-semibold text-violet-600 dark:text-violet-400 shrink-0">{formatTime(secs)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="p-6 space-y-4">
                <h4 className="text-gray-900 dark:text-gray-100 font-semibold text-sm">This course includes:</h4>
                <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                  <li className="flex items-center gap-2"><span className="text-brand-orange font-bold">✓</span> {course.lessons.length} structured lessons</li>
                  {course.exercises.length > 0 && (
                    <li className="flex items-center gap-2"><span className="text-brand-orange font-bold">✓</span> {course.exercises.length} practical exercises</li>
                  )}
                  <li className="flex items-center gap-2"><span className="text-brand-orange font-bold">✓</span> {course.duration} of content</li>
                  <li className="flex items-center gap-2"><span className="text-brand-orange font-bold">✓</span> {course.level} level</li>
                </ul>
                {started && (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-semibold border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Reset Progress
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {certOpen && (
        <CertificateModal courseSlug={course.slug} courseName={course.title} onClose={() => setCertOpen(false)} />
      )}

      {confirmReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl dark:shadow-black/50 w-full max-w-sm overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Reset progress?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                This will clear all completed lessons, exercises, objectives, and timer data for{' '}
                <strong className="text-gray-700 dark:text-gray-200">{course.title}</strong>. Your notes will not be affected.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={doReset}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Reset Progress
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-4 py-2.5 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const courses = getAllCourses();
  return {
    paths: courses.map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) return { notFound: true };
  return { props: { course } };
}
