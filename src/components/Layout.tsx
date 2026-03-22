import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import siteConfig from '@/config/site';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = siteConfig.name, description = siteConfig.description }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title === siteConfig.name ? title : `${title}`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
