import siteConfig from '@/config/site';

export default function Footer() {
  const { footer } = siteConfig;
  return (
    <footer className="border-t border-brand-gray-light dark:border-dm-border mt-16">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <p className="text-gray-400 dark:text-gray-500 text-xs">&copy; {new Date().getFullYear()} {footer.copyright}</p>
        <p className="text-gray-300 dark:text-gray-600 text-xs">{footer.note}</p>
      </div>
    </footer>
  );
}
