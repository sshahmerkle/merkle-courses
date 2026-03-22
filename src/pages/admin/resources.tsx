import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ResourceType } from '@/types';
import siteConfig from '@/config/site';

interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  type: ResourceType;
  category: string;
}

const TYPES: ResourceType[] = ['link', 'pdf', 'video', 'tool'];

const inputCls = 'w-full border border-brand-gray-light dark:border-dm-border dark:bg-dm-raised rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-brand-cyan dark:focus:border-blue-500 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function typeColor(type: ResourceType): string {
  const map: Record<ResourceType, string> = {
    link: 'bg-brand-cyan/10 text-brand-cyan dark:text-blue-400',
    pdf: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    video: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    tool: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  };
  return map[type] || map.link;
}

function ResourceModal({ resource, onClose, onSaved }: {
  resource: Partial<Resource> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !resource?.id;
  const [form, setForm] = useState<Omit<Resource, 'id'>>({
    name: resource?.name || '',
    description: resource?.description || '',
    url: resource?.url || '',
    type: resource?.type || 'link',
    category: resource?.category || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    setSaving(true);
    setError('');
    try {
      const url = isNew ? '/api/admin/resources' : `/api/admin/resources?id=${resource!.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
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
      <div className="bg-white dark:bg-dm-surface rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-gray-light dark:border-dm-border">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{isNew ? 'New Resource' : 'Edit Resource'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Name *">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Resource name" autoFocus />
          </Field>
          <Field label="URL *">
            <input type="url" className={inputCls} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
          </Field>
          <Field label="Description">
            <textarea className={`${inputCls} h-20 resize-none`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResourceType })}>
                {TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Category">
              <input className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. AEM" />
            </Field>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || !form.name.trim() || !form.url.trim()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              {saving ? 'Saving…' : isNew ? 'Add Resource' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-brand-gray-light dark:border-dm-border text-sm text-gray-600 dark:text-gray-400 hover:border-gray-300 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
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

const configResources: Resource[] = (siteConfig.resources ?? []) as Resource[];

export default function ResourcesAdmin() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [modal, setModal] = useState<Partial<Resource> | null | 'new'>(undefined as unknown as null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [filter, setFilter] = useState('All');

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/resources');
      if (!res.ok) throw new Error('API unavailable');
      setResources(await res.json());
      setApiError('');
    } catch {
      setApiError('Could not load resources. Make sure the dev server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleDelete = (r: Resource) => {
    setConfirm({
      message: `Delete resource "${r.name}"?`,
      onConfirm: async () => {
        setConfirm(null);
        await fetch(`/api/admin/resources?id=${r.id}`, { method: 'DELETE' });
        fetchResources();
      },
    });
  };

  const categories = ['All', ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean))).sort()];
  const filtered = filter === 'All' ? resources : resources.filter((r) => r.category === filter);

  return (
    <AdminLayout title="Resources">
      {apiError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">{apiError}</div>
      )}

      {/* site.ts resources — read-only */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">From site.ts <span className="font-normal text-gray-400">({configResources.length})</span></h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-dm-raised px-2 py-0.5 rounded-full">Read-only — edit in src/config/site.ts</span>
        </div>
        <div className="space-y-2">
          {configResources.map((r) => (
            <div key={r.name} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dm-raised border border-brand-gray-light dark:border-dm-border rounded-xl opacity-80">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor(r.type)}`}>{r.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-300 truncate">{r.name}</p>
                {r.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{r.description}</p>}
              </div>
              {r.category && <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{r.category}</span>}
              <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Admin-managed resources */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300">Admin-managed <span className="font-normal text-gray-400">({resources.length})</span></h2>
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
          </div>
          <button
            onClick={() => setModal('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Resource
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl border-dashed">
            <p className="text-sm text-gray-400 mb-2">{resources.length === 0 ? 'No admin-managed resources yet' : 'No resources in this category'}</p>
            <button onClick={() => setModal('new')} className="text-xs text-brand-orange font-semibold hover:underline">Add one now</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-4 bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl hover:border-brand-orange/30 transition-colors group">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColor(r.type)}`}>{r.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{r.name}</p>
                  {r.description && <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{r.description}</p>}
                  <p className="text-xs text-gray-300 dark:text-gray-600 font-mono truncate">{r.url}</p>
                </div>
                {r.category && <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{r.category}</span>}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => setModal(r)} className="p-1.5 text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(r)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal != null && (
        <ResourceModal
          resource={modal === 'new' ? {} : modal as Partial<Resource>}
          onClose={() => setModal(null as unknown as null)}
          onSaved={() => { setModal(null as unknown as null); fetchResources(); }}
        />
      )}

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </AdminLayout>
  );
}
