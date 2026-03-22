import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import siteConfig from '@/config/site';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/resources', label: 'Resources' },
    { href: '/progress', label: 'My Progress' },
    { href: '/team', label: 'Team' },
  ];

  return (
    <nav className={`bg-white/90 dark:bg-dm-surface/95 backdrop-blur-md border-b border-brand-gray-light dark:border-dm-border sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md dark:shadow-black/40' : 'shadow-none'}`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14 gap-8">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            {siteConfig.logo ? (
              siteConfig.logoHasText ? (
                <div className="h-7 px-2 bg-gray-900 rounded-md flex items-center">
                  <Image
                    src={siteConfig.logo}
                    alt={`${siteConfig.name} logo`}
                    width={80}
                    height={28}
                    className="h-5 w-auto object-contain"
                  />
                </div>
              ) : (
                <Image
                  src={siteConfig.logo}
                  alt={`${siteConfig.name} logo`}
                  width={28}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              )
            ) : (
              <div className="w-7 h-7 bg-brand-orange rounded-md flex items-center justify-center font-black text-white text-xs group-hover:bg-brand-orange-light transition-colors">
                {siteConfig.name.charAt(0)}
              </div>
            )}
            {!siteConfig.logo && (
              <span className="font-bold text-base text-gray-900 dark:text-gray-100 tracking-tight">
                {siteConfig.name}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1 flex-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || router.pathname.startsWith(link.href + '/') && link.href !== '/';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-brand-orange bg-brand-orange/8'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dm-raised'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <ThemeToggle />
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-gray-light dark:border-dm-border text-xs font-semibold text-gray-500 dark:text-gray-400 hover:border-brand-orange/40 hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
