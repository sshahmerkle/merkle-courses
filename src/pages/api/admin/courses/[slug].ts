import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'courses');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query as { slug: string };
  const courseDir = path.join(contentDir, slug);
  const indexPath = path.join(courseDir, 'index.md');

  if (!fs.existsSync(indexPath)) return res.status(404).json({ error: 'Course not found' });

  if (req.method === 'GET') {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const { data, content } = matter(raw);

    const lessonsDir = path.join(courseDir, 'lessons');
    const exercisesDir = path.join(courseDir, 'exercises');

    const lessons = fs.existsSync(lessonsDir)
      ? fs
          .readdirSync(lessonsDir)
          .filter((f) => f.endsWith('.md'))
          .map((filename) => {
            const lSlug = filename.replace(/\.md$/, '');
            const lRaw = fs.readFileSync(path.join(lessonsDir, filename), 'utf-8');
            const { data: ld } = matter(lRaw);
            return { slug: lSlug, title: ld.title || lSlug, order: ld.order ?? 0, duration: ld.duration ?? '' };
          })
          .sort((a, b) => a.order - b.order)
      : [];

    const exercises = fs.existsSync(exercisesDir)
      ? fs
          .readdirSync(exercisesDir)
          .filter((f) => f.endsWith('.md'))
          .map((filename) => {
            const eSlug = filename.replace(/\.md$/, '');
            const eRaw = fs.readFileSync(path.join(exercisesDir, filename), 'utf-8');
            const { data: ed } = matter(eRaw);
            return { slug: eSlug, title: ed.title || eSlug, order: ed.order ?? 0, duration: ed.duration ?? '', difficulty: ed.difficulty ?? '' };
          })
          .sort((a, b) => a.order - b.order)
      : [];

    return res.json({ slug, ...data, content: content.trim(), lessons, exercises });
  }

  if (req.method === 'PUT') {
    const { title, description, category, level, duration, author, content } = req.body;
    const frontmatter = {
      title: title || '',
      description: description || '',
      category: category || 'General',
      level: level || 'Beginner',
      duration: duration || '',
      author: author || '',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    fs.writeFileSync(indexPath, matter.stringify(content || '', frontmatter));
    return res.json({ ok: true });
  }

  if (req.method === 'DELETE') {
    fs.rmSync(courseDir, { recursive: true, force: true });
    return res.json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
