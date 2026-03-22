import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { KbArticleMeta, KbArticle } from '@/types';

const kbDir = path.join(process.cwd(), 'content', 'kb');

function formatDate(value: unknown): string {
  if (!value) return '';
  const d = value instanceof Date ? value : new Date(String(value));
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getAllKbArticles(): KbArticleMeta[] {
  if (!fs.existsSync(kbDir)) return [];
  return fs
    .readdirSync(kbDir)
    .filter((f) => f.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(kbDir, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        category: data.category || 'General',
        courseSlug: data.courseSlug ?? null,
        courseTitle: data.courseTitle ?? null,
        lastUpdated: formatDate(data.lastUpdated),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getKbArticle(slug: string): Promise<KbArticle | null> {
  const filePath = path.join(kbDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'General',
    courseSlug: data.courseSlug ?? null,
    courseTitle: data.courseTitle ?? null,
    lastUpdated: formatDate(data.lastUpdated),
    content: processed.toString(),
  };
}
