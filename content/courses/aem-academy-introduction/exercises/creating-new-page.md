---
title: Creating a new page and selecting a pre-defined template
order: 12
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

Creating a page in AEM begins by selecting the appropriate template. Templates define the overall structure of the page and determine which components can be used.

Select the following link to access the AEM environment: link to be provided

## Steps

1. Navigate to **'Sites'** from the main navigation.
2. Follow page path: Test Site (AEM-Training). Select the copy, not the tick-box.
3. Click '**Create'** in the top right navigation (blue button)
4. Select '**Page'** from the dropdown options.
5. You will be presented with a list of available templates.
6. Select Template name 'Content Page' so the tick-box appears.
7. Click '**Next'** in the top right (blue button)
8. It will now prompt you to enter the **page properties**:

## Page properties

When creating a page in AEM, you will need to complete several basic page properties and metadata fields. These help define how the page appears within the website and how it is understood by search engines.

In most cases, the copy for these fields will be provided in the client brief or content documentation. For the purposes of this training, you can use placeholder copy until the final content is available.

## Basic Information

- **Title** --  This is the page title used within AEM and is often displayed within the website itself. It helps authors identify the page in the content tree and may also appear as the main heading on the page. Add the page title as 'Test Your name' for this exercise.
- **Name / URL** -- This defines the URL of the page and forms part of the web address that users see in their browser. For example, if you added 'summer-travel-insurance' to this field it would show on the live website as [www.example.com/summer-travel-insurance](http://www.example.com/summer-travel-insurance). Best practices for URLs is to use lowercase text, replace spaces with hyphens and keep it short and descriptive. Add the Name/ URL as 'test-your-initials' for this exercise.
- Leave all other fields blank

## Metadata (SEO fields)

These fields help search engines understand the content of your page and influence how your page appears in search results.

- **Page Title (Meta Title)** -- This is the title that appears in search engine results and in the browser tab when someone visits the page. For example search result title: *'Summer Travel Insurance Guide | Company Name'.*

The title should be clear, descriptive, and aligned with the page topic. For training purposes, placeholder text such as the following can be used: '*Sample Meta Title | Brand Name'*

- **Tags (if required)** -- Tags are used internally within AEM to help categorise and organise content across the site. Please leave this section blank.

9. Click '**Create'** in the top right (blue button)
10. A pop-up will then appear. Select '**Open'** to begin editing the page.

Your page will now open in the **AEM Page Editor**, where you can begin editing the Components on your pre-defined Template.
