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
  url: 'https://stocktokenhub.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'stocktokenhub', // Usually your GitHub org/user name.
  projectName: 'stocktokenhub', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Custom fields for SEO metadata
  customFields: {
    seoMetadata: [
      {name: 'keywords', content: 'tokenized stocks, blockchain trading, DeFi, cryptocurrency, stock tokens, digital assets'},
      {name: 'description', content: 'Comprehensive guide to tokenized stock trading on blockchain. Learn about DEX, CEX, and DeFi platforms for trading digital stock tokens.'},
      {name: 'author', content: 'Tokenized Stocks Hub'},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Tokenized Stocks Hub'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@Coinowodrop'},
    ],
    // Google AdSense Auto Ads Configuration
    googleAdsense: {
      dataAdClient: 'ca-pub-8597282005680903', // Replace with your AdSense publisher ID
      enabled: true,
    },
  },

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

  plugins: [
    // Google Analytics
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-6H2GG7ZT3C', // Replace with your Google Analytics tracking ID
        anonymizeIP: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    // SEO configuration
    metadata: [
      {name: 'robots', content: 'index,follow'},
      {name: 'googlebot', content: 'index,follow,max-video-preview:-1,max-image-preview:large,max-snippet:-1'},
      {property: 'og:image', content: '/img/docusaurus-social-card.jpg'},
      {property: 'og:image:width', content: '1200'},
      {property: 'og:image:height', content: '630'},
      {name: 'twitter:image', content: '/img/docusaurus-social-card.jpg'},
      {name: 'twitter:card', content: 'summary_large_image'},
      {name: 'twitter:site', content: '@Coinowodrop'},
    ],
    // Add Google AdSense script to head
    headTags: [
      {
        tagName: 'script',
        attributes: {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8597282005680903',
          crossorigin: 'anonymous',
        },
      },
    ],
    // Algolia search (optional)
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'stocktokenhub',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
    },
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
