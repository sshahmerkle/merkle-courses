/**
 * Site configuration — edit this file to tailor the platform to your topic.
 * All pages pull from here, so you only need to change things in one place.
 */

const siteConfig = {
  // Platform identity
  name: 'Digital Messaging Courses',                          // Short brand name shown in navbar & browser tab
  logo: 'https://assets.merkle.com/is/content/merkle/merkle-logo-dt?ts=1761647221346&dpr=off',                                 // Optional: URL or path to a logo image (e.g. '/logo.png'). Leave empty to use the default letter icon.
  logoHasText: true,                        // Set to true if the logo contains text (adds a dark background so white text is visible). Set to false for icon-only logos.
  favicon: 'https://www.merkle.com/favicon.ico',                              // Optional: URL or path to a favicon (e.g. '/favicon.ico' or 'https://...'). Leave empty to use the browser default.
  tagline: 'Adobe Experience Manager Learning Hub',    // Shown on the home page hero
  description:                              // Shown in meta tags and home page sub-heading
    'The official learning hub for Digital Messaging capabilities. ' +
    'Structured courses to get your team up to speed quickly.',

  // Home page hero
  hero: {
    eyebrow: 'Digital Messaging UK',    // Small label above the headline
    headline: 'Courses',    // Two-line headline (\n = line break)
    subheading:
      'Hands-on courses built specifically for Digital Messaging capabilities.' +
      ' Work through structured lessons at your own pace and become confident in no time.',
  },

  // Courses page
  courses: {
    heading: 'Courses',
    subheading: 'Browse all available training courses.',
  },

  // Team page
  team: {
    heading: 'Meet the Team',
    subheading:
      'Have a question about a course, found an error, or need help? ' +
      'Reach out to the right person below.',
    fallbackEmail: 'DBG-CampaignSupport@merkle.com',   // "Not sure who to contact?" fallback address
    members: [
      {
        name: 'Sophie Sharratt',
        role: 'Content Author',
        bio: 'Owns the training curriculum, writes and maintains course lessons. Contact Sophie for questions about course structure, content gaps, or learning paths.',
        email: 'sophie.sharratt@merkle.com',
        initials: 'SS',
        color: 'bg-brand-orange' as const,
      },
      {
        name: 'Sunny Shah',
        role: 'Senior Email Developer',
        bio: 'Maintains the course website',
        email: 'sunny.shah@merkle.com',
        initials: 'SS',
        color: 'bg-brand-orange' as const,
      },
      {
        name: 'Jasdeep Heer',
        role: 'Head of Digital Messaging',
        bio: 'Head of Digital Messaging.',
        email: 'jasdeep.heer@merkle.com',
        initials: 'JH',
        color: 'bg-brand-orange' as const,
      },
    ],
  },

  // Resources page — add links, PDFs, tools, or videos here
  resources: [
    {
      name: 'How to author a new page in AEM',
      description: '',
      url: 'https://experienceleague.adobe.com/en/playlists/experience-manager-sites-get-started-business-users',
      type: 'link' as const,
      category: 'AEM',
    },
    {
      name: 'Navigating AEM Assets',
      description: '',
      url: 'https://experienceleague.adobe.com/en/playlists/experience-manager-assets-get-started-business-users',
      type: 'link' as const,
      category: 'AEM',
    },
    {
      name: 'How to manage multilingual sites',
      description: '',
      url: 'https://experienceleague.adobe.com/en/playlists/experience-manager-site-get-started-msm-business-users',
      type: 'link' as const,
      category: 'AEM',
    },
    {
      name: 'Experience League',
      description: 'Within Experience League you can also find more tailored AEM tutorials around the different types of training',
      url: 'https://experienceleague.adobe.com/en/home',
      type: 'link' as const,
      category: 'AEM',
    },
    {
      name: 'AEM Component Generator',
      description: 'AEM Component Generator is a java project that enables developers to generate the base structure of an AEM component using a JSON configuration file specifying component and dialog properties and other configuration options.',
      url: 'https://github.com/adobe/aem-component-generator',
      type: 'tool' as const,
      category: 'AEM',
    },
    {
      name: 'AEM OSGI Container and it\'s purpose',
      description: 'The purpose of OSGI Containers in AEM is explained in this video.',
      url: 'https://www.youtube.com/watch?v=CrAapw3gi3Q',
      type: 'video' as const,
      category: 'AEM',
    },
    {
      name: 'AEM Assets as a Cloud Service',
      description: 'Concepts of AEM Assets as a Cloud Service.',
      url: 'https://www.youtube.com/watch?v=8woUEhHmkDg',
      type: 'pdf' as const,
      category: 'AEM',
    },
    {
      name: 'Good Email Code',
      description: 'Concepts of AEM Assets as a Cloud Service.',
      url: 'https://www.youtube.com/watch?v=8woUEhHmkDg',
      type: 'link' as const,
      category: 'Email Development',
    },
    {
      name: 'Adobe XD',
      description: 'An all-in-one powerful UI/UX design solution for websites, apps & more.',
      url: 'https://adobe.com/xd',
      type: 'tool' as const,
      category: 'Design',
    },
    {
      name: 'Figma',
      description: 'Design, prototype, and gather feedback all in a single design tool.',
      url: 'https://www.figma.com/',
      type: 'tool' as const,
      category: 'Design',
    },
    {
      name: 'Cerberus',
      description: 'Build HTML emails with Tailwind CSS and advanced, email-specific post-processing.',
      url: 'https://www.cerberusemail.com/',
      type: 'link' as const,
      category: 'Email Development',
    },
    {
      name: 'MJML',
      description: 'MJML is a markup language designed to make responsive email easy.',
      url: 'https://mjml.io/',
      type: 'link' as const,
      category: 'Email Development',
    },
    {
      name: 'Email Bugs',
      description: 'A repository for documenting bugs in webmails and email applications',
      url: 'https://github.com/hteumeuleu/email-bugs/issues',
      type: 'link' as const,
      category: 'Email Development',
    },
  ],

  // Footer
  footer: {
    copyright: 'Merkle',
    note: 'Digital Messaging UK',
  },

  // Admin area — change this password before deploying
  admin: {
    password: 'admin',
  },
};

export default siteConfig;
