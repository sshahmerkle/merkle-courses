import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import readingTime from 'reading-time';
import hljs from 'highlight.js';
import { CourseMetadata, Course, Lesson, LessonMeta, ExerciseMeta, Exercise, CourseItemMeta, TocItem } from '@/types';

const contentDir = path.join(process.cwd(), 'content', 'courses');

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractToc(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3;
    const text = match[2].replace(/<[^>]+>/g, '');
    toc.push({ id: slugify(text), text, level });
  }
  return toc;
}

function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (_, level, attrs, content) => {
    const text = content.replace(/<[^>]+>/g, '');
    const id = slugify(text);
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}

function applySyntaxHighlighting(html: string): string {
  return html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, encoded) => {
      const decoded = encoded
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
      try {
        const highlighted = hljs.highlight(decoded, { language: lang, ignoreIllegals: true }).value;
        return `<pre><code class="language-${lang} hljs">${highlighted}</code></pre>`;
      } catch {
        return `<pre><code class="language-${lang} hljs">${encoded}</code></pre>`;
      }
    }
  );
}

const CALLOUT_TYPES: Record<string, { label: string; icon: string }> = {
  NOTE:      { label: 'Note',      icon: 'ℹ️' },
  TIP:       { label: 'Tip',       icon: '💡' },
  WARNING:   { label: 'Warning',   icon: '⚠️' },
  IMPORTANT: { label: 'Important', icon: '❗' },
  CAUTION:   { label: 'Caution',   icon: '🚫' },
};

function applyCallouts(html: string): string {
  const typePattern = Object.keys(CALLOUT_TYPES).join('|');
  const regex = new RegExp(
    `<blockquote>\\s*<p>\\[!(${typePattern})\\]\\n?([\\s\\S]*?)<\\/p>\\s*<\\/blockquote>`,
    'g'
  );
  return html.replace(regex, (_, type, content) => {
    const { label, icon } = CALLOUT_TYPES[type];
    return `<div class="callout callout-${type.toLowerCase()}"><div class="callout-title">${icon} ${label}</div><div class="callout-body">${content.trim()}</div></div>`;
  });
}

function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

