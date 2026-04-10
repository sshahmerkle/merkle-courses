---
title: Publishing Workflow
order: 8
duration: 15 min

quiz:
    - question: "What happens after a page is created in AEM?"
      options:
        - "It is automatically published to the live environment"
        - "It is deleted unless approved immediately"
        - "It moves through a review and approval workflow before publishing"
        - "It is only visible to developers"
      answer: 2
    - question: "Which of the following is part of best practice before submitting a page for publishing?"
      options:
        - "Skipping testing to speed up delivery"
        - "Only reviewing content on desktop devices"
        - "Checking links, assets, and formatting before submission"
        - "Publishing first, then fixing issues later"
      answer: 2
---

Creating a page does not automatically make it live.

AEM uses a publishing workflow to move content from:

- Author environment → Review → Publish environment

Typical flow:

1. Page is created and built
2. Content is reviewed internally
3. Page is submitted to the client for approval
4. Approved content is published to live

Best practices before submitting for publishing. These steps would be outlined in a QA checklist and supplied in each project:

- Check links are working
- Validate CTA URLs
- Confirm assets are correct
- Review copy and formatting
- Test across device previews

Think of this as a pre-flight checklist before take-off.
