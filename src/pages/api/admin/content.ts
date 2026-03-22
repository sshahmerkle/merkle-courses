import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'courses');

function getFilePath(courseSlug: string, type: string, slug: string): string {
  const dir = type === 'exercise' ? 'exercises' : 'lessons';
  return path.join(contentDir, courseSlug, dir, `${slug}.md`);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { courseSlug, type, slug } = req.query as Record<string, string>;

  if (!courseSlug || !type) {
    return res.status(400).json({ error: 'courseSlug and type are required' });
  }

  if (req.method === 'GET') {
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    const filePath = getFilePath(courseSlug, type, slug);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return res.json({ slug, ...data, content: content.trim() });
  }

  if (req.method === 'POST') {
    const { slug: newSlug, title, order, duration, content, difficulty, objectives, hints } = req.body;
    if (!newSlug || !title) return res.status(400).json({ error: 'slug and title are required' });

    const safeSlug = newSlug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const filePath = getFilePath(courseSlug, type, safeSlug);
    if (fs.existsSync(filePath)) return res.status(409).json({ error: 'Already exists' });

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const frontmatter: Record<string, unknown> = {
      title,
      order: Number(order) || 0,
    };
    if (duration) frontmatter.duration = duration;
    if (type === 'exercise') {
      if (difficulty) frontmatter.difficulty = difficulty;
      if (objectives?.length) frontmatter.objectives = objectives;
      if (hints?.length) frontmatter.hints = hints;
    }

    fs.writeFileSync(filePath, matter.stringify(content || '', frontmatter));
    return res.status(201).json({ slug: safeSlug });
  }

  if (req.method === 'PUT') {
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    const filePath = getFilePath(courseSlug, type, slug);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });

    const { title, order, duration, content, difficulty, objectives, hints } = req.body;
    const frontmatter: Record<string, unknown> = {
      title: title || '',
      order: Number(order) || 0,
    };
    if (duration) frontmatter.duration = duration;
    if (type === 'exercise') {
      if (difficulty) frontmatter.difficulty = difficulty;
      if (objectives?.length) frontmatter.objectives = objectives;
      if (hints?.length) frontmatter.hints = hints;
    }

    fs.writeFileSync(filePath, matter.stringify(content || '', frontmatter));
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    const filePath = getFilePath(courseSlug, type, slug);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
    fs.unlinkSync(filePath);
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
