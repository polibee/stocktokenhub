import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Tokenized Stocks Hub',
  tagline: 'Your Gateway to Tokenized Stock Trading',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://stocktokenhub.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'stocktokenhub', // Usually your GitHub org/user name.
  projectName: 'stocktokenhub', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: 0, // 禁用Recent posts侧边栏
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Tokenized Stocks Hub',
      logo: {
        alt: 'Tokenized Stocks Hub Logo',
        src: 'img/logo.svg',
      },
      items: [
        { 
          label: 'Home', 
          to: '/', 
          position: 'left',
          'aria-label': 'Home'
        },
        { 
          label: 'Tokenized Stocks', 
          to: '/products-overview', 
          position: 'left',
          'aria-label': 'Tokenized Stocks'
        },
        { 
          label: 'Platform Comparison', 
          to: '/platforms-compare', 
          position: 'left',
          'aria-label': 'Platform Comparison'
        },
        { 
          label: 'Tutorials', 
          to: '/tutorials', 
          position: 'left',
          'aria-label': 'Tutorials'
        },
        { 
          label: 'FAQ', 
          to: '/docs/faq', 
          position: 'left',
          'aria-label': 'FAQ'
        },
        { 
          label: 'Compliance', 
          to: '/compliance', 
          position: 'left',
          'aria-label': 'Compliance'
        },

        {
          href: 'https://github.com/stocktokenhub/stocktokenhub',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Products',
          items: [
            {
              label: 'Tokenized Stocks',
              to: '/products-overview',
            },
            {
              label: 'Platform Comparison',
              to: '/platforms-compare',
            },
          ],
        },
        {
          title: 'Learning',
          items: [
            {
              label: 'Trading Tutorials',
              to: '/tutorials',
            },
            {
              label: 'FAQ',
              to: '/docs/faq',
            },
            {
              label: 'Compliance',
              to: '/compliance',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Telegram',
              href: 'https://t.me/tokenizedstocks',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/tokenizedstocks',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/stocktokenhub/stocktokenhub',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              to: '/docs/legal/privacy-policy',
            },
            {
              label: 'Disclaimer',
              to: '/docs/legal/disclaimer',
            },
            {
              label: 'Affiliate Disclosure',
              to: '/docs/legal/affiliate-disclosure',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tokenized Stocks Hub. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
