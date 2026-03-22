import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const kbDir = path.join(process.cwd(), 'content', 'kb');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!fs.existsSync(kbDir)) return res.json([]);
    const articles = fs
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
          lastUpdated: data.lastUpdated ? String(data.lastUpdated) : '',
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
    return res.json(articles);
  }

  if (req.method === 'POST') {
    const { slug, title, description, category, courseSlug, courseTitle, content } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });

    const safeSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const filePath = path.join(kbDir, `${safeSlug}.md`);
    if (fs.existsSync(filePath)) return res.status(409).json({ error: 'An article with this slug already exists' });

    if (!fs.existsSync(kbDir)) fs.mkdirSync(kbDir, { recursive: true });

    const frontmatter: Record<string, unknown> = {
      title,
      description: description || '',
      category: category || 'General',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    if (courseSlug) frontmatter.courseSlug = courseSlug;
    if (courseTitle) frontmatter.courseTitle = courseTitle;

    fs.writeFileSync(filePath, matter.stringify(content || '', frontmatter));
    return res.status(201).json({ slug: safeSlug });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
