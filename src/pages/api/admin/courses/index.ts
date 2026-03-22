import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content', 'courses');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (!fs.existsSync(contentDir)) return res.json([]);
    const slugs = fs
      .readdirSync(contentDir)
      .filter((f) => fs.statSync(path.join(contentDir, f)).isDirectory());

    const courses = slugs
      .map((slug) => {
        const indexPath = path.join(contentDir, slug, 'index.md');
        if (!fs.existsSync(indexPath)) return null;
        const raw = fs.readFileSync(indexPath, 'utf-8');
        const { data } = matter(raw);
        const lessonsDir = path.join(contentDir, slug, 'lessons');
        const exercisesDir = path.join(contentDir, slug, 'exercises');
        const lessonCount = fs.existsSync(lessonsDir)
          ? fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.md')).length
          : 0;
        const exerciseCount = fs.existsSync(exercisesDir)
          ? fs.readdirSync(exercisesDir).filter((f) => f.endsWith('.md')).length
          : 0;
        return {
          slug,
          title: data.title || slug,
          description: data.description || '',
          category: data.category || 'General',
          level: data.level || 'Beginner',
          duration: data.duration || '',
          author: data.author || '',
          lessonCount,
          exerciseCount,
        };
      })
      .filter(Boolean);

    return res.json(courses);
  }

  if (req.method === 'POST') {
    const { slug, title, description, category, level, duration, author } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });

    const safeSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const courseDir = path.join(contentDir, safeSlug);

    if (fs.existsSync(courseDir)) return res.status(409).json({ error: 'A course with this slug already exists' });

    fs.mkdirSync(path.join(courseDir, 'lessons'), { recursive: true });
    fs.mkdirSync(path.join(courseDir, 'exercises'), { recursive: true });

    const content = '';
    const frontmatter = {
      title,
      description: description || '',
      category: category || 'General',
      level: level || 'Beginner',
      duration: duration || '',
      author: author || '',
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    fs.writeFileSync(path.join(courseDir, 'index.md'), matter.stringify(content, frontmatter));

    return res.status(201).json({ slug: safeSlug });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
