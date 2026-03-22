# GitHub Flavored Markdown (GFM) Reference

GFM extends standard CommonMark Markdown. This sheet covers the extras.

---

## Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell     | Cell     | Cell     |
```

**Column alignment:**
```markdown
| Left   | Centre  | Right  |
|:-------|:-------:|-------:|
| data   | data    | data   |
```

Rules:
- The separator row (second row) is **required**
- Use at least one dash (`-`) per cell in the separator
- Alignment colons are optional

---

## Task Lists

```markdown
- [x] Completed item
- [ ] Incomplete item
- [ ] Another item
```

Works inside ordered lists too:
```markdown
1. [x] First step done
2. [ ] Second step pending
```

---

## Strikethrough

```markdown
~~This text is deleted~~
```

---

## Autolinks

GFM automatically links bare URLs:
```markdown
https://example.com       ← Becomes a clickable link
user@example.com          ← Becomes a mailto link
```

---

## Fenced Code Blocks

````markdown
```language
code here
```
````

GFM uses triple backticks. Courses adds **syntax highlighting** and a **Copy button** automatically.

---

## Footnotes (GFM extension)

```markdown
Here is a statement.[^note]

[^note]: This appears at the bottom of the page.
```

---

## HTML in Markdown

GFM allows inline HTML:
```markdown
Text with <strong>inline HTML</strong> bold.

<details>
  <summary>Click to expand</summary>
  Hidden content here.
</details>
```

> **Note:** Courses renders HTML as-is (`sanitize: false`). Only use this for trusted course content.

---

## Emoji (GitHub only)

In GitHub's own renderer (not Courses):
```
:rocket: :tada: :warning:
```
In Courses, use Unicode emoji directly: 🚀 🎉 ⚠️

---

## What Standard Markdown Does NOT Support

These require GFM:

| Feature | Standard Markdown | GFM |
|---|:---:|:---:|
| Tables | ✗ | ✓ |
| Task lists | ✗ | ✓ |
| Strikethrough | ✗ | ✓ |
| Autolinks | ✗ | ✓ |
| Footnotes | ✗ | ✓ |
| Fenced code blocks | ✗ | ✓ |
