---
title: Creating a new page and selecting a pre-defined template
order: 4.5
duration: 30 min
difficulty: medium

objectives:
  - Navigate and find the correct page and path
  - Create the required page
  - Apply correct page properties

hints:
  - Start by defining the component's props interface with TypeScript
  - Use a Record<string, string> to map variant names to CSS classes
  - Don't forget to spread any extra HTML button attributes with ...rest
---

## Steps

1. Navigate to **'Sites'** from the main navigation.
2. Follow page path. This is where your new page will live:
3. Click **'Create'** in the top navigation.
4. Select **'Page'** from the dropdown options.

## Page properties

When creating a page in AEM, you will need to complete several basic page properties and metadata fields. These help define how the page appears within the website and how it is understood by search engines.

In most cases, the copy for these fields will be provided in the client brief or content documentation. For the purposes of this training, you can use placeholder copy until the final content is available.

## Basic Information

* **Title** -  This is the page title used within AEM and is often displayed within the website itself. It helps authors identify the page in the content tree and may also appear as the main heading on the page.
* **Name / URL** - This defines the URL of the page and forms part of the web address that users see in their browser. For example, if you added 'summer-travel-insurance' to this field it would show on the live website as [www.example.com/summer-travel-insurance](https://www.example.com/summer-travel-insurance). Best practices for URLs is to use lowercase text, replace spaces with hyphens and keep it short and descriptive.

## Metadata (SEO fields)

These fields help search engines understand the content of your page and influence how your page appears in search results.

* **Page Title (Meta Title)** -- This is the title that appears in search engine results and in the browser tab when someone visits the page. For example search result title: *'Summer Travel Insurance Guide | Company Name'.*.

The title should be clear, descriptive, and aligned with the page topic. For training purposes, placeholder text such as the following can be used: '*Sample Meta Title | Brand Name'*

* **Meta Description** -- The meta description provides a short summary of the page content that may appear beneath the page title in search engine results.

Example:

_'Learn how travel insurance works, what it covers, and how to choose the right policy for your next trip.'_

This description helps users understand what the page is about before clicking. For training, you can enter placeholder text such as:

_'This is a sample meta description used for training purposes.'_

* **Tags (if required)** -- Tags are used internally within AEM to help categorise and organise content across the site. Please leave this section blank.

5. Click '**Create'**
6. Select '**Open'** to begin editing the page.

Your page will now open in the **AEM Page Editor**, where you can begin editing the Components on your pre-defined Template.
