import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  article?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  type?: 'website' | 'article' | 'product';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  article = false,
  author,
  publishedTime,
  modifiedTime,
  type = 'website'
}) => {
  const { siteConfig } = useDocusaurusContext();
  const location = useLocation();
  
  const siteTitle = siteConfig.title;
  const siteDescription = siteConfig.tagline;
  const siteUrl = siteConfig.url;
  const currentUrl = `${siteUrl}${location.pathname}`;
  
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;
  const pageImage = image ? `${siteUrl}${image}` : `${siteUrl}/img/docusaurus-social-card.jpg`;
  const pageKeywords = keywords || 'tokenized stocks, blockchain trading, DeFi, cryptocurrency, stock tokens, digital assets';
  
  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': article ? 'Article' : 'WebSite',
    name: pageTitle,
    description: pageDescription,
    url: currentUrl,
    image: pageImage,
    ...(article && {
      author: {
        '@type': 'Organization',
        name: author || 'Tokenized Stocks Hub'
      },
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/img/logo.svg`
        }
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime
    }),
    ...(!article && {
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    })
  };
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={author || 'Tokenized Stocks Hub'} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tokenizedstocks" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={author || 'Tokenized Stocks Hub'} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="tokenized stocks" />
          <meta property="article:tag" content="blockchain" />
          <meta property="article:tag" content="DeFi" />
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="theme-color" content="#2e8555" />
      <meta name="msapplication-TileColor" content="#2e8555" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Head>
  );
};

export default SEO;