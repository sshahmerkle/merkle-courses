---
title: AEM Component Authoring Basics
description: An overview of how to author and configure components in Adobe Experience Manager using the page editor.
category: Authoring
courseSlug: academy-introduction
courseTitle: Academy Introduction
lastUpdated: 2025-03-01
---

## What is Component Authoring?

In Adobe Experience Manager (AEM), component authoring is the process of placing and configuring reusable content blocks — called **components** — on a page using the Page Editor. Authors can drag components from the component browser onto the page canvas and configure them via their edit dialogs without writing any code.

## The Page Editor

The AEM Page Editor provides a visual, in-context editing experience. When a page is opened in edit mode, each component is outlined and offers a toolbar with actions such as:

- **Edit** — opens the component's configuration dialog
- **Configure** — access policy or design settings
- **Copy / Paste** — duplicate components across the page
- **Delete** — remove a component from the layout

## Placing a Component

1. Open your page in the Page Editor.
2. Click the **+** icon in any editable paragraph system (parsys).
3. Browse or search for the component you want to insert.
4. Click the component to place it, then open its **Edit** dialog to configure it.

## Component Dialogs

Each component exposes an **Edit Dialog** — a form that controls what content is displayed. Common fields include:

- Text fields for titles and body copy
- Image asset pickers
- Toggle switches for layout variants
- Multifield lists for repeating items

> [!TIP]
> Use the **Preview** mode to see exactly how the page will look to visitors before publishing.

## Allowed Components

Administrators control which components are available in each editable area using **Template Policies**. If a component you need is not showing in the browser, ask your AEM administrator to add it to the relevant template policy.

## Publishing Content

Once you are happy with your changes, use the **Page Properties > Publish** action or the quick-publish button in the top toolbar to make the page live.
