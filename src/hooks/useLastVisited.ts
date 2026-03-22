import { useState, useEffect } from 'react';

export interface LastVisited {
  courseSlug: string;
  lessonSlug: string;
  courseTitle: string;
  lessonTitle: string;
  itemType: 'lesson' | 'exercise';
  timestamp: number;
}

const KEY = 'lastVisited';

export function useLastVisited() {
  const [lastVisited, setLastVisitedState] = useState<LastVisited | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setLastVisitedState(JSON.parse(stored));
    } catch {}
  }, []);

  return lastVisited;
}

export function recordLastVisited(data: Omit<LastVisited, 'timestamp'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch {}
}
