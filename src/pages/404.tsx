import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFoundPage() {
  return (
    <Layout title="404 — Page Not Found">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="text-9xl font-black text-gray-200 dark:text-dm-border mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">The page you are looking for does not exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </Layout>
  );
}
