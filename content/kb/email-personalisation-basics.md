---
title: Email Personalisation Basics
description: An introduction to personalisation tokens, dynamic content, and segmentation in digital messaging campaigns.
category: Email
lastUpdated: 2025-02-20
---

## What is Personalisation?

Personalisation means tailoring email content to each individual recipient based on data you hold about them — their name, preferences, past behaviour, or segment membership. Even simple personalisation (like a first-name greeting) can significantly improve open rates and click-through.

## Personalisation Tokens

A **personalisation token** is a placeholder in your email template that is replaced with a recipient-specific value at send time. Common examples:

| Token | Replaced with |
|---|---|
| `{{first_name}}` | Recipient's first name |
| `{{email}}` | Recipient's email address |
| `{{account_number}}` | The recipient's account reference |

> [!WARNING]
> Always provide a **fallback value** for every token. If the field is blank for some recipients, the fallback prevents awkward gaps like "Hello, !" — instead showing "Hello, there!".

## Dynamic Content Blocks

Beyond token replacement, you can show or hide entire content blocks based on audience rules. For example:

- Show a loyalty rewards banner only to customers with 500+ points
- Display different hero images for UK vs US recipients
- Include a renewal reminder block only for subscribers whose contract ends within 30 days

Dynamic blocks are defined by **rules** in your sending platform, evaluated per recipient at send time.

## Segmentation

Good personalisation starts with good segmentation. Break your audience into meaningful groups before defining content rules:

1. **Demographic** — location, age, job role
2. **Behavioural** — past purchases, email engagement, website activity
3. **Lifecycle stage** — new subscriber, active customer, lapsed

## Testing Personalised Emails

Before sending, always:

- Send a **seed list** with test records that exercise every branch of dynamic content
- Use your platform's **preview with data** feature to verify tokens render correctly
- Check the fallback values work for records with missing data

## Best Practices

- Keep personalisation relevant — over-personalisation can feel intrusive
- Respect preference centres and unsubscribe requests immediately
- Document which data fields each template depends on so the team can maintain it
