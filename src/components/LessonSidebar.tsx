import Link from 'next/link';
import { CourseMetadata, CourseItemMeta } from '@/types';

interface Props {
  course: CourseMetadata;
  currentSlug: string;
  currentType: 'lesson' | 'exercise';
  completed: Set<string>;
  percent: number;
}

function itemUrl(courseSlug: string, item: CourseItemMeta): string {
  return item.type === 'exercise'
    ? `/courses/${courseSlug}/exercises/${item.slug}`
    : `/courses/${courseSlug}/${item.slug}`;
}

export default function LessonSidebar({ course, currentSlug, currentType, completed, percent }: Props) {
  const allItems = [...course.lessons, ...course.exercises].sort((a, b) => a.order - b.order);
  const totalItems = allItems.length;

  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] flex flex-col">
        <div className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl overflow-hidden shadow-sm flex flex-col min-h-0">
          <div className="p-4 border-b border-brand-gray-light dark:border-dm-border bg-gray-50 dark:bg-dm-raised shrink-0">
            <Link href={`/courses/${course.slug}`} className="text-xs text-brand-cyan dark:text-blue-400 hover:underline flex items-center gap-1 mb-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to course
            </Link>
            <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm leading-snug">{course.title}</h3>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{completed.size}/{totalItems} complete</span>
                <span className="text-xs font-semibold text-brand-orange">{percent}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-dm-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-orange rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="p-2 overflow-y-auto">
            {allItems.map((item, i) => {
              const isActive = item.slug === currentSlug && item.type === currentType;
              const isDone = completed.has(item.slug);
              const isExercise = item.type === 'exercise';

              return (
                <Link
                  key={`${item.type}:${item.slug}`}
                  href={itemUrl(course.slug, item)}
                  className={`flex items-start gap-3 p-3 rounded-lg mb-1 transition-all group ${
                    isActive
                      ? isExercise
                        ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50'
                        : 'bg-brand-orange/8 border border-brand-orange/25'
                      : 'hover:bg-gray-50 dark:hover:bg-dm-raised'
                  }`}
                >
                  <span className={`shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold mt-0.5 transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? isExercise
                          ? 'bg-violet-500 text-white'
                          : 'bg-brand-orange text-white'
                        : isExercise
                          ? 'bg-gray-100 dark:bg-dm-raised text-gray-500 dark:text-gray-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                          : 'bg-gray-100 dark:bg-dm-raised text-gray-500 dark:text-gray-400 group-hover:bg-brand-orange/15 group-hover:text-brand-orange'
                  }`}>
                    {isDone ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isExercise ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <div className="min-w-0">
                    {isExercise && (
                      <p className={`text-xs font-semibold mb-0.5 ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-violet-500 dark:group-hover:text-violet-400'}`}>
                        Exercise
                      </p>
                    )}
                    <p className={`text-sm font-medium leading-snug ${
                      isDone
                        ? 'text-gray-400 dark:text-gray-600 line-through'
                        : isActive
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                    }`}>
                      {item.title}
                    </p>
                    {item.duration && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.duration}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
