import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getAllKbArticles } from '@/lib/kb';
import siteConfig from '@/config/site';
import { KbArticleMeta, Resource, ResourceType } from '@/types';

interface Props {
  articles: KbArticleMeta[];
  dynamicResources: Resource[];
}

const typeConfig: Record<ResourceType, { label: string; icon: JSX.Element; color: string }> = {
  link: {
    label: 'Link',
    color: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  pdf: {
    label: 'PDF',
    color: 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  video: {
    label: 'Video',
    color: 'text-purple-600 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  tool: {
    label: 'Tool',
    color: 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const cfg = typeConfig[resource.type];
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-6 hover:border-brand-cyan/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${cfg.color}`}>
          {cfg.icon}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {resource.category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-600 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
              {resource.category}
            </span>
          )}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-brand-cyan dark:group-hover:text-blue-400 transition-colors">
        {resource.name}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{resource.description}</p>
      <div className="flex items-center gap-1 mt-4 text-xs font-medium text-brand-cyan dark:text-blue-400">
        Open
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
}

function KbCard({ article }: { article: KbArticleMeta }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-6 hover:border-brand-cyan/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-600 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
          {article.category}
        </span>
        {article.courseSlug && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {article.courseTitle ?? 'Course'}
          </span>
        )}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-brand-cyan dark:group-hover:text-blue-400 transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{article.description}</p>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-gray-light dark:border-dm-border">
        {article.lastUpdated ? (
          <span className="text-xs text-gray-400 dark:text-gray-500">Updated {article.lastUpdated}</span>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium text-brand-cyan dark:text-blue-400 flex items-center gap-1">
          Read
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function ResourcesPage({ articles, dynamicResources = [] }: Props) {
  const resources: Resource[] = [...(siteConfig.resources ?? []), ...dynamicResources];
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category))).sort()];
  const [activeCategory, setActiveCategory] = useState('All');

  const resourceCategories = ['All', ...Array.from(new Set(resources.map((r) => r.category).filter(Boolean))).sort()] as string[];
  const [activeResourceCategory, setActiveResourceCategory] = useState('All');

  const filteredResources = activeResourceCategory === 'All'
    ? resources
    : resources.filter((r) => r.category === activeResourceCategory);

  const filtered = activeCategory === 'All'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <Layout title={`Resources | ${siteConfig.name}`} description="Links, references, and knowledge base articles for the team.">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-12 animate-fade-in-up">
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-gray-300">Resources</span>
          </nav>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-gray-100 mb-3">Resources</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
            Useful links, references, and a knowledge base of articles to support your learning.
          </p>
        </div>

        {resources.length > 0 && (
          <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Quick Links</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-500 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
                {filteredResources.length}
              </span>
            </div>

            {resourceCategories.length > 2 && (
              <div className="flex flex-wrap gap-2 mb-6 mt-4">
                {resourceCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveResourceCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                      activeResourceCategory === cat
                        ? 'bg-brand-orange text-white border-brand-orange'
                        : 'bg-white dark:bg-dm-surface text-gray-500 dark:text-gray-400 border-brand-gray-light dark:border-dm-border hover:border-brand-orange/40 hover:text-brand-orange'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filteredResources.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm">No resources in this category yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredResources.map((r, i) => (
                  <div key={r.name} className="animate-fade-in-up" style={{ animationDelay: `${80 + i * 50}ms` }}>
                    <ResourceCard resource={r} />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="border-t border-brand-gray-light dark:border-dm-border mb-16" />

        <section className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Knowledge Base</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-500 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
              {articles.length}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            In-depth articles covering common questions, processes, and best practices.
          </p>

          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-brand-orange text-white border-brand-orange'
                      : 'bg-white dark:bg-dm-surface text-gray-500 dark:text-gray-400 border-brand-gray-light dark:border-dm-border hover:border-brand-orange/40 hover:text-brand-orange'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((article, i) => (
                <div key={article.slug} className="animate-fade-in-up" style={{ animationDelay: `${140 + i * 40}ms` }}>
                  <KbCard article={article} />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const articles = getAllKbArticles();

  let dynamicResources: Resource[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path') as typeof import('path');
    const resourcesFile = path.join(process.cwd(), 'content', 'resources.json');
    if (fs.existsSync(resourcesFile)) {
      const raw = fs.readFileSync(resourcesFile, 'utf-8');
      // Strip the admin-added `id` field before passing to the page
      dynamicResources = (JSON.parse(raw) as Array<Resource & { id?: string }>).map(
        ({ id: _id, ...rest }) => rest as Resource
      );
    }
  } catch {
    // file missing or malformed — fall back to empty
  }

  return { props: { articles, dynamicResources } };
}
