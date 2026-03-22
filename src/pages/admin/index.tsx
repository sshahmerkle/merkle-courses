import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

interface Stats {
  courses: number;
  lessons: number;
  exercises: number;
  kb: number;
  resources: number;
}

function StatCard({ label, value, href, color }: { label: string; value: number; href: string; color: string }) {
  const colors: Record<string, string> = {
    orange: 'bg-brand-orange/10 text-brand-orange',
    blue: 'bg-brand-cyan/10 text-brand-cyan dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  };
  return (
    <Link href={href} className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-5 hover:border-brand-orange/40 transition-colors">
      <div className={`text-2xl font-black mb-1 ${colors[color]}`}>{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ courses: 0, lessons: 0, exercises: 0, kb: 0, resources: 0 });
  const [apiAvailable, setApiAvailable] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [coursesRes, kbRes, resourcesRes] = await Promise.all([
          fetch('/api/admin/courses'),
          fetch('/api/admin/kb'),
          fetch('/api/admin/resources'),
        ]);

        if (!coursesRes.ok) { setApiAvailable(false); return; }

        const courses = await coursesRes.json();
        const kb = await kbRes.json();
        const resources = await resourcesRes.json();

        const lessons = courses.reduce((sum: number, c: { lessonCount: number }) => sum + (c.lessonCount || 0), 0);
        const exercises = courses.reduce((sum: number, c: { exerciseCount: number }) => sum + (c.exerciseCount || 0), 0);

        setStats({ courses: courses.length, lessons, exercises, kb: kb.length, resources: resources.length });
      } catch {
        setApiAvailable(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {!apiAvailable && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Dev server required</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">
              Content editing requires the development server. Run{' '}
              <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">npm run dev</code>{' '}
              to use admin features.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Courses" value={stats.courses} href="/admin/courses" color="orange" />
        <StatCard label="Lessons" value={stats.lessons} href="/admin/courses" color="blue" />
        <StatCard label="Exercises" value={stats.exercises} href="/admin/courses" color="blue" />
        <StatCard label="KB Articles" value={stats.kb} href="/admin/kb" color="purple" />
        <StatCard label="Resources" value={stats.resources} href="/admin/resources" color="green" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/admin/courses" className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-6 hover:border-brand-orange/40 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-brand-orange transition-colors">Courses</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage courses, lessons, and exercises</p>
        </Link>

        <Link href="/admin/kb" className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-6 hover:border-brand-orange/40 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-brand-orange transition-colors">Knowledge Base</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Write and edit knowledge base articles</p>
        </Link>

        <Link href="/admin/resources" className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-xl p-6 hover:border-brand-orange/40 hover:shadow-md transition-all group">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-brand-orange transition-colors">Resources</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage links, PDFs, videos, and tools</p>
        </Link>
      </div>
    </AdminLayout>
  );
}
