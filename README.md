# Courses

> A markdown-powered static course website. Write your course content in plain markdown files and get a beautiful, fast, professionally designed course site - deployable anywhere.

---

## Table of Contents

- [Courses](#courses)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Run Locally](#run-locally)
    - [Build for Production](#build-for-production)
  - [Content Structure](#content-structure)
    - [Course Configuration](#course-configuration)
    - [Lessons](#lessons)
    - [Exercises](#exercises)
    - [Downloadable Files](#downloadable-files)
  - [Markdown Features](#markdown-features)
    - [GitHub Flavoured Markdown](#github-flavoured-markdown)
    - [Syntax Highlighting](#syntax-highlighting)
    - [Callout Blocks](#callout-blocks)
    - [Video Embeds](#video-embeds)
    - [Tabs Widget](#tabs-widget)
  - [UI Features](#ui-features)
    - [Progress Tracking](#progress-tracking)
    - [Quizzes](#quizzes)
    - [Exercise Features](#exercise-features)
    - [Notes](#notes)
    - [Certificates](#certificates)
    - [Dark Mode](#dark-mode)
    - [Print / Save PDF](#print--save-pdf)
  - [Deployment](#deployment)
    - [Option 1: Netlify (Recommended)](#option-1-netlify-recommended)
    - [Option 2: GitHub Pages](#option-2-github-pages)
      - [One-time setup](#one-time-setup)
      - [Custom domain](#custom-domain)
    - [Option 3: Docker](#option-3-docker)
      - [Using Docker directly](#using-docker-directly)
      - [Using Docker Compose](#using-docker-compose)
    - [Option 4: Other Static Hosts](#option-4-other-static-hosts)
  - [Project Structure](#project-structure)
  - [Tech Stack](#tech-stack)

---

## Features

- **Markdown-first**: Write all content in `.md` files with YAML frontmatter - no CMS or database needed
- **Lessons + Exercises**: Mix lessons and practical exercises in any order within a course
- **Progress tracking**: Browser-based progress tracking with completion percentages, stored in localStorage
- **Interactive quizzes**: Multiple-choice knowledge checks with scoring and explanations
- **Personal notes**: Per-course notepad with export to Markdown - one shared note file across all lessons and exercises
- **Completion certificates**: Printable/saveable certificates for completed courses - download as PDF or PNG image
- **Syntax highlighting**: 190+ languages via highlight.js
- **Rich markdown**: Callouts, video embeds, tabs, GFM tables, task lists, and more
- **Dark mode**: Full dark theme with system preference detection
- **Fully static**: No server required - deploys to Netlify, GitHub Pages, Docker, or any CDN
- **Responsive**: Mobile-first layout with sticky sidebars on desktop

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd courses
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

Static files are output to the `out/` directory.

---

## Content Structure

All course content lives in the `content/courses/` directory:

```text
content/
└── courses/
    └── your-course-slug/
        ├── index.md              ← Course overview and metadata
        ├── lessons/
        │   ├── 01-intro.md
        │   ├── 02-setup.md
        │   └── ...
        └── exercises/
            ├── ex-01-practice.md
            └── ...
```

Lessons and exercises are interleaved in the course by their `order` frontmatter field - a lesson with `order: 2` and an exercise with `order: 3` will appear consecutively in that sequence.

---

### Course Configuration

Each course requires an `index.md` in its directory:

```yaml
---
title: My Course Title
description: A brief description shown in course cards and meta tags
category: Development
level: Beginner          # Beginner | Intermediate | Advanced
duration: 2 hours
author: Your Name
lastUpdated: 2024-01-01
coverImage: /images/cover.png   # optional
files:
  - name: Starter Files
    file: starter.zip
  - name: Cheat Sheet
    file: cheatsheet.pdf
---

## Course overview content here...
```

| Field | Required | Description |
| --- | --- | --- |
| `title` | Yes | Displayed in cards and page titles |
| `description` | Yes | Shown on cards and course overview |
| `category` | No | Used for filtering on the courses page |
| `level` | No | `Beginner`, `Intermediate`, or `Advanced` |
| `duration` | No | Free-text, e.g. `"2.5 hours"` |
| `author` | No | Shown on the course overview page |
| `lastUpdated` | No | Date string, shown in metadata |
| `coverImage` | No | URL to a cover image |
| `files` | No | Course-level downloadable files (see [Downloadable Files](#downloadable-files)) |

---

### Lessons

```yaml
---
title: Getting Started
order: 1
duration: 15 min
quiz:
  - question: What does HTML stand for?
    options:
      - HyperText Markup Language
      - HighText Machine Language
      - HyperText and links Markup Language
    answer: 0
    explanation: HTML stands for HyperText Markup Language.
resources:
  - name: Lesson Slides
    file: lesson-1-slides.pdf
---

# Getting Started

Your lesson content here...
```

| Field | Required | Description |
| --- | --- | --- |
| `title` | Yes | Lesson heading and sidebar label |
| `order` | Yes | Controls position within the course (interleaved with exercises) |
| `duration` | No | Shown in the course contents list |
| `quiz` | No | Array of multiple-choice questions (see [Quizzes](#quizzes)) |
| `resources` | No | Lesson-specific downloadable files |

---

### Exercises

```yaml
---
title: Build a Navigation Bar
order: 3
duration: 30 min
difficulty: medium        # easy | medium | hard
objectives:
  - Create a responsive navbar using flexbox
  - Add a working hamburger menu for mobile
  - Style active link states
hints:
  - Use `display: flex` with `justify-content: space-between` on the nav element
  - The hamburger menu can be toggled with a CSS class and a JavaScript click handler
  - The `:is(a.active)` selector targets the current page link
resources:
  - name: Starter HTML
    file: navbar-starter.html
---

## Exercise: Build a Navigation Bar

Your exercise description here...
```

| Field | Required | Description |
| --- | --- | --- |
| `title` | Yes | Exercise heading and sidebar label |
| `order` | Yes | Controls position within the course (interleaved with lessons) |
| `duration` | No | Shown in the course contents list |
| `difficulty` | No | `easy`, `medium`, or `hard` - shown as a coloured badge |
| `objectives` | No | Checklist items shown in the Objectives panel |
| `hints` | No | Array of hint strings revealed one at a time |
| `resources` | No | Exercise-specific downloadable files |

---

### Downloadable Files

Files can be attached to courses, lessons, and exercises. There are two ways to register them:

**1. Frontmatter (manual, takes precedence):**

```yaml
files:        # for courses (index.md)
  - name: Display Name
    file: filename.zip

resources:    # for lessons and exercises
  - name: Starter Code
    file: starter.zip
```

**2. Auto-scan (automatic):** Any file placed in `public/resources/[course-slug]/` is automatically detected and added to the course files list. Frontmatter entries take precedence over auto-scanned files with the same filename.

Files are served from `/resources/[course-slug]/[filename]` and rendered as download buttons.

---

## Markdown Features

All lesson and exercise content is written in Markdown and supports the following features.

### GitHub Flavoured Markdown

Full [GFM](https://github.github.com/gfm/) support via `remark-gfm`:

| Feature | Syntax |
| --- | --- |
| Tables | `\| col \| col \|` with separator row |
| Task lists | `- [x] done` / `- [ ] todo` |
| Strikethrough | `~~text~~` |
| Autolinks | Bare URLs auto-linked |
| Footnotes | `[^1]` reference + `[^1]: text` definition |
| Fenced code | ` ```language ` with language identifier |

---

### Syntax Highlighting

Fenced code blocks are automatically syntax-highlighted using highlight.js (190+ languages):

````markdown
```javascript
const greet = (name) => `Hello, ${name}!`;
```

```python
def greet(name):
    return f"Hello, {name}!"
```

```sql
SELECT * FROM users WHERE active = true;
```
````

Supported languages include: `javascript`, `typescript`, `python`, `bash`, `css`, `html`, `json`, `yaml`, `markdown`, `sql`, `go`, `rust`, `java`, `php`, `ruby`, `c`, `cpp`, and many more.

---

### Callout Blocks

Use GitHub-style callout syntax inside blockquotes:

```markdown
> [!NOTE]
> Informational note - used for supplementary context.

> [!TIP]
> Helpful tip - used for best practices and shortcuts.

> [!WARNING]
> Warning - used to flag potential issues.

> [!IMPORTANT]
> Important - used for must-read information.

> [!CAUTION]
> Caution - used for destructive or irreversible actions.
```

Each callout type renders with a distinct icon, label, and colour scheme.

---

### Video Embeds

Embed a responsive YouTube or Vimeo video using the `:::video` directive on its own line:

```markdown
:::video https://www.youtube.com/watch?v=VIDEO_ID

:::video https://youtu.be/VIDEO_ID

:::video https://vimeo.com/123456789
```

The video renders as a responsive 16:9 iframe. YouTube Shorts URLs (`/shorts/VIDEO_ID`) are also supported.

---

### Tabs Widget

Display content in switchable tabs:

`````markdown
:::tabs
tab: HTML
```html
<button class="btn">Click me</button>
```

tab: CSS
```css
.btn { background: blue; color: white; }
```

tab: JavaScript
```js
document.querySelector('.btn').addEventListener('click', () => alert('clicked'));
```
:::
`````

The `:::tabs` block opens the widget, each `tab: Label` starts a new panel, and `:::` closes the widget.

---

## UI Features

### Progress Tracking

Progress is tracked entirely in the browser (localStorage) - no account or server needed.

- Each lesson and exercise has a **Mark as Complete** toggle button
- Progress is displayed as a percentage bar on course cards, the course overview sidebar, and the lesson sidebar
- Course cards show **separate progress bars** for lessons and exercises
- A course is considered **complete** only when all lessons and exercises are marked done
- Completed items show a green checkmark in the course contents list and sidebar

---

### Quizzes

Add multiple-choice knowledge checks to any lesson via the `quiz` frontmatter field:

```yaml
quiz:
  - question: Which CSS property controls spacing inside an element?
    options:
      - margin
      - padding
      - border
      - gap
    answer: 1
    explanation: padding controls the space between the content and its border. margin controls the space outside the element.
```

| Field | Description |
| --- | --- |
| `question` | The question text |
| `options` | Array of answer choices (2–6 recommended) |
| `answer` | Zero-based index of the correct option |
| `explanation` | Optional text shown after submission |

**Quiz behaviour:**

- All questions must be answered before submitting
- Correct answers are highlighted green, incorrect answers red
- Explanations appear after submission
- Score is shown with emoji feedback (100% = celebration, 50%+ = good, below 50% = keep studying)
- Answers and submission state persist in localStorage
- A "Try Again" button resets the quiz

---

### Exercise Features

Exercise pages include several interactive components not found on lesson pages:

**Difficulty Badge** - shown at the top of the exercise page:

- `easy` - green badge with 1 indicator dot
- `medium` - amber badge with 2 indicator dots
- `hard` - red badge with 3 indicator dots

**Objectives Panel** - an interactive checklist of learning goals:

- Each objective in the `objectives` frontmatter array appears as a checkbox
- Progress bar fills as objectives are checked off
- When all objectives are checked, the **Mark as Complete** button glows to signal readiness
- Checked state persists in localStorage per exercise

**Hints Panel** - reveals hints one at a time:

- Each hint in the `hints` frontmatter array is hidden by default
- Clicking "Show hint N" reveals the next hint progressively
- Encourages attempting the exercise before looking at hints

**Timer** - an elapsed time counter that starts automatically when the exercise page loads, displayed in MM:SS format.

---

### Notes

Every lesson and exercise page has a floating notes panel (bottom-right corner):

- Click the notepad icon to open the notes panel
- Notes are shared across all lessons and exercises in a course - one note per course
- Notes are auto-saved to localStorage as you type
- A green dot on the icon indicates existing notes
- Click **Export** to download your notes as a `.md` file named `{course-slug}-notes.md` in the format:

```markdown
# Course Title

## My Notes

Your notes here...
```

A **Download Notes** button also appears on the course overview page (in the sidebar, below the Continue/Review Course button) whenever notes exist for that course.

---

### Certificates

When all lessons and exercises in a course are complete:

1. A **Get Certificate** button appears on the course overview page
2. Clicking it opens a modal to enter your full name
3. A certificate is generated showing your name, the course title, and the completion date
4. Use **Print / Save PDF** to open a print-ready window and save as PDF
5. Use **Save as Image** to download the certificate as a PNG file

The name entered is saved to localStorage - the certificate can only be generated once per course and the name cannot be changed afterwards.

---

### Dark Mode

- Defaults to the system's `prefers-color-scheme` setting
- Toggle with the sun/moon button in the navbar
- Preference is saved to localStorage and persists across visits
- All pages, components, and code blocks are fully themed

---

### Print / Save PDF

Every lesson and exercise page has a **Print** button. When printing:

- The sidebar, navigation, and UI controls are hidden
- A clean header with the course and lesson title is shown at the top
- Video embeds and tab widgets are hidden (not printable)
- The certificate prints on a full page with platform branding

---

## Deployment

### Option 1: Netlify (Recommended)

1. Push your repository to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
3. Select your repository
4. Build settings are auto-configured via `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `out`
5. Click **Deploy site**

Your site will be live at `https://your-site.netlify.app` within minutes.

**Custom domain**: Go to **Domain settings** in the Netlify dashboard → **Add custom domain**.

---

### Option 2: GitHub Pages

GitHub Pages is free for public repositories and deploys automatically on every push to `main`.

#### One-time setup

1. Push your repository to GitHub
2. Go to your repo → **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow at `.github/workflows/deploy-gh-pages.yml` handles everything automatically

Every push to `main` triggers a build and deploy. Your site will be live at:

```text
https://<your-username>.github.io/<your-repo-name>/
```

#### Custom domain

1. Add a `CNAME` file to `public/` containing your domain:

   ```text
   docs.example.com
   ```

2. Remove the `BASE_PATH` env var line from the workflow file (not needed when serving from a root domain)
3. Configure your DNS to point to GitHub Pages

**Notes:** `BASE_PATH` is automatically set to `/<repo-name>` so all links resolve correctly under a sub-path. The `.nojekyll` file in `public/` prevents GitHub from running Jekyll (which would break the `_next/` asset directory).

---

### Option 3: Docker

#### Using Docker directly

```bash
# Build the image
docker build -t courses .

# Run (serves on port 3000)
docker run -p 3000:80 courses
```

Open [http://localhost:3000](http://localhost:3000).

#### Using Docker Compose

```bash
# Production (serves on port 3000)
docker-compose up

# Development with hot reload (serves on port 3001)
docker-compose --profile dev up courses-dev
```

**Notes:** The production image uses **nginx:alpine** to serve static files - final image is ~25 MB. For cloud deployment (AWS ECS, GCP Cloud Run, etc.), push the image to your registry and deploy normally.

---

### Option 4: Other Static Hosts

`npm run build` outputs plain static files to `out/`, which can be deployed anywhere:

| Host | Command |
| --- | --- |
| Vercel | `vercel --prod` |
| AWS S3 + CloudFront | `aws s3 sync out/ s3://your-bucket` |
| Surge.sh | `surge out/` |

---

## Project Structure

```text
courses/
├── content/
│   └── courses/              ← Markdown course content
│       └── course-slug/
│           ├── index.md
│           ├── lessons/
│           └── exercises/
├── public/
│   ├── resources/            ← Downloadable files per course
│   │   └── course-slug/
│   └── images/               ← Static images
├── src/
│   ├── components/           ← React UI components
│   ├── config/
│   │   └── site.ts           ← Site name, team, resources config
│   ├── hooks/                ← useProgress, useNotes, useLastVisited
│   ├── lib/
│   │   └── courses.ts        ← Markdown parsing and content utilities
│   ├── pages/                ← Next.js pages (routes)
│   │   └── courses/
│   │       └── [slug]/
│   │           ├── index.tsx        ← Course overview
│   │           ├── [lesson].tsx     ← Lesson page
│   │           └── exercises/
│   │               └── [exercise].tsx  ← Exercise page
│   ├── styles/
│   │   └── globals.css       ← Tailwind + custom styles
│   └── types/
│       └── index.ts          ← TypeScript interfaces
├── .github/
│   └── workflows/
│       └── deploy-gh-pages.yml
├── Dockerfile
├── docker-compose.yml
├── netlify.toml
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## Tech Stack

| Tool | Purpose |
| --- | --- |
| [Next.js 14](https://nextjs.org) | React framework, static export |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | YAML frontmatter parsing |
| [remark](https://github.com/remarkjs/remark) + [remark-gfm](https://github.com/remarkjs/remark-gfm) | Markdown to HTML with GFM |
| [highlight.js](https://highlightjs.org) | Syntax highlighting (190+ languages) |
| [reading-time](https://github.com/ngryman/reading-time) | Estimated reading time per lesson |
| [html2canvas](https://html2canvas.hertzen.com) | Certificate image export (PNG download) |
| [nginx](https://nginx.org) | Static file serving in Docker |

---
