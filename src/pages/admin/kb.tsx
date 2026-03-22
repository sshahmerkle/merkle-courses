import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface KbArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  courseSlug: string;
  courseTitle: string;
  lastUpdated: string;
  content?: string;
}

const inputCls = 'w-full border border-brand-gray-light dark:border-dm-border dark:bg-dm-raised rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

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

interface ArticleEditorProps {
  article: Partial<KbArticle> & { isNew?: boolean };
  onClose: () => void;
  onSaved: () => void;
}

function ArticleEditor({ article, onClose, onSaved }: ArticleEditorProps) {
  const isNew = article.isNew ?? false;
  const [form, setForm] = useState({
    slug: article.slug || '',
    title: article.title || '',
    description: article.description || '',
    category: article.category || 'General',
    courseSlug: article.courseSlug || '',
    courseTitle: article.courseTitle || '',
    content: article.content || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const derivedSlug = form.slug || slugify(form.title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError('');
    try {
      let res: Response;
      if (isNew) {
        res = await fetch('/api/admin/kb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, slug: derivedSlug }),
        });
      } else {
        res = await fetch(`/api/admin/kb/${article.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div
        className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light dark:border-dm-border flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {isNew ? 'New KB Article' : `Edit: ${article.title}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title *">
                <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Article title" autoFocus />
              </Field>
              {isNew && (
                <Field label="Slug">
                  <input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title) || 'auto-generated'} />
                </Field>
              )}
              <Field label="Category">
                <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Authoring" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={`${inputCls} h-16 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short summary..." />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Related Course Slug">
                <input className={inputCls} value={form.courseSlug} onChange={(e) => setForm({ ...form, courseSlug: e.target.value })} placeholder="e.g. aem-academy-introduction" />
              </Field>
              <Field label="Related Course Title">
                <input className={inputCls} value={form.courseTitle} onChange={(e) => setForm({ ...form, courseTitle: e.target.value })} placeholder="e.g. AEM Academy Introduction" />
              </Field>
            </div>
            <Field label="Content (Markdown)">
              <textarea
                className={`${inputCls} font-mono text-xs resize-none`}
                style={{ minHeight: '280px' }}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your article in Markdown…"
                spellCheck={false}
              />
            </Field>
          </div>
          <div className="px-6 py-4 border-t border-brand-gray-light dark:border-dm-border flex items-center gap-3 flex-shrink-0">
            {error && <p className="text-red-500 text-sm flex-1">{error}</p>}
            <div className="ml-auto flex gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-all">Cancel</button>
              <button type="submit" disabled={saving || !form.title.trim()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                {saving ? 'Saving…' : isNew ? 'Create Article' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function KbAdmin() {
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [editor, setEditor] = useState<(Partial<KbArticle> & { isNew?: boolean }) | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/kb');
      if (!res.ok) throw new Error('API unavailable');
      setArticles(await res.json());
      setApiError('');
    } catch {
      setApiError('Could not load articles. Make sure the dev server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const openEdit = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/kb/${slug}`);
      const data = await res.json();
      setEditor({ ...data, isNew: false });
    } catch { /* noop */ }
  };

  const handleDelete = (a: KbArticle) => {
    setConfirm({
      message: `Delete article "${a.title}"? This cannot be undone.`,
      onConfirm: async () => {
        setConfirm(null);
        await fetch(`/api/admin/kb/${a.slug}`, { method: 'DELETE' });
        fetchArticles();
      },
    });
  };

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category))).sort()];
  const filtered = articles
    .filter((a) => filter === 'All' || a.category === filter)
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Knowledge Base">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">{apiError}</div>
      )}

      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                filter === cat
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-white dark:bg-dm-surface text-gray-500 dark:text-gray-400 border-brand-gray-light dark:border-dm-border hover:border-brand-orange/40 hover:text-brand-orange'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="border border-brand-gray-light dark:border-dm-border dark:bg-dm-raised rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors w-48"
          />
          <button
            onClick={() => setEditor({ isNew: true })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-light transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Article
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl">
          <p className="text-sm text-gray-400 mb-3">{articles.length === 0 ? 'No articles yet' : 'No articles match your filters'}</p>
          {articles.length === 0 && <button onClick={() => setEditor({ isNew: true })} className="text-xs text-brand-orange font-semibold hover:underline">Write your first article</button>}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div key={a.slug} className="flex items-start gap-3 p-4 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl hover:border-brand-orange/30 transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-600 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
                    {a.category}
                  </span>
                  {a.courseTitle && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20">
                      {a.courseTitle}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{a.title}</p>
                {a.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{a.description}</p>}
                <p className="text-xs text-gray-300 dark:text-gray-600 font-mono mt-1">{a.slug}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                <button onClick={() => openEdit(a.slug)} className="p-1.5 text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(a)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editor && (
        <ArticleEditor
          article={editor}
          onClose={() => setEditor(null)}
          onSaved={() => { setEditor(null); fetchArticles(); }}
        />
      )}

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </AdminLayout>
  );
}
