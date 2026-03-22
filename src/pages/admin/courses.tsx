import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

/* ------------------------------------------------------------------ Types */

interface CourseSummary {
  slug: string;
  title: string;
  category: string;
  level: string;
  lessonCount: number;
  exerciseCount: number;
}

interface CourseDetail {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  author: string;
  content: string;
  lessons: ContentItem[];
  exercises: ContentItem[];
}

interface ContentItem {
  slug: string;
  title: string;
  order: number;
  duration: string;
  difficulty?: string;
}

interface ItemEditorState {
  type: 'lesson' | 'exercise';
  isNew: boolean;
  slug: string;
  title: string;
  order: string;
  duration: string;
  difficulty: string;
  objectives: string;
  hints: string;
  content: string;
}

/* ---------------------------------------------------------------- Helpers */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* --------------------------------------------------------------- Modals */

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onCancel}>
      <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-all">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all">Delete</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- New Course Modal */

function NewCourseModal({ onClose, onCreated }: { onClose: () => void; onCreated: (slug: string) => void }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'General', level: 'Beginner', duration: '', author: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const slug = slugify(form.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      await apiFetch('/api/admin/courses', {
        method: 'POST',
        body: JSON.stringify({ ...form, slug }),
      });
      onCreated(slug);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light dark:border-dm-border">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">New Course</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Title *">
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AEM Basics" autoFocus />
          </Field>
          {form.title && <p className="text-xs text-gray-400 -mt-2">Slug: <code className="font-mono">{slug}</code></p>}
          <Field label="Description">
            <textarea className={`${inputCls} h-20 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AEM" />
            </Field>
            <Field label="Level">
              <select className={inputCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Duration">
              <input className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 2 hours" />
            </Field>
            <Field label="Author">
              <input className={inputCls} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author name" />
            </Field>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || !form.title.trim()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? 'Creating…' : 'Create Course'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Item Editor Modal */

function ItemEditorModal({ courseSlug, state, onClose, onSaved }: {
  courseSlug: string;
  state: ItemEditorState;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(state);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        order: parseInt(form.order) || 0,
        duration: form.duration,
        content: form.content,
      };
      if (form.type === 'exercise') {
        body.difficulty = form.difficulty;
        body.objectives = form.objectives.split('\n').map((s) => s.trim()).filter(Boolean);
        body.hints = form.hints.split('\n').map((s) => s.trim()).filter(Boolean);
      }

      if (form.isNew) {
        body.slug = slugify(form.slug || form.title);
        await apiFetch(`/api/admin/content?courseSlug=${courseSlug}&type=${form.type}`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
      } else {
        await apiFetch(`/api/admin/content?courseSlug=${courseSlug}&type=${form.type}&slug=${form.slug}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const typeLabel = form.type === 'exercise' ? 'Exercise' : 'Lesson';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light dark:border-dm-border flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{form.isNew ? `New ${typeLabel}` : `Edit ${typeLabel}: ${state.title}`}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title *">
                <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={`${typeLabel} title`} autoFocus />
              </Field>
              {form.isNew && (
                <Field label="Slug">
                  <input className={inputCls} value={form.slug || slugify(form.title)} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" />
                </Field>
              )}
              <Field label="Order">
                <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} min={0} />
              </Field>
              <Field label="Duration">
                <input className={inputCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 15 min" />
              </Field>
            </div>
            {form.type === 'exercise' && (
              <>
                <Field label="Difficulty">
                  <select className={inputCls} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    <option value="">None</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </Field>
                <Field label="Objectives (one per line)">
                  <textarea className={`${inputCls} h-20 resize-none`} value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} placeholder="What learners will accomplish..." />
                </Field>
                <Field label="Hints (one per line)">
                  <textarea className={`${inputCls} h-16 resize-none`} value={form.hints} onChange={(e) => setForm({ ...form, hints: e.target.value })} placeholder="Optional hints..." />
                </Field>
              </>
            )}
            <Field label="Content (Markdown)">
              <textarea
                className={`${inputCls} font-mono text-xs resize-none`}
                style={{ minHeight: '240px' }}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write markdown content here…"
                spellCheck={false}
              />
            </Field>
          </div>
          <div className="px-6 py-4 border-t border-brand-gray-light dark:border-dm-border flex items-center gap-3 flex-shrink-0">
            {error && <p className="text-red-500 text-sm flex-1">{error}</p>}
            <div className="ml-auto flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-all">Cancel</button>
              <button type="submit" disabled={saving || !form.title.trim()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Shared UI */

const inputCls = 'w-full border border-brand-gray-light dark:border-dm-border dark:bg-dm-raised rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- Main Page */

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [detail, setDetail] = useState<CourseDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'lessons' | 'exercises'>('details');
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [itemEditor, setItemEditor] = useState<ItemEditorState | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const fetchCourses = useCallback(async () => {
    try {
      const data = await apiFetch('/api/admin/courses');
      setCourses(data);
      setApiError('');
    } catch {
      setApiError('Could not load courses. Make sure the dev server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const selectCourse = useCallback(async (slug: string) => {
    setSelectedSlug(slug);
    setDetail(null);
    setActiveTab('details');
    try {
      const data = await apiFetch(`/api/admin/courses/${slug}`);
      setDetail(data);
    } catch {
      setDetail(null);
    }
  }, []);

  const handleSaveDetails = async () => {
    if (!detail) return;
    setSaving(true);
    setSaveError('');
    try {
      await apiFetch(`/api/admin/courses/${detail.slug}`, {
        method: 'PUT',
        body: JSON.stringify(detail),
      });
      fetchCourses();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = (slug: string, title: string) => {
    setConfirm({
      message: `Delete course "${title}" and all its lessons and exercises? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        try {
          await apiFetch(`/api/admin/courses/${slug}`, { method: 'DELETE' });
          if (selectedSlug === slug) { setSelectedSlug(null); setDetail(null); }
          fetchCourses();
        } catch { /* noop */ }
      },
    });
  };

  const handleDeleteItem = (type: 'lesson' | 'exercise', item: ContentItem) => {
    setConfirm({
      message: `Delete ${type} "${item.title}"?`,
      onConfirm: async () => {
        setConfirm(null);
        if (!selectedSlug) return;
        try {
          await apiFetch(`/api/admin/content?courseSlug=${selectedSlug}&type=${type}&slug=${item.slug}`, { method: 'DELETE' });
          selectCourse(selectedSlug);
        } catch { /* noop */ }
      },
    });
  };

  const openNewItem = (type: 'lesson' | 'exercise') => {
    const maxOrder = Math.max(0, ...(type === 'lesson' ? detail?.lessons : detail?.exercises)?.map((i) => i.order) ?? [0]);
    setItemEditor({ type, isNew: true, slug: '', title: '', order: String(maxOrder + 1), duration: '', difficulty: '', objectives: '', hints: '', content: '' });
  };

  const openEditItem = async (type: 'lesson' | 'exercise', item: ContentItem) => {
    if (!selectedSlug) return;
    try {
      const data = await apiFetch(`/api/admin/content?courseSlug=${selectedSlug}&type=${type}&slug=${item.slug}`);
      setItemEditor({
        type,
        isNew: false,
        slug: data.slug,
        title: data.title || '',
        order: String(data.order ?? 0),
        duration: data.duration || '',
        difficulty: data.difficulty || '',
        objectives: (data.objectives || []).join('\n'),
        hints: (data.hints || []).join('\n'),
        content: data.content || '',
      });
    } catch { /* noop */ }
  };

  return (
    <AdminLayout title="Courses">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">{apiError}</div>
      )}

      <div className="flex gap-6" style={{ minHeight: '600px' }}>
        {/* Course list */}
        <div className="w-64 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">All Courses ({courses.length})</span>
            <button
              onClick={() => setShowNewCourse(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-light transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-8 px-4 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl">
              <p className="text-sm text-gray-400 mb-3">No courses yet</p>
              <button onClick={() => setShowNewCourse(true)} className="text-xs text-brand-orange font-semibold hover:underline">Create your first course</button>
            </div>
          ) : (
            <div className="space-y-1">
              {courses.map((c) => (
                <div
                  key={c.slug}
                  className={`group flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSlug === c.slug
                      ? 'border-brand-orange/40 bg-brand-orange/5 dark:bg-brand-orange/10'
                      : 'border-transparent hover:border-brand-gray-light dark:hover:border-dm-border hover:bg-white dark:hover:bg-dm-surface'
                  }`}
                  onClick={() => selectCourse(c.slug)}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${selectedSlug === c.slug ? 'text-brand-orange' : 'text-gray-800 dark:text-gray-200'}`}>{c.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.lessonCount}L · {c.exerciseCount}E · {c.level}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCourse(c.slug, c.title); }}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course editor */}
        <div className="flex-1 min-w-0">
          {!selectedSlug ? (
            <div className="h-full flex items-center justify-center bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm text-gray-400">Select a course to edit</p>
              </div>
            </div>
          ) : !detail ? (
            <div className="h-full flex items-center justify-center bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl">
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-brand-gray-light dark:border-dm-border px-4">
                {(['details', 'lessons', 'exercises'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                      activeTab === tab
                        ? 'border-brand-orange text-brand-orange'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {tab}{tab === 'lessons' ? ` (${detail.lessons.length})` : tab === 'exercises' ? ` (${detail.exercises.length})` : ''}
                  </button>
                ))}
              </div>

              {/* Details tab */}
              {activeTab === 'details' && (
                <div className="p-6 space-y-4">
                  <Field label="Title">
                    <input className={inputCls} value={detail.title} onChange={(e) => setDetail({ ...detail, title: e.target.value })} />
                  </Field>
                  <Field label="Description">
                    <textarea className={`${inputCls} h-20 resize-none`} value={detail.description} onChange={(e) => setDetail({ ...detail, description: e.target.value })} />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Category">
                      <input className={inputCls} value={detail.category} onChange={(e) => setDetail({ ...detail, category: e.target.value })} />
                    </Field>
                    <Field label="Level">
                      <select className={inputCls} value={detail.level} onChange={(e) => setDetail({ ...detail, level: e.target.value })}>
                        <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                      </select>
                    </Field>
                    <Field label="Duration">
                      <input className={inputCls} value={detail.duration} onChange={(e) => setDetail({ ...detail, duration: e.target.value })} placeholder="e.g. 2 hours" />
                    </Field>
                    <Field label="Author">
                      <input className={inputCls} value={detail.author} onChange={(e) => setDetail({ ...detail, author: e.target.value })} />
                    </Field>
                  </div>
                  <Field label="Overview Content (Markdown)">
                    <textarea
                      className={`${inputCls} font-mono text-xs resize-none`}
                      style={{ minHeight: '180px' }}
                      value={detail.content}
                      onChange={(e) => setDetail({ ...detail, content: e.target.value })}
                      spellCheck={false}
                    />
                  </Field>
                  {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
                  <button onClick={handleSaveDetails} disabled={saving} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Lessons/Exercises tab */}
              {(activeTab === 'lessons' || activeTab === 'exercises') && (() => {
                const items = activeTab === 'lessons' ? detail.lessons : detail.exercises;
                const type = activeTab === 'lessons' ? 'lesson' : 'exercise' as 'lesson' | 'exercise';
                return (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{items.length} {activeTab}</span>
                      <button
                        onClick={() => openNewItem(type)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-semibold hover:bg-brand-orange-light transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New {type}
                      </button>
                    </div>
                    {items.length === 0 ? (
                      <p className="text-sm text-gray-400 py-8 text-center">No {activeTab} yet. Add your first one above.</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.slug} className="flex items-center gap-3 p-3 rounded-lg border border-brand-gray-light dark:border-dm-border hover:border-brand-orange/30 transition-colors group">
                            <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-dm-raised text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center font-semibold flex-shrink-0">{item.order}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{item.slug}{item.duration ? ` · ${item.duration}` : ''}{item.difficulty ? ` · ${item.difficulty}` : ''}</p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditItem(type, item)} className="p-1.5 text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                              </button>
                              <button onClick={() => handleDeleteItem(type, item)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {showNewCourse && (
        <NewCourseModal
          onClose={() => setShowNewCourse(false)}
          onCreated={(slug) => { setShowNewCourse(false); fetchCourses(); selectCourse(slug); }}
        />
      )}

      {itemEditor && selectedSlug && (
        <ItemEditorModal
          courseSlug={selectedSlug}
          state={itemEditor}
          onClose={() => setItemEditor(null)}
          onSaved={() => { setItemEditor(null); selectCourse(selectedSlug); }}
        />
      )}

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </AdminLayout>
  );
}