function preprocessVideoEmbeds(markdown: string): string {
  return markdown.replace(/^:::video\s+(https?:\/\/\S+)$/gm, (_, url) => {
    const embedUrl = getVideoEmbedUrl(url);
    if (!embedUrl) return `[${url}](${url})`;
    return `<div class="video-embed"><iframe width="100%" height="420" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
  });
}

// Extracts raw <video> HTML from markdown, replacing each with a safe placeholder
// that remark will wrap in a <p> tag. Prevents remark's HTML block parser from
// consuming subsequent markdown content into the video block.
function extractVideoBlocks(markdown: string): { markdown: string; blocks: string[] } {
  const blocks: string[] = [];

  // Normalise self-closing <video … /> to explicit open/close pairs
  let md = markdown.replace(/<video\b([^>]*?)\/>/gi, '<video$1></video>');

  // Extract complete <video>…</video> blocks (including multiline / <source> children)
  md = md.replace(/<video\b[\s\S]*?<\/video>/gi, (match) => {
    const idx = blocks.length;
    blocks.push(`<div class="video-embed">${match}</div>`);
    return `\n\n%%VIDBLOCK_${idx}%%\n\n`;
  });

  // Extract any remaining unclosed <video> tags and add a closing tag
  md = md.replace(/<video\b[^>]*>/gi, (match) => {
    const idx = blocks.length;
    blocks.push(`<div class="video-embed">${match}</video></div>`);
    return `\n\n%%VIDBLOCK_${idx}%%\n\n`;
  });

  return { markdown: md, blocks };
}

function restoreVideoBlocks(html: string, blocks: string[]): string {
  if (blocks.length === 0) return html;
  return html.replace(/<p>%%VIDBLOCK_(\d+)%%<\/p>/g, (_, idx) => blocks[parseInt(idx)]);
}

function applyTabs(html: string): string {
  return html.replace(/<p>:::tabs<\/p>([\s\S]*?)<p>:::<\/p>/g, (_, inner) => {
    const parts = inner.split(/<p>tab:\s*([^<]+)<\/p>/);
    // parts: [preContent, label1, content1, label2, content2, ...]
    const tabs: Array<{ label: string; content: string }> = [];
    for (let i = 1; i < parts.length; i += 2) {
      tabs.push({ label: parts[i].trim(), content: (parts[i + 1] || '').trim() });
    }
    if (tabs.length === 0) return inner;
    const btns = tabs.map((t, i) =>
      `<button class="tab-btn${i === 0 ? ' active' : ''}" role="tab" data-tab="${i}">${t.label}</button>`
    ).join('');
    const panels = tabs.map((t, i) =>
      `<div class="tab-panel${i === 0 ? ' active' : ''}" data-panel="${i}">${t.content}</div>`
    ).join('');
    return `<div class="tabs-widget" data-tabs><div class="tabs-header" role="tablist">${btns}</div>${panels}</div>`;
  });
}

function processHtml(html: string): string {
  return applyCallouts(applySyntaxHighlighting(applyTabs(injectHeadingIds(html))));
}

export function getAllCourses(): CourseMetadata[] {
  if (!fs.existsSync(contentDir)) return [];
  const courseDirs = fs.readdirSync(contentDir).filter((f) =>
    fs.statSync(path.join(contentDir, f)).isDirectory()
  );
  return courseDirs.map((slug) => getCourseMetadata(slug)).filter(Boolean) as CourseMetadata[];
}

export function getCourseMetadata(slug: string): CourseMetadata | null {
  const indexPath = path.join(contentDir, slug, 'index.md');
  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, 'utf-8');
  const { data } = matter(raw);
  const lessonsDir = path.join(contentDir, slug, 'lessons');
  const exercisesDir = path.join(contentDir, slug, 'exercises');

  let lessons: LessonMeta[] = [];
  if (fs.existsSync(lessonsDir)) {
    lessons = fs.readdirSync(lessonsDir)
      .filter((f) => f.endsWith('.md'))
      .map((filename) => {
        const lessonSlug = filename.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(lessonsDir, filename), 'utf-8');
        const { data: ld } = matter(raw);
        return {
          slug: lessonSlug,
          title: ld.title || lessonSlug,
          order: ld.order || 0,
          duration: ld.duration ?? null,
          type: 'lesson' as const,
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  let exercises: ExerciseMeta[] = [];
  if (fs.existsSync(exercisesDir)) {
    exercises = fs.readdirSync(exercisesDir)
      .filter((f) => f.endsWith('.md'))
      .map((filename) => {
        const exerciseSlug = filename.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(exercisesDir, filename), 'utf-8');
        const { data: ed } = matter(raw);
        return {
          slug: exerciseSlug,
          title: ed.title || exerciseSlug,
          order: ed.order || 0,
          duration: ed.duration ?? null,
          type: 'exercise' as const,
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'General',
    level: data.level || 'Beginner',
    duration: data.duration || '',
    author: data.author || 'Anonymous',
    lastUpdated: data.lastUpdated ? String(data.lastUpdated) : '',
    coverImage: data.coverImage ?? null,
    files: (() => {
      const resourcesDir = path.join(process.cwd(), 'public', 'resources', slug);
      const scanned = fs.existsSync(resourcesDir)
        ? fs.readdirSync(resourcesDir)
            .filter((f) => fs.statSync(path.join(resourcesDir, f)).isFile())
            .map((f) => ({ name: f, file: f }))
        : [];
      const fromFrontmatter: { name: string; file: string }[] = data.files ?? [];
      // Frontmatter entries take precedence; auto-scanned fills the rest
      const frontmatterFiles = new Set(fromFrontmatter.map((e) => e.file));
      return [...fromFrontmatter, ...scanned.filter((e) => !frontmatterFiles.has(e.file))];
    })(),
    lessons,
    exercises,
  };
}

export async function getCourse(slug: string): Promise<Course | null> {
  const indexPath = path.join(contentDir, slug, 'index.md');
  if (!fs.existsSync(indexPath)) return null;

  const raw = fs.readFileSync(indexPath, 'utf-8');
  const { content } = matter(raw);
  const { markdown, blocks } = extractVideoBlocks(preprocessVideoEmbeds(content));
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown);
  const meta = getCourseMetadata(slug);
  if (!meta) return null;

  return { ...meta, content: restoreVideoBlocks(processHtml(processed.toString()), blocks) };
}

export async function getLesson(courseSlug: string, lessonSlug: string): Promise<Lesson | null> {
  const lessonPath = path.join(contentDir, courseSlug, 'lessons', `${lessonSlug}.md`);
  if (!fs.existsSync(lessonPath)) return null;

  const raw = fs.readFileSync(lessonPath, 'utf-8');
  const { data, content } = matter(raw);
  const { markdown, blocks } = extractVideoBlocks(preprocessVideoEmbeds(content));
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown);
  const html = restoreVideoBlocks(processHtml(processed.toString()), blocks);
  const rt = readingTime(content);
  const meta = getCourseMetadata(courseSlug);
  if (!meta) return null;

  const allItems: CourseItemMeta[] = [...meta.lessons, ...meta.exercises].sort((a, b) => a.order - b.order);
  const idx = allItems.findIndex((item) => item.type === 'lesson' && item.slug === lessonSlug);

  return {
    slug: lessonSlug,
    title: data.title || lessonSlug,
    order: data.order || 0,
    duration: data.duration ?? null,
    type: 'lesson' as const,
    content: html,
    toc: extractToc(html),
    courseSlug,
    courseTitle: meta.title,
    readingTime: rt.text,
    prev: idx > 0 ? allItems[idx - 1] : null,
    next: idx < allItems.length - 1 ? allItems[idx + 1] : null,
    quiz: data.quiz ?? [],
    resources: data.resources ?? [],
  };
}

export async function getExercise(courseSlug: string, exerciseSlug: string): Promise<Exercise | null> {
  const exercisePath = path.join(contentDir, courseSlug, 'exercises', `${exerciseSlug}.md`);
  if (!fs.existsSync(exercisePath)) return null;

  const raw = fs.readFileSync(exercisePath, 'utf-8');
  const { data, content } = matter(raw);
  const { markdown, blocks } = extractVideoBlocks(preprocessVideoEmbeds(content));
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown);
  const html = restoreVideoBlocks(processHtml(processed.toString()), blocks);
  const rt = readingTime(content);
  const meta = getCourseMetadata(courseSlug);
  if (!meta) return null;

  const allItems: CourseItemMeta[] = [...meta.lessons, ...meta.exercises].sort((a, b) => a.order - b.order);
  const idx = allItems.findIndex((item) => item.type === 'exercise' && item.slug === exerciseSlug);

  return {
    slug: exerciseSlug,
    title: data.title || exerciseSlug,
    order: data.order || 0,
    duration: data.duration ?? null,
    type: 'exercise' as const,
    content: html,
    toc: extractToc(html),
    courseSlug,
    courseTitle: meta.title,
    readingTime: rt.text,
    prev: idx > 0 ? allItems[idx - 1] : null,
    next: idx < allItems.length - 1 ? allItems[idx + 1] : null,
    resources: data.resources ?? [],
    difficulty: data.difficulty ?? null,
    objectives: data.objectives ?? [],
    hints: data.hints ?? [],
  };
}
