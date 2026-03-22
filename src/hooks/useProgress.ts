import { useState, useEffect, useCallback } from 'react';

export function useProgress(courseSlug: string, totalLessons: number) {
  const key = `progress:${courseSlug}`;
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setCompleted(new Set(JSON.parse(stored)));
    } catch {
      // localStorage unavailable
    }
  }, [key]);

  const toggle = useCallback((lessonSlug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(lessonSlug)) next.delete(lessonSlug);
      else next.add(lessonSlug);
      try { localStorage.setItem(key, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, [key]);

  const reset = useCallback(() => {
    setCompleted(new Set());
    try { localStorage.removeItem(key); } catch {}
  }, [key]);

  return {
    completed,
    toggle,
    reset,
    isComplete: (slug: string) => completed.has(slug),
    count: completed.size,
    percent: totalLessons > 0 ? Math.round((completed.size / totalLessons) * 100) : 0,
  };
}
