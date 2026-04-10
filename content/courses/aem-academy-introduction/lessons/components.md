---
title: Components - The Building Blocks
order: 5
duration: 15 min

quiz:
    - question: "What is the role of components in AEM authoring?"
      options:
        - "To define the overall page structure and layout"
        - "To act as reusable building blocks with specific purposes and configurations"
        - "To control user permissions and publishing workflows"
        - "To replace templates when building pages"
      answer: 1
    - question: "Which statement best describes how authors work with components?"
      options:
        - "Authors create new components for each page requirement"
        - "Authors must design separate layouts for mobile and desktop"
        - "Authors configure existing components with content, imagery, and links"
        - "Authors can freely change component functionality within AEM"
      answer: 2
---

If templates are the skeleton, components are the building blocks.

AEM comes with a set of predefined components, each with a specific purpose and layout. For example:

- Hero banners
- Text blocks
- Image components
- CTA blocks
- Push blocks
- Accordions
- Video embeds

Each component has its own configuration panel. As an author, your responsibility is to:

- Add the correct content
- Upload or select imagery
- Configure links and CTAs
- Follow the intended use of the component

For example, a Push Block component may include:

- Title
- Body copy
- CTA button
- Supporting image

While two pages may use the same template - for example, two separate article pages - the content within those pages will differ. Each page build requires its own imagery, copy, links, and configuration based on the specific brief or objective. The structure may be consistent, but the content is always tailored to the purpose of that page.

Components are added to a page and configured individually (depending on the template setup). They are also built to be responsive, meaning they automatically adapt to different screen sizes. Authors do not need to create separate mobile layouts - this behaviour is handled within the component design.

If additional variations are required - such as new CTA styles or expanded functionality - these are typically implemented through updates to the Style Guide by the design and development teams.

If entirely new components are needed to support a specific requirement, these would also be scoped, designed, and developed by the relevant teams before being made available for authors to use in AEM. Content authors work within the existing component library rather than creating new components themselves.

Although many components available "out of the box" are intentionally streamlined, this simplicity supports usability, consistency, and efficient page building.
