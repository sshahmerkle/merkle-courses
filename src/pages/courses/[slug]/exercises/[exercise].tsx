import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LessonSidebar from '@/components/LessonSidebar';
import { getAllCourses, getCourseMetadata, getExercise } from '@/lib/courses';
import { useProgress } from '@/hooks/useProgress';
import { useNotes } from '@/hooks/useNotes';
import { recordLastVisited } from '@/hooks/useLastVisited';
import { Exercise, CourseMetadata } from '@/types';

interface Props {
  exercise: Exercise;
  course: CourseMetadata;
}

// ── Difficulty badge ─────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   classes: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/60' },
  medium: { label: 'Medium', classes: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/60' },
  hard:   { label: 'Hard',   classes: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/60' },
};

function DifficultyBadge({ level }: { level: 'easy' | 'medium' | 'hard' }) {
  const { label, classes } = DIFFICULTY_CONFIG[level];
  const dots = level === 'easy' ? 1 : level === 'medium' ? 2 : 3;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${classes}`}>
      <span className="flex gap-0.5">
        {[1, 2, 3].map((d) => (
          <span key={d} className={`w-1.5 h-1.5 rounded-full ${d <= dots ? 'bg-current' : 'bg-current opacity-25'}`} />
        ))}
      </span>
      {label}
    </span>
  );
}

// ── Timer ────────────────────────────────────────────────────────────────────

function useTimer(stopped: boolean, storageKey: string) {
  // Always restore from localStorage on mount (handles both in-progress and completed)
  const [seconds, setSeconds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });

  // Run interval while not stopped; persist every tick so a refresh restores the time
  useEffect(() => {
    if (stopped) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        try { localStorage.setItem(storageKey, String(next)); } catch {}
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stopped, storageKey]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// ── Objectives checklist ─────────────────────────────────────────────────────

function ObjectivesPanel({ objectives, storageKey, onAllComplete }: { objectives: string[]; storageKey: string; onAllComplete?: (allDone: boolean) => void }) {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`objectives:${storageKey}`);
      if (stored) {
        const parsed: boolean[] = JSON.parse(stored);
        setChecked(parsed.length === objectives.length ? parsed : new Array(objectives.length).fill(false));
      } else {
        setChecked(new Array(objectives.length).fill(false));
      }
    } catch {
      setChecked(new Array(objectives.length).fill(false));
    }
  }, [storageKey, objectives.length]);

  const toggle = useCallback((i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      try { localStorage.setItem(`objectives:${storageKey}`, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [storageKey]);

  const doneCount = checked.filter(Boolean).length;
  const allDone = doneCount === objectives.length && objectives.length > 0;

  useEffect(() => {
    onAllComplete?.(allDone);
  }, [allDone, onAllComplete]);

  return (
    <div className={`mb-8 rounded-xl border p-5 transition-colors ${allDone ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' : 'bg-violet-50/60 dark:bg-violet-900/10 border-violet-200 dark:border-violet-800/40'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-bold flex items-center gap-2 ${allDone ? 'text-emerald-700 dark:text-emerald-400' : 'text-violet-700 dark:text-violet-300'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Objectives
        </h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${allDone ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30' : 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30'}`}>
          {doneCount}/{objectives.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200 dark:bg-dm-border rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${allDone ? 'bg-emerald-500' : 'bg-violet-500'}`}
          style={{ width: `${(doneCount / objectives.length) * 100}%` }}
        />
      </div>

      <ul className="space-y-2">
        {objectives.map((obj, i) => (
          <li key={i}>
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <span
                onClick={() => toggle(i)}
                className={`shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  checked[i]
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-violet-400 dark:group-hover:border-violet-500'
                }`}
              >
                {checked[i] && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span
                onClick={() => toggle(i)}
                className={`text-sm leading-snug transition-colors ${checked[i] ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-700 dark:text-gray-200'}`}
              >
                {obj}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {allDone && (
        <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          All objectives completed — ready to mark the exercise as done!
        </p>
      )}
    </div>
  );
}

// ── Hints ────────────────────────────────────────────────────────────────────

function HintsPanel({ hints }: { hints: string[] }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="mt-10 pt-8 border-t border-brand-gray-light dark:border-dm-border">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Hints</h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">({hints.length} available)</span>
      </div>

      {revealed === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm text-amber-700 dark:text-amber-400">Stuck? Reveal a hint to nudge you in the right direction.</p>
          <button
            onClick={() => setRevealed(1)}
            className="shrink-0 ml-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          >
            Show hint 1
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {hints.slice(0, revealed).map((hint, i) => (
            <div key={i} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 animate-slide-up">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 mb-1">Hint {i + 1}</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{hint}</p>
            </div>
          ))}

          {revealed < hints.length && (
            <button
              onClick={() => setRevealed((r) => r + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Show hint {revealed + 1} of {hints.length}
            </button>
          )}

          {revealed === hints.length && (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">All hints revealed.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ExercisePage({ exercise, course }: Props) {
  const { basePath } = useRouter ();
  const totalItems = course.lessons.length + course.exercises.length;
  const { completed, toggle, isComplete, percent } = useProgress(course.slug, totalItems);
  const { notes, setNotes, exportNotes, hasNotes } = useNotes(course.slug, exercise.courseTitle);
  const done = isComplete(exercise.slug);
  const contentRef = useRef<HTMLDivElement>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const notesPopupRef = useRef<HTMLDivElement>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [objectivesAllDone, setObjectivesAllDone] = useState(false);
  const timerKey = `timer:${exercise.courseSlug}:${exercise.slug}`;
  const timerStopped = done || objectivesAllDone;
  const elapsed = useTimer(timerStopped, timerKey);

  const handleToggle = () => {
    if (!done) setJustCompleted(true);
    toggle(exercise.slug);
  };

  useEffect(() => {
    if (!justCompleted) return;
    const t = setTimeout(() => setJustCompleted(false), 400);
    return () => clearTimeout(t);
  }, [justCompleted]);

  useEffect(() => {
    recordLastVisited({
      courseSlug: course.slug,
      lessonSlug: exercise.slug,
      courseTitle: exercise.courseTitle,
      lessonTitle: exercise.title,
      itemType: 'exercise',
    });
  }, [course.slug, exercise.slug, exercise.courseTitle, exercise.title]);

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
  }, [exercise.content]);

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
  }, [exercise.content]);

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
    <Layout title={`${exercise.title} - ${exercise.courseTitle}`} description={`Exercise: ${exercise.title}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-6 py-8">
        <div className="flex gap-10">
          <LessonSidebar
            course={course}
            currentSlug={exercise.slug}
            currentType="exercise"
            completed={completed}
            percent={percent}
          />

          <article className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-8 pb-8 border-b border-brand-gray-light dark:border-dm-border">
              <nav className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 mb-4 no-print">
                <Link href="/" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Courses</Link>
                <span>/</span>
                <Link href={`/courses/${exercise.courseSlug}`} className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">{exercise.courseTitle}</Link>
                <span>/</span>
                <span className="text-gray-600 dark:text-gray-400">{exercise.title}</span>
              </nav>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {/* Exercise badge */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50 px-2.5 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Exercise
                    </span>

                    {/* Difficulty */}
                    {exercise.difficulty && <DifficultyBadge level={exercise.difficulty} />}

                    <span className="text-gray-300 dark:text-gray-700">•</span>

                    {/* Timer */}
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 font-mono">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {elapsed}
                    </span>

                    {exercise.duration && (
                      <>
                        <span className="text-gray-300 dark:text-gray-700">•</span>
                        <span className="text-xs text-brand-muted dark:text-gray-500">{exercise.duration}</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100">{exercise.title}</h1>
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

                {/* Objectives */}
                {exercise.objectives && exercise.objectives.length > 0 && (
                  <ObjectivesPanel
                    objectives={exercise.objectives}
                    storageKey={`${exercise.courseSlug}:${exercise.slug}`}
                    onAllComplete={setObjectivesAllDone}
                  />
                )}

                {/* Markdown content */}
                <div ref={contentRef} className="prose-custom" dangerouslySetInnerHTML={{ __html: exercise.content }} />

                {/* Hints */}
                {exercise.hints && exercise.hints.length > 0 && (
                  <HintsPanel hints={exercise.hints} />
                )}

                {/* Resources */}
                {exercise.resources && exercise.resources.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-brand-gray-light dark:border-dm-border no-print">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Downloads
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {exercise.resources.map((r) => (
                        <li key={r.file}>
                          <a
                            href={`${basePath}/resources/${exercise.courseSlug}/${r.file}`}
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

                {/* Mark complete */}
                <div className="mt-12 pt-8 border-t border-brand-gray-light dark:border-dm-border flex items-center gap-3 no-print">
                  <button
                    onClick={handleToggle}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      done
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                        : objectivesAllDone
                          ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600 shadow-lg shadow-violet-400/50 dark:shadow-violet-700/60'
                          : 'bg-white dark:bg-dm-surface text-gray-600 dark:text-gray-300 border-brand-gray-light dark:border-dm-border hover:border-violet-400 hover:text-violet-600 dark:hover:border-violet-500 dark:hover:text-violet-400'
                    } ${justCompleted ? 'animate-pop-in' : ''}`}
                  >
                    {done ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Exercise Complete
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
                  {exercise.prev ? (
                    <Link
                      href={exercise.prev.type === 'exercise' ? `/courses/${exercise.courseSlug}/exercises/${exercise.prev.slug}` : `/courses/${exercise.courseSlug}/${exercise.prev.slug}`}
                      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-4 hover:border-brand-cyan/50 dark:hover:border-blue-500/50 hover:shadow-sm transition-all"
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        Previous {exercise.prev.type === 'exercise' ? 'Exercise' : 'Lesson'}
                      </p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{exercise.prev.title}</p>
                    </Link>
                  ) : <div />}

                  {exercise.next ? (
                    <Link
                      href={exercise.next.type === 'exercise' ? `/courses/${exercise.courseSlug}/exercises/${exercise.next.slug}` : `/courses/${exercise.courseSlug}/${exercise.next.slug}`}
                      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-4 hover:border-brand-cyan/50 dark:hover:border-blue-500/50 hover:shadow-sm transition-all text-right"
                    >
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1 justify-end">
                        Next {exercise.next.type === 'exercise' ? 'Exercise' : 'Lesson'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">{exercise.next.title}</p>
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${exercise.courseSlug}`}
                      className="group bg-violet-500/5 border border-violet-200 dark:border-violet-900/50 rounded-xl p-4 hover:border-violet-400 dark:hover:border-violet-700 hover:shadow-sm transition-all text-right"
                    >
                      <p className="text-xs text-violet-600 dark:text-violet-400 mb-1 font-medium">Course Complete!</p>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">Back to Course Overview →</p>
                    </Link>
                  )}
                </div>
              </div>

              {/* Table of contents */}
              {exercise.toc.length > 0 && (
                <aside className="w-52 shrink-0 hidden xl:block no-print">
                  <div className="sticky top-24">
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">On this page</p>
                    <nav className="space-y-1">
                      {exercise.toc.map((item) => (
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
  const paths: { params: { slug: string; exercise: string } }[] = [];
  for (const course of courses) {
    const meta = getCourseMetadata(course.slug);
    if (meta) {
      for (const exercise of meta.exercises) {
        paths.push({ params: { slug: course.slug, exercise: exercise.slug } });
      }
    }
  }
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string; exercise: string } }) {
  const exercise = await getExercise(params.slug, params.exercise);
  const course = getCourseMetadata(params.slug);
  if (!exercise || !course) return { notFound: true };
  return { props: { exercise, course } };
}
