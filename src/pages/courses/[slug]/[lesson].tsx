import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import LessonSidebar from '@/components/LessonSidebar';
import LessonQuiz from '@/components/LessonQuiz';
import { getAllCourses, getCourseMetadata, getLesson } from '@/lib/courses';
import { useProgress } from '@/hooks/useProgress';
import { useNotes } from '@/hooks/useNotes';
import { recordLastVisited } from '@/hooks/useLastVisited';
import { Lesson, CourseMetadata } from '@/types';

interface Props {
  lesson: Lesson;
  course: CourseMetadata;
}

export default function LessonPage({ lesson, course }: Props) {
  const totalItems = course.lessons.length + course.exercises.length;
  const { completed, toggle, isComplete, percent } = useProgress(course.slug, totalItems);
  const { notes, setNotes, exportNotes, hasNotes } = useNotes(course.slug, lesson.courseTitle);
  const done = isComplete(lesson.slug);
  const contentRef = useRef<HTMLDivElement>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesPopupRef = useRef<HTMLDivElement>(null);
  const [justCompleted, setJustCompleted] = useState(false);

  const handleToggle = () => {
    if (!done) setJustCompleted(true);
    toggle(lesson.slug);
  };

  useEffect(() => {
    if (!justCompleted) return;
    const t = setTimeout(() => setJustCompleted(false), 400);
    return () => clearTimeout(t);
  }, [justCompleted]);

  useEffect(() => {
    recordLastVisited({
      courseSlug: course.slug,
      lessonSlug: lesson.slug,
      courseTitle: lesson.courseTitle,
      lessonTitle: lesson.title,
      itemType: 'lesson',
    });
  }, [course.slug, lesson.slug, lesson.courseTitle, lesson.title]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    container.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent || '';
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
      pre.appendChild(btn);
    });
  }, [lesson.content]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    container.querySelectorAll<HTMLElement>('[data-tabs]').forEach((widget) => {
      const buttons = widget.querySelectorAll<HTMLButtonElement>('.tab-btn');
      const panels = widget.querySelectorAll<HTMLElement>('.tab-panel');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.tab;
          buttons.forEach((b) => b.classList.toggle('active', b.dataset.tab === idx));
          panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === idx));
        });
      });
    });
  }, [lesson.content]);

  useEffect(() => {
    if (!notesOpen) return;
    const handler = (e: MouseEvent) => {
      if (notesPopupRef.current && !notesPopupRef.current.contains(e.target as Node)) {
        setNotesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notesOpen]);

  return (
    <Layout title={`${lesson.title} - ${lesson.courseTitle}`} description={`Lesson ${lesson.order}: ${lesson.title}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
        <div className="flex gap-10">
          <LessonSidebar
            course={course}
            currentSlug={lesson.slug}
            currentType="lesson"
            completed={completed}
            percent={percent}
          />

          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-brand-gray-light dark:border-dm-border">
              <nav className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-4 no-print">
                <Link href="/" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Courses</Link>
                <span>/</span>
                <Link href={`/courses/${lesson.courseSlug}`} className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">{lesson.courseTitle}</Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-400">{lesson.title}</span>
              </nav>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-brand-muted dark:text-gray-500 font-medium">Lesson {lesson.order}</span>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="text-xs text-brand-muted dark:text-gray-500">{lesson.readingTime}</span>
                    {lesson.duration && (
                      <>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-xs text-brand-muted dark:text-gray-500">{lesson.duration}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100">{lesson.title}</h1>
                </div>
                <button
                  onClick={() => window.print()}
                  className="no-print shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 dark:text-gray-500 border border-brand-gray-light dark:border-dm-border hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 transition-all mt-1"
                  title="Print or save as PDF"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print / PDF
                </button>
              </div>
            </div>

            {/* Content + TOC */}
            <div className="flex gap-10">
              <div className="flex-1 min-w-0">
                <div ref={contentRef} className="prose-custom" dangerouslySetInnerHTML={{ __html: lesson.content }} />

                {lesson.resources && lesson.resources.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-brand-gray-light dark:border-dm-border no-print">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Downloads
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {lesson.resources.map((r) => (
                        <li key={r.file}>
                          <a
                            href={`/resources/${lesson.courseSlug}/${r.file}`}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-dm-surface hover:border-brand-cyan dark:hover:border-blue-500 hover:text-brand-cyan dark:hover:text-blue-400 transition-all"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {r.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lesson.quiz && lesson.quiz.length > 0 && (
                  <div id="knowledge-check">
                    <LessonQuiz key={lesson.slug} questions={lesson.quiz} storageKey={`${lesson.courseSlug}-${lesson.slug}`} />
                  </div>
                )}

                {/* Mark complete */}
                <div className="mt-12 pt-8 border-t border-brand-gray-light dark:border-dm-border flex items-center gap-3 no-print">
                  <button
                    onClick={handleToggle}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      done
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                        : 'bg-white dark:bg-dm-surface text-gray-600 dark:text-gray-300 border-brand-gray-light dark:border-dm-border hover:border-brand-orange hover:text-brand-orange'
                    } ${justCompleted ? 'animate-pop-in' : ''}`}
                  >
                    {done ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark as complete
                      </>
                    )}
                  </button>
                  {done && <span className="text-xs text-gray-400 dark:text-gray-500">Click to undo</span>}
                </div>

                {/* Navigation */}
                <div className="mt-8 grid grid-cols-2 gap-4 no-print">
                  {lesson.prev ? (
                    <Link
                      href={lesson.prev.type === 'exercise' ? `/courses/${lesson.courseSlug}/exercises/${lesson.prev.slug}` : `/courses/${lesson.courseSlug}/${lesson.prev.slug}`}
                      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-4 hover:border-brand-cyan/50 dark:hover:border-blue-500/50 hover:shadow-sm transition-all"
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Previous {lesson.prev.type === 'exercise' ? 'Exercise' : 'Lesson'}
                      </p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{lesson.prev.title}</p>
                    </Link>
                  ) : <div />}

                  {lesson.next ? (
                    <Link
                      href={lesson.next.type === 'exercise' ? `/courses/${lesson.courseSlug}/exercises/${lesson.next.slug}` : `/courses/${lesson.courseSlug}/${lesson.next.slug}`}
                      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-4 hover:border-brand-cyan/50 dark:hover:border-blue-500/50 hover:shadow-sm transition-all text-right"
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1 justify-end">
                        Next {lesson.next.type === 'exercise' ? 'Exercise' : 'Lesson'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{lesson.next.title}</p>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${lesson.courseSlug}`}
                      className="group bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-4 hover:border-brand-orange/40 hover:shadow-sm transition-all text-right"
                    >
                      <p className="text-xs text-brand-orange mb-1 font-medium">Course Complete!</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">Back to Course Overview →</p>
                    </Link>
                  )}
                </div>
              </div>

              {/* Table of contents */}
              {(lesson.toc.length > 0 || (lesson.quiz && lesson.quiz.length > 0)) && (
                <aside className="w-52 shrink-0 hidden xl:block no-print">
                  <div className="sticky top-24">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">On this page</p>
                    <nav className="space-y-1">
                      {lesson.toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-xs text-gray-500 dark:text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors leading-snug py-0.5 ${
                            item.level === 3 ? 'pl-3 border-l border-brand-gray-light dark:border-dm-border' : ''
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                      {lesson.quiz && lesson.quiz.length > 0 && (
                        <a
                          href="#knowledge-check"
                          className="block text-xs text-gray-500 dark:text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors leading-snug py-0.5"
                        >
                          Knowledge Check
                        </a>
                      )}
                    </nav>
                  </div>
                </aside>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Floating notes button + popup */}
      <div ref={notesPopupRef} className="no-print">
        {notesOpen && (
          <div className="fixed bottom-20 right-6 z-50 w-80 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-gray-light dark:border-dm-border bg-gray-50 dark:bg-dm-raised">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">My Notes</span>
              </div>
              <button
                onClick={() => setNotesOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down anything useful... notes save automatically."
                rows={8}
                autoFocus
                className="w-full bg-gray-50 dark:bg-dm-raised border border-brand-gray-light dark:border-dm-border rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 focus:bg-white dark:focus:bg-dm-surface transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between px-3 pb-3">
              <span className="text-xs text-gray-400 dark:text-gray-500">Saved to your browser</span>
              <button
                onClick={() => exportNotes()}
                disabled={!hasNotes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-brand-cyan dark:border-blue-500 text-brand-cyan dark:text-blue-400 hover:bg-brand-cyan dark:hover:bg-blue-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export .md
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setNotesOpen((o) => !o)}
          title="My Notes"
          className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
            notesOpen
              ? 'bg-gray-700 dark:bg-dm-raised text-white shadow-xl scale-95'
              : 'bg-brand-orange hover:bg-brand-orange-light text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {notesOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
          {hasNotes && !notesOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-dm-bg rounded-full" />
          )}
        </button>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const courses = getAllCourses();
  const paths: { params: { slug: string; lesson: string } }[] = [];
  for (const course of courses) {
    const meta = getCourseMetadata(course.slug);
    if (meta) {
      for (const lesson of meta.lessons) {
        paths.push({ params: { slug: course.slug, lesson: lesson.slug } });
      }
    }
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string; lesson: string } }) {
  const lesson = await getLesson(params.slug, params.lesson);
  const course = getCourseMetadata(params.slug);
  if (!lesson || !course) return { notFound: true };
  return { props: { lesson, course } };
}
