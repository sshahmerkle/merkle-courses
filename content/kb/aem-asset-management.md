---
title: Managing Assets in AEM DAM
description: How to upload, organise, and use digital assets from the AEM Digital Asset Manager in your pages.
category: Assets
lastUpdated: 2025-03-10
---

## What is the AEM DAM?

The **Digital Asset Manager (DAM)** is AEM's central repository for images, videos, PDFs, and other media files. All assets used on AEM pages should be stored here so they benefit from version control, metadata, and rendition management.

## Uploading Assets

1. Navigate to **Assets > Files** in the AEM navigation.
2. Open the target folder (or create a new one).
3. Click **Create > Files** and select files from your computer, or simply drag and drop files onto the folder view.
4. AEM will process the upload and generate renditions automatically.

## Organising with Folders

Keep assets organised using a consistent folder hierarchy. A common structure is:

```
/content/dam/
  your-brand/
    images/
    videos/
    documents/
```

> [!NOTE]
> Avoid spaces in folder and file names. Use hyphens instead (e.g. `product-hero.jpg`).

## Asset Metadata

Each asset has a **Properties** panel where you can add metadata such as title, description, tags, and copyright information. Good metadata makes assets easier to find and reuse.

## Using Assets on Pages

When editing a page component that accepts an image or file, click the **asset picker icon** in the edit dialog. This opens a browse panel where you can search and select assets directly from the DAM.

## Renditions

AEM automatically generates multiple renditions (resized versions) of uploaded images. These are used by components to serve appropriately sized images for different screen sizes, improving page performance.

## Expiry and Rights Management

You can set an **expiry date** on assets to receive a notification when their licence is due to expire. Expired assets display a warning badge in the DAM so you know to refresh or remove them.
