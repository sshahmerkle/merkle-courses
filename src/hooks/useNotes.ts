import { useState, useEffect, useCallback } from 'react';

export function useNotes(courseSlug: string, courseTitle: string) {
  const key = `notes:${courseSlug}`;
  const [notes, setNotesState] = useState('');

  useEffect(() => {
    try {
      setNotesState(localStorage.getItem(key) ?? '');
    } catch {}
  }, [key]);

  const setNotes = useCallback((value: string) => {
    setNotesState(value);
    try { localStorage.setItem(key, value); } catch {}
  }, [key]);

  const exportNotes = useCallback(() => {
    const content = `# ${courseTitle}\n\n## My Notes\n\n${notes}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${courseSlug}-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes, courseSlug, courseTitle]);

  return { notes, setNotes, exportNotes, hasNotes: notes.trim().length > 0 };
}
