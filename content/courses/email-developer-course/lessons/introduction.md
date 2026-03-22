---
title: Introduction
order: 1
duration: 5 min
---

This course is structured with a series of modules that are intended to enhance your learning of HTML email coding, catering to individuals at all skill levels from novice to advanced.

The lessons provided will be continuously updated in accordance with current best practices and methods, ensuring that even after completing all modules, individuals can refer back to them for the most recent information.

Begin your journey with the introductory email coding lessons.

> [!IMPORTANT]
>**This self-paced course provides an introductory overview of Email Development while also delving into certain areas in greater detail. Participants may find it necessary to pursue additional self-study to fully understand topics that are related and / or not addressed within this course.**
>
>**The HTML and CSS code provided in this course is intended solely for educational and demonstration purposes. While it can be used in real-world scenarios, its primary function is to support the learning objectives and tasks of this course. It is important to note that there are various approaches to developing HTML emails, and the code presented here may not be fully suitable or compatible for your specific needs or those of your clients.**

## What is HTML and CSS?

### HTML

HTML stands for Hypertext Markup Language, which is the coding language utilised to compose the content of a HTML email.

A HTML email consists of various HTML elements, typically comprised of an opening tag, a closing tag, and content in between. For instance, consider the following code snippet:

```
<h1>Hello World</h1>
```

In the coding project, we utilise opening and closing tags to define elements in HTML. For example, an `<h1>` opening tag represents an "h1 element," serving as a level 1 heading, typically the primary header in the email. Following the content within the element, such as `Hello World` the closing tag `</h1>` is used to denote the end of the element.

The standard structure for HTML elements involves enclosing the element name within triangular brackets to open and then closing it with. However, there are exceptions to this rule, such as self-closing tags. One common example is the image tag, written as:

```
<img src="my-dog.jpg" alt="An image of a black Lakeland Terrier dog" />
```

In HTML, self-closing tags do not require the '/' at the end and are therefore optional.

In this example, we can also observe the use of attributes such as `src=` and `alt=`. These are HTML attributes, and can be included in the opening tags of elements to provide additional configuration, such as `style=`, which will be discussed further below.

### CSS

CSS stands for Cascading Style Sheets, which is the language used to enhance and format the appearance of our email content. These styles are utilised to modify the presentation of the HTML elements we have generated, ensuring they align with our desired aesthetics. There are three methods in which CSS can be implemented:

#### CSS Methods

- Linked styles refer to storing CSS in a separate file and then linking it to our HTML file using a `<link>` element. This method is more commonly utilised for websites rather than email templates.
- Embedded styles refer to the CSS being contained within a `<style>` element within the same code as the HTML.
- Inline styles Where the CSS is applied inline to an HTML element within a style attribute `style=""`

Embedded and inline styles are used for email development. Linked stylesheets are not common in HTML emails.

CSS is written using a syntax of properties and values. To illustrate, let's examine the code provided below.

```
text-align: left;
```

We are using the property of text-align, followed by a colon, to set the value to `left` and end with a semi-colon ';'. This code will align the text of this element to the left-hand side.

The priority is always on maintaining the property, with any spaces being replaced by a dash '-'. A colon is utilised to separate the property from its corresponding value. The value can vary in format depending on the property used, with a semi-colon marking the end of each statement.

> [!TIP]
>Ensure that your CSS code is error-free and that there are no broken media queries (which will be addressed later in this course). Email clients may be sensitive to the styling applied in an HTML code. Failure to meet specific email client policies could result in the email breaking or being flagged as malicious.
>
>W3C CSS Validator
>
>See more in the Resources & tools section

## Email vs Web Code

In both email and web design, HTML and CSS are used to create content and style. While HTML and CSS are considered safe, JavaScript can pose security risks and is not supported in emails, only on the web. This raises the question: why is JavaScript allowed on the web but not in email?

Consider the way users access websites - by typing a URL into a browser or clicking on search results. Users actively seek out websites. In contrast, emails are delivered to users.

For a malicious attack, such as installing a virus on a user's computer, the user must actively visit the website. If the same were possible with emails, simply opening an email could be risky. Email is an open protocol, allowing anyone to email you. Even with restrictions on email code, there remains a potential risk. For example, someone could send a link to a malicious website, but the user must still click on it to encounter any danger.

Given that HTML and CSS are generally safe, why are they more restricted in email than on the web? Email code is filtered through an "HTML Sanitiser" to remove or modify certain elements. This is done to enhance user safety. Consider a scenario where someone sends a link to a dangerous website via email. Without restrictions, they could manipulate the appearance of the link to cover the entire email client. In this case, clicking the "mark as spam" button would actually direct the user to the malicious link. This is just one example of the security risks that email clients address when implementing these sanitisers.

Another significant difference lies in consistency. While web browsers may have slight variations in feature support, these differences are more pronounced across email clients. Each email client develops its own HTML sanitisers based on their research and approaches, resulting in variations between clients.
