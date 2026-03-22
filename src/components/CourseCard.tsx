import Link from 'next/link';
import { CourseMetadata } from '@/types';
import { useProgress } from '@/hooks/useProgress';

const levelColors: Record<string, string> = {
  Beginner: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800',
  Advanced: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800',
};

export default function CourseCard({ course }: { course: CourseMetadata }) {
  const totalItems = course.lessons.length + course.exercises.length;
  const { completed, count, percent } = useProgress(course.slug, totalItems);
  const started = count > 0;
  const finished = count === totalItems && totalItems > 0;

  const lessonCount = course.lessons.filter((l) => completed.has(l.slug)).length;
  const exerciseCount = course.exercises.filter((e) => completed.has(e.slug)).length;
  const lessonPercent = course.lessons.length > 0 ? Math.round((lessonCount / course.lessons.length) * 100) : 0;
  const exercisePercent = course.exercises.length > 0 ? Math.round((exerciseCount / course.exercises.length) * 100) : 0;

  const countLabel = [
    `${course.lessons.length} lesson${course.lessons.length !== 1 ? 's' : ''}`,
    course.exercises.length > 0 ? `${course.exercises.length} exercise${course.exercises.length !== 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ');

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="card group cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${levelColors[course.level] || levelColors.Beginner}`}>
            {course.level}
          </span>
          {finished ? (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Complete
            </span>
          ) : (
            <span className="text-xs text-brand-muted dark:text-gray-500">{countLabel}</span>
          )}
        </div>

        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-brand-cyan dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1 mb-4">
          {course.description}
        </p>

        {started && (
          <div className="mb-4 space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{lessonCount}/{course.lessons.length} lessons</span>
                <span className="text-xs font-semibold text-brand-orange">{lessonPercent}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-dm-raised rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${lessonCount === course.lessons.length ? 'bg-emerald-500' : 'bg-brand-orange'}`}
                  style={{ width: `${lessonPercent}%` }}
                />
              </div>
            </div>
            {course.exercises.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{exerciseCount}/{course.exercises.length} exercises</span>
                  <span className="text-xs font-semibold text-violet-500 dark:text-violet-400">{exercisePercent}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-dm-raised rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${exerciseCount === course.exercises.length ? 'bg-emerald-500' : 'bg-violet-500'}`}
                    style={{ width: `${exercisePercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-brand-gray-light dark:border-dm-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-orange/15 flex items-center justify-center text-brand-orange text-xs font-bold">
              {course.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{course.author}</span>
          </div>
          <div className="flex items-center gap-1 text-brand-cyan dark:text-blue-400 text-xs font-medium">
            {started && !finished ? 'Continue' : finished ? 'Review' : course.duration}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
