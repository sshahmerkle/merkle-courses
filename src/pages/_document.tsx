import { Html, Head, Main, NextScript } from 'next/document';
import siteConfig from '@/config/site';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        { <link rel="stylesheet" href="https://use.typekit.net/lja6eym.css" /> }
        {siteConfig.favicon && (
          <link rel="icon" href={siteConfig.favicon} />
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
