import Link from 'next/link';
import Layout from '@/components/Layout';
import { getAllKbArticles, getKbArticle } from '@/lib/kb';
import { KbArticle } from '@/types';

interface Props {
  article: KbArticle;
}

export default function KbArticlePage({ article }: Props) {
  return (
    <Layout title={article.title} description={article.description}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <nav className="text-sm text-gray-400 mb-10 flex items-center gap-2 animate-fade-in-up">
          <Link href="/" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/resources" className="hover:text-brand-cyan dark:hover:text-blue-400 transition-colors">Resources</Link>
          <span>/</span>
          <span className="text-gray-700 dark:text-gray-300">{article.title}</span>
        </nav>

        <div className="grid lg:grid-cols-4 gap-12">
          <article className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '40ms' }}>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-dm-raised text-gray-600 dark:text-gray-400 border border-brand-gray-light dark:border-dm-border">
                {article.category}
              </span>
              {article.courseSlug && (
                <Link
                  href={`/courses/${article.courseSlug}`}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-orange/10 text-brand-orange border border-brand-orange/20 hover:bg-brand-orange hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {article.courseTitle ?? 'View course'}
                </Link>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-gray-100 mb-3">{article.title}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">{article.description}</p>

            {article.lastUpdated && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-8">Last updated: {article.lastUpdated}</p>
            )}

            <div className="border-t border-brand-gray-light dark:border-dm-border mb-10" />

            <div className="prose-custom" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          <aside className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <div className="sticky top-24 space-y-4">
              <div className="bg-white dark:bg-dm-surface border border-brand-gray-light dark:border-dm-border rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">About this article</h4>
                <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-orange font-bold">&#x2713;</span>
                    Category: <span className="font-medium text-gray-700 dark:text-gray-300">{article.category}</span>
                  </li>
                  {article.lastUpdated && (
                    <li className="flex items-center gap-2">
                      <span className="text-brand-orange font-bold">&#x2713;</span>
                      Updated: <span className="font-medium text-gray-700 dark:text-gray-300">{article.lastUpdated}</span>
                    </li>
                  )}
                  {article.courseSlug && (
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange font-bold mt-0.5">&#x2713;</span>
                      <span>
                        Related to{' '}
                        <Link
                          href={`/courses/${article.courseSlug}`}
                          className="font-medium text-brand-cyan dark:text-blue-400 hover:underline"
                        >
                          {article.courseTitle ?? article.courseSlug}
                        </Link>
                      </span>
                    </li>
                  )}
                </ul>
              </div>

              <Link
                href="/resources"
                className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-cyan dark:hover:text-blue-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Resources
              </Link>
            </div>
          </aside>
        </div>

      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const articles = getAllKbArticles();
  return {
    paths: articles.map((a) => ({ params: { slug: a.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = await getKbArticle(params.slug);
  if (!article) return { notFound: true };
  return { props: { article } };
}
