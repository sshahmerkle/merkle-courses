import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const kbDir = path.join(process.cwd(), 'content', 'kb');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
  const filePath = path.join(kbDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Article not found' });

  if (req.method === 'GET') {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return res.json({ slug, ...data, content: content.trim() });
  }

  if (req.method === 'PUT') {
    const { title, description, category, courseSlug, courseTitle, content } = req.body;
    const frontmatter: Record<string, unknown> = {
      title: title || '',
      description: description || '',
      category: category || 'General',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    if (courseSlug) frontmatter.courseSlug = courseSlug;
    if (courseTitle) frontmatter.courseTitle = courseTitle;

    fs.writeFileSync(filePath, matter.stringify(content || '', frontmatter));
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    fs.unlinkSync(filePath);
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
