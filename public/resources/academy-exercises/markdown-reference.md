# Markdown Quick Reference

---

## Text Formatting

| Syntax | Output |
|---|---|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `` `inline code` `` | `inline code` |
| `**_bold italic_**` | ***bold italic*** |

---

## Headings

```markdown
# H1 — Page title (use once per document)
## H2 — Major section
### H3 — Sub-section
#### H4 — Rarely needed
```

---

## Links & Images

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover tooltip")
![Alt text](/images/photo.png)
![Alt text](/images/photo.png "Image title")
```

---

## Lists

```markdown
- Unordered item
- Another item
  - Nested item (indent 2 spaces)

1. Ordered item
2. Second item
   1. Nested ordered

- [x] Completed task
- [ ] Incomplete task
```

---

## Code

````markdown
`single backticks` for inline code

```javascript
// Fenced code block — specify the language for highlighting
const x = 1;
```
````

**Supported languages (common):** `javascript`, `typescript`, `python`, `bash`, `css`, `html`, `json`, `yaml`, `markdown`, `sql`

---

## Blockquotes & Callouts

```markdown
> Standard blockquote

> [!NOTE]
> Informational note

> [!TIP]
> Helpful tip

> [!WARNING]
> Proceed with caution

> [!IMPORTANT]
> Must-read information

> [!CAUTION]
> Destructive or irreversible action
```

---

## Tables

```markdown
| Left align | Centre align | Right align |
|:-----------|:------------:|------------:|
| Cell       |    Cell      |        Cell |
```

---

## Miscellaneous

```markdown
---          ← Horizontal rule

[^1]         ← Footnote reference in text
[^1]: Text   ← Footnote definition (usually at end of file)

<!-- comment — not rendered in output -->
```

---

## Courses-Specific Features

```markdown
:::video https://www.youtube.com/watch?v=VIDEO_ID
                           ← Responsive YouTube/Vimeo embed

:::tabs
tab: Tab Name
content...
tab: Tab 2
content...
:::
                           ← Tabbed code/content panels
```
